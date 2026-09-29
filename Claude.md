# Claude.md

> Pointers only. Open a file below when the task actually needs it — don't load everything
> every session.

**Observation History Dashboard** — teacher classroom observation tracking (World Bank Teach
Tool), plus a password-gated Claude Q&A tool. One deployable app: `backend/server.js` serves
everything in `frontend/`. Full purpose / stack / conventions / common tasks / gotchas:
`.claude/skills/project-overview/SKILL.md`.

## Where things live

| Need | File |
|---|---|
| Full project context (start here for anything not covered below) | `.claude/skills/project-overview/SKILL.md` |
| Open tasks / current goals | `Planning.md` |
| Agent operating loop + guardrails | `Agent_loop.md` |
| Durable facts + session history | `memory.md` |
| Per-file architecture / current state | `Structure.md` |
| Architectural decisions (ADR log) | `Decision.md` |
| Task-specific playbooks (data refresh, login system, artifact publishing) | `.claude/skills/*/SKILL.md` |
| Custom subagents for repetitive workflows | `.claude/agents/*.md` |

```
frontend/                  # all served HTML — static, no build step
  dashboard.html              # desktop dashboard, no login
  observations.html           # mobile UI, no login
  observations_laptop.html    # full desktop dashboard, login system
  ask.html                     # box + button + answer, password login form
backend/                   # the one deployable unit
  server.js                   # zero-dependency Node server: static files + Ask API
  package.json                 # "start": "node server.js" — no dependencies
```

## Commands

- **Dashboards** (`frontend/*.html`): no build/install/test tooling — but now normally served
  by `backend/server.js` rather than opened by double-clicking (see `Structure.md`).
- **Run the app:** `cd backend && npm start` (or `node server.js`), then open
  `http://localhost:8787`. Needs `backend/.env` — copy from `.env.example` first.
- **Deploy:** see `Structure.md` / `Decision.md` ADR-005 for the current setup.
