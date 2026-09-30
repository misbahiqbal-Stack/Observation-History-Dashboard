# Decisions.md

> An **append-only** Architecture Decision Record (ADR) log. Each entry captures a significant
> choice, the context that forced it, and its consequences. Never rewrite history — if a decision
> is reversed, add a new entry that supersedes the old one and mark the old one accordingly.

## How to add a decision

Copy the template below to the **top** of the log (newest first). Give each a sequential ID
(`ADR-001`, `ADR-002`, …) and a status.

**Statuses:** `Proposed` · `Accepted` · `Superseded by ADR-NNN` · `Deprecated`

---

### Template

```markdown
### ADR-NNN: <short title>

- **Date:** YYYY-MM-DD
- **Status:** Accepted
- **Context:** What problem or force prompted this decision?
- **Decision:** What did we decide to do?
- **Alternatives considered:** What else was on the table, and why was it rejected?
- **Consequences:** What becomes easier? What becomes harder? What follow-up is needed?
```

---

## Log

<!-- Newest entries on top. -->

### ADR-008: Fix route matching to strip the query string (bug from ADR-006)

- **Date:** 2026-09-30
- **Status:** Accepted
- **Context:** Live on Railway, every unauthenticated visit returned a plain-text "Not found"
  instead of the login page. Cause: `server.js` matched routes with exact string equality
  against Node's raw `req.url`, which includes the query string. ADR-006's own redirect sends
  browsers to `/ask.html?next=<path>` — a URL that could never match the `/ask.html` route
  entry, since `req.url` there is literally `/ask.html?next=...`, not `/ask.html`. Every
  unauthenticated visit hits this path (`redirectToLogin` always appends `?next=`), so this
  broke the login flow for anyone, not an edge case. Caught only once deployed — local testing
  after ADR-006 exercised `/ask.html` on its own but never `/ask.html?next=...`, the exact URL
  the app's own redirect produces.
- **Decision:** Derive `pathname = req.url.split('?')[0]` once at the top of the request
  handler and match every route against `pathname` instead of raw `req.url`.
- **Alternatives considered:** Using Node's `url.parse()`/`URL` class instead of a manual split
  (rejected as unnecessary — nothing here needs query-string parsing server-side, `next` is
  only ever read client-side in `ask.html` via `URLSearchParams`; a plain split is sufficient
  and keeps the zero-dependency, minimal-surface style of this file).
- **Consequences:** Login flow works end-to-end again. Lesson for next time (see `Agent_loop.md`
  / testing habits): when a handler redirects to a URL with a query string, the test suite must
  hit that exact URL — testing the bare path isn't equivalent and let this ship.

### ADR-007: Don't require ANTHROPIC_API_KEY to start the server

- **Date:** 2026-09-30
- **Status:** Accepted
- **Context:** ADR-004 made the server refuse to start (`process.exit(1)`) without
  `ANTHROPIC_API_KEY`. During first deployment (Railway), the user hadn't created an Anthropic
  Console key yet (a separate billing setup from the app's own hosting) — the missing key was
  blocking the *entire* app, including the dashboards and login, which don't use it at all.
- **Decision:** Only `APP_PASSWORD` is required to start. A missing `ANTHROPIC_API_KEY` now
  logs a warning instead of exiting; the `/ask` route itself checks for the key and returns a
  clean `503 { error: "Ask tool is not configured yet..." }` if it's absent, instead of the
  whole server failing to boot.
- **Alternatives considered:** Switching the Ask tool to a different provider to sidestep
  Anthropic's billing setup (rejected for now — the user chose Claude explicitly when this was
  planned, and other providers' free tiers aren't guaranteed to avoid the same billing-signup
  friction; revisit only if asked); making the key genuinely optional forever (rejected — the
  Ask feature's entire purpose requires *some* LLM API key, this ADR just stops it from taking
  the rest of the app down while that key isn't set yet).
- **Consequences:** The dashboards and login can deploy and work immediately without any
  Anthropic account. The Ask tool stays visibly broken (clear error, not a crash) until
  `ANTHROPIC_API_KEY` is added later. Re-verified locally: server starts with only
  `APP_PASSWORD` set, `/health`, login, and all three dashboards work; `/ask` returns a clean
  `503` instead of attempting a doomed API call.

### ADR-006: Gate every dashboard route behind the shared session, not just /ask

- **Date:** 2026-09-29
- **Status:** Accepted
- **Context:** ADR-005 made the project one deployable, publicly-reachable app. That surfaced a
  real question ADR-005 didn't address: the three dashboard pages contain named teachers,
  schools, and scores (originally sourced from a real PDF export), and
  `observations_laptop.html` has its own weak client-side login (`123`/`admin`, visible in
  source). Before ADR-006, only `/ask` required the shared session — the dashboards would have
  been reachable by anyone with the deployed URL, no password at all. Asked the user directly
  rather than assume either way, since this changes who can see real people's data.
- **Decision:** `GET /`, `/dashboard.html`, `/observations.html`, and `/observations_laptop.html`
  now require the same `APP_PASSWORD` session as `/ask` — an unauthenticated request 302s to
  `/ask.html?next=<original path>`, and a successful login redirects back to it. `/ask.html`
  itself stays reachable without a session (it has to, as the login page).
- **Alternatives considered:** Leave the dashboards public and rely on the deploy URL being
  effectively unlisted/obscure (rejected — the user chose otherwise, and "unlisted" is not real
  access control); a separate password per dashboard vs. one shared gate for everything
  (rejected — no such requirement given, and it would duplicate the session mechanism ADR-004
  already built for no added benefit yet).
- **Consequences:** One login now gates the whole app, not just the Ask tool — simpler mental
  model, but it means `observations_laptop.html`'s own separate client-side login (coach/
  principal/admin roles) is now a *second*, weaker layer behind the first; it was never
  intended as the only line of defense and still isn't, this just adds one in front of it.
  Re-verified end-to-end locally before committing (unauthenticated → 302 with the right
  `next`, authenticated → 200 on all four routes, byte-for-byte unchanged file content).

### ADR-005: Reorganize into frontend/ + backend/, one deployable app

- **Date:** 2026-09-29
- **Status:** Accepted
- **Context:** After ADR-004 added `ask/` as a self-contained tool bolted on next to the three
  standalone dashboard files, the user asked to deploy the project — which meant deciding what
  "the project" actually is as a deployable unit. Four independent static files plus one
  unrelated small server (each opened/run separately) isn't a single deployable thing.
- **Decision:** Move all served HTML into `frontend/` (the three dashboards, byte-for-byte
  unchanged, plus `ask/index.html` renamed to `ask.html`). Move the server into `backend/`,
  extended to serve `frontend/`'s static files (`/dashboard.html`, `/observations.html`,
  `/observations_laptop.html`, `/ask.html`, plus a small new landing page at `/` linking to all
  four) in addition to its existing `/login`, `/logout`, `/me`, `/ask` API. Only `/ask` requires
  a session — the dashboards keep exactly the auth (or lack of it) they had before; this reorg
  does not add security requirements to content that didn't have them. Added `backend/
  package.json` (`"start": "node server.js"`, zero dependencies) purely so deploy platforms
  detect it as a Node app.
- **Alternatives considered:** Leave the three dashboards as separately-hosted static files
  (e.g. GitHub Pages) and deploy only `ask/` as its own service (rejected — the user asked to
  deploy "this project" as one thing, and two deploy targets for one small project adds
  complexity without a real benefit here); a bundler/build step to combine everything
  (rejected — nothing in this project needs bundling; a single Node process serving static
  files plus one API route doesn't justify one).
- **Consequences:** One deployable unit, one process, one public URL, one place to set env
  vars. Every path reference to the three dashboard files across `Structure.md`, `Claude.md`,
  `.claude/skills/*`, and `.claude/agents/*` was updated to the `frontend/` prefix — re-verified
  end-to-end locally (all four pages serve with matching content; login/session/ask/logout
  cycle unchanged) before this ADR was written. Follow-up: actual deployment (hosting platform,
  env var setup) is the next step, not yet done as of this entry.

### ADR-004: ask/ — a small Node server, breaking the "no build step" convention

- **Date:** 2026-09-29
- **Status:** Accepted
- **Context:** User asked for a one-page tool (box, button, answer) that calls the Claude API,
  gated by a login, with the API key kept server-side. A pure static HTML file cannot do this —
  any API key embedded in client-side JS is visible to anyone who opens dev tools, unlike the
  project's existing plain-text dashboard passwords (which are an accepted low-stakes tradeoff
  for internal data, not a secret with external cost if leaked).
- **Decision:** Add `ask/`, a small zero-dependency Node.js server (`http`/`https`/`crypto`/`fs`
  built-ins only — no `npm install`, no `package.json`) that serves the one page, gates it with
  a single shared password (env var, constant-time compared, session via `HttpOnly` cookie), and
  proxies `/ask` to the Anthropic API using a server-side `ANTHROPIC_API_KEY` env var.
- **Alternatives considered:** A static HTML file calling Anthropic directly from the browser
  (rejected — would expose the API key to anyone viewing source); a full framework/build step
  like Express + a bundler (rejected — overkill for one endpoint, and breaks the project's
  otherwise-zero-tooling convention more than necessary); Python instead of Node (rejected only
  because neither was installed and Node matches the project's existing JS-only skillset).
- **Consequences:** This is now the one part of the project that requires a runtime (Node.js,
  not installed on the dev machine before this — installed via `winget install
  OpenJS.NodeJS.LTS`) and a running process, not just a double-clicked file. `ask/.env` (real
  password + API key) must never be committed — gitignored; only `.env.example` (placeholder
  values) is tracked. Follow-up: no real Anthropic API key has been used against it yet, so the
  success path (an actual answer coming back) is unverified — only the auth/error paths were
  tested end-to-end.

### ADR-003: Average of four indicators is the calculated "overall" score

- **Date:** 2026-06-24
- **Status:** Accepted
- **Context:** Each teacher has four latest indicator scores (Lesson Objective Clarity, Student
  Engagement, Classroom Management, Differentiated Instruction) and the dashboard needs one
  headline number per teacher.
- **Decision:** Overall = simple (unweighted) average of the four indicators. The adjacent
  "Assessment Practices" column is excluded per the user's instruction.
- **Alternatives considered:** Weighted average (rejected — no weighting rationale provided);
  using the file's "Avg Observation Score" as the only headline (rejected — that is the average
  of the six monthly visits, a different measure; both are shown and clearly labelled).
- **Consequences:** Two clearly-labelled averages coexist: "Obs Avg" (monthly visits) and
  "4-Ind Avg" (latest indicators). Changing the indicator set changes this number.

### ADR-002: Single self-contained offline HTML file as the dashboard

- **Date:** 2026-06-24
- **Status:** Accepted
- **Context:** A non-technical user needs an interactive dashboard with charts, no installation,
  and easy to share.
- **Decision:** Build `dashboard.html` — one file with data embedded and charts drawn as inline
  SVG (no external libraries/CDN), so it works fully offline by double-clicking.
- **Alternatives considered:** Excel charts (less interactive, harder to share a single live
  view); a charting library via CDN (rejected — would require internet); a hosted web app
  (rejected — overkill and needs setup).
- **Consequences:** Zero dependencies and trivial sharing. Trade-off: data is embedded in the
  file, so updating scores means regenerating the file from the source spreadsheet.

### ADR-001: Adopt the four-file agentic workflow scaffold

- **Date:** 2026-06-23
- **Status:** Accepted
- **Context:** The project needs a repeatable structure so an agent retains instructions,
  memory, rationale, and progress across sessions.
- **Decision:** Use `Claude.md` (instructions), `Memory.md` (durable facts),
  `Decisions.md` (this ADR log), and `Session_log.md` (chronological progress).
- **Alternatives considered:** A single monolithic notes file — rejected because it mixes
  stable rules with ephemeral logs and bloats per-session context.
- **Consequences:** Clear separation of concerns; each file has one job. Requires discipline
  to keep them updated, enforced via the workflow rules in `Claude.md`.
