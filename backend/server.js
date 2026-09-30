'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const PORT = process.env.PORT || 8787;
const APP_PASSWORD = process.env.APP_PASSWORD;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

if (!APP_PASSWORD) {
  console.error('Missing APP_PASSWORD in backend/.env. Refusing to start.');
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.warn('Missing ANTHROPIC_API_KEY — dashboards and login will work, but /ask will ' +
    'return "not configured" until it is set.');
}

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const GATED_FILES = {
  '/dashboard.html': 'dashboard.html',
  '/observations.html': 'observations.html',
  '/observations_laptop.html': 'observations_laptop.html',
};
const PUBLIC_FILES = {
  '/ask.html': 'ask.html',
};

const LANDING_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>Observation History Dashboard</title>
<style>
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #f9f9f7; color: #0b0b0b; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .card { max-width: 420px; padding: 28px; background: #fcfcfb; border: 1px solid rgba(11,11,11,0.12); border-radius: 12px; }
  h1 { font-size: 18px; margin: 0 0 16px; }
  a { display: block; padding: 10px 0; color: #2a78d6; text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
</style></head>
<body><div class="card">
  <h1>Observation History Dashboard</h1>
  <a href="/dashboard.html">Desktop dashboard</a>
  <a href="/observations.html">Mobile UI</a>
  <a href="/observations_laptop.html">Laptop dashboard (login)</a>
  <a href="/ask.html">Ask (Claude Q&amp;A)</a>
</div></body></html>`;

const sessions = new Set();

function passwordMatches(candidate) {
  const a = Buffer.from(candidate);
  const b = Buffer.from(APP_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach(part => {
    const [k, ...v] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(v.join('='));
  });
  return out;
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  return Boolean(cookies.session && sessions.has(cookies.session));
}

function redirectToLogin(res, wantedPath) {
  res.writeHead(302, { Location: '/ask.html?next=' + encodeURIComponent(wantedPath) });
  res.end();
}

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'application/json' }, headers));
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) { req.destroy(); reject(new Error('Payload too large')); }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function askClaude(question) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: question }],
    });
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(payload),
      },
    };
    const request = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          return reject(new Error('Bad response from Anthropic API'));
        }
        if (res.statusCode >= 400) {
          return reject(new Error((parsed.error && parsed.error.message) || ('Anthropic API error ' + res.statusCode)));
        }
        const text = (parsed.content || []).map(block => block.text || '').join('');
        resolve(text);
      });
    });
    request.on('error', reject);
    request.write(payload);
    request.end();
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('ok');
    }

    if (req.method === 'GET' && req.url === '/') {
      if (!isAuthed(req)) return redirectToLogin(res, '/');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(LANDING_PAGE);
    }

    if (req.method === 'GET' && GATED_FILES[req.url]) {
      if (!isAuthed(req)) return redirectToLogin(res, req.url);
      const html = fs.readFileSync(path.join(FRONTEND_DIR, GATED_FILES[req.url]));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }

    if (req.method === 'GET' && PUBLIC_FILES[req.url]) {
      const html = fs.readFileSync(path.join(FRONTEND_DIR, PUBLIC_FILES[req.url]));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }

    if (req.method === 'GET' && req.url === '/me') {
      return send(res, 200, { authed: isAuthed(req) });
    }

    if (req.method === 'POST' && req.url === '/login') {
      const body = await readBody(req);
      let password;
      try { ({ password } = JSON.parse(body || '{}')); } catch (e) { password = undefined; }
      if (typeof password !== 'string' || !passwordMatches(password)) {
        return send(res, 401, { error: 'Wrong password' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      sessions.add(token);
      return send(res, 200, { ok: true }, { 'Set-Cookie': `session=${token}; HttpOnly; SameSite=Strict; Path=/` });
    }

    if (req.method === 'POST' && req.url === '/logout') {
      const cookies = parseCookies(req);
      sessions.delete(cookies.session);
      return send(res, 200, { ok: true }, { 'Set-Cookie': 'session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    }

    if (req.method === 'POST' && req.url === '/ask') {
      if (!isAuthed(req)) return send(res, 401, { error: 'Not logged in' });
      if (!ANTHROPIC_API_KEY) {
        return send(res, 503, { error: 'Ask tool is not configured yet — ANTHROPIC_API_KEY is missing.' });
      }
      const body = await readBody(req);
      let question;
      try { ({ question } = JSON.parse(body || '{}')); } catch (e) { question = undefined; }
      if (typeof question !== 'string' || !question.trim()) {
        return send(res, 400, { error: 'Question is empty' });
      }
      try {
        const answer = await askClaude(question.trim());
        return send(res, 200, { answer });
      } catch (e) {
        return send(res, 502, { error: 'Claude API call failed: ' + e.message });
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  } catch (e) {
    send(res, 500, { error: 'Server error: ' + e.message });
  }
});

server.listen(PORT, () => console.log(`Ask-Claude server running at http://localhost:${PORT}`));
