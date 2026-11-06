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
const APP_USERNAME = process.env.APP_USERNAME;
const APP_PASSWORD = process.env.APP_PASSWORD;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

// Dashboard logins injected into observations_laptop.html at serve time (ADR-010).
const DASHBOARD_PASSWORDS = {
  __COACH_PW__: process.env.COACH_PASSWORD,
  __PRINCIPAL_PW__: process.env.PRINCIPAL_PASSWORD,
  __ADMIN_PW__: process.env.ADMIN_PASSWORD,
};

const missingAppCredentials = [
  ['APP_USERNAME', APP_USERNAME],
  ['APP_PASSWORD', APP_PASSWORD],
].filter(([, value]) => !value).map(([name]) => name);
if (missingAppCredentials.length) {
  console.error('Missing ' + missingAppCredentials.join(' and ') +
    ' in backend/.env. Refusing to start — the login screen would be unusable. ' +
    'See .env.example.');
  process.exit(1);
}
const missingDashboardPasswords = Object.entries(DASHBOARD_PASSWORDS)
  .filter(([, value]) => !value)
  .map(([placeholder]) => placeholder.replace(/^__|_PW__$/g, '') + '_PASSWORD');
if (missingDashboardPasswords.length) {
  console.error('Missing ' + missingDashboardPasswords.join(', ') +
    ' in backend/.env. Refusing to start — observations_laptop.html would ship unusable ' +
    'placeholder passwords. See .env.example.');
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.warn('Missing ANTHROPIC_API_KEY — dashboards and login will work, but /ask will ' +
    'return "not configured" until it is set.');
}

const FRONTEND_DIR = path.join(__dirname, 'public');

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

// Reads an HTML file and substitutes any __*_PW__ placeholders with the real values from
// .env, so passwords live in the environment rather than in the committed source (ADR-010).
// Note: the substituted page still reaches the browser, so these are visible in View Source.
function renderHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  for (const [placeholder, value] of Object.entries(DASHBOARD_PASSWORDS)) {
    html = html.split(placeholder).join(value);
  }
  return html;
}

const sessions = new Set();

// Constant-time string compare. Hashing both sides first keeps the comparison length-independent,
// so a wrong-length guess costs the same as a same-length one and leaks nothing via timing.
function safeEqual(candidate, expected) {
  const a = crypto.createHash('sha256').update(String(candidate)).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

// Both fields are always checked, and the caller reports one combined error (ADR-011) — never
// "wrong password" vs "no such user", which would confirm a valid username to a guesser.
function credentialsMatch(username, password) {
  const userOk = safeEqual(username, APP_USERNAME);
  const passOk = safeEqual(password, APP_PASSWORD);
  return userOk && passOk;
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
    const pathname = req.url.split('?')[0];

    if (req.method === 'GET' && pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('ok');
    }

    if (req.method === 'GET' && pathname === '/') {
      if (!isAuthed(req)) return redirectToLogin(res, '/');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(LANDING_PAGE);
    }

    if (req.method === 'GET' && GATED_FILES[pathname]) {
      if (!isAuthed(req)) return redirectToLogin(res, pathname);
      const html = renderHtml(path.join(FRONTEND_DIR, GATED_FILES[pathname]));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }

    if (req.method === 'GET' && PUBLIC_FILES[pathname]) {
      const html = fs.readFileSync(path.join(FRONTEND_DIR, PUBLIC_FILES[pathname]));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }

    if (req.method === 'GET' && pathname === '/me') {
      return send(res, 200, { authed: isAuthed(req) });
    }

    if (req.method === 'POST' && pathname === '/login') {
      const body = await readBody(req);
      let username, password;
      try { ({ username, password } = JSON.parse(body || '{}')); } catch (e) { /* handled below */ }
      if (typeof username !== 'string' || typeof password !== 'string' ||
          !credentialsMatch(username, password)) {
        return send(res, 401, { error: 'Incorrect username or password' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      sessions.add(token);
      return send(res, 200, { ok: true }, { 'Set-Cookie': `session=${token}; HttpOnly; SameSite=Strict; Path=/` });
    }

    if (req.method === 'POST' && pathname === '/logout') {
      const cookies = parseCookies(req);
      sessions.delete(cookies.session);
      return send(res, 200, { ok: true }, { 'Set-Cookie': 'session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    }

    if (req.method === 'POST' && pathname === '/ask') {
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
