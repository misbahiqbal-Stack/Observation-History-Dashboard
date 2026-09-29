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
