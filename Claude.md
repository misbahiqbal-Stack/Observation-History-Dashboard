# Claude.md

> Pointers only. Open a file below when the task actually needs it — don't load everything
> every session.

**Observation History Dashboard** — teacher classroom observation tracking (World Bank Teach
Tool), three dashboard files, active development. Full purpose / stack / conventions / common
tasks / gotchas: `.claude/skills/project-overview/SKILL.md`.

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
| One-page Q&A tool + its small backend server (needs Node) | `ask/` (see `Structure.md`) |

```
dashboard.html              # desktop dashboard, no login
observations.html           # mobile UI, no login
observations_laptop.html    # full desktop dashboard, login system
ask/                        # one-page + small server: password-gated Claude Q&A tool
```

## Commands

No build/install/test tooling for the three dashboard files — self-contained HTML, opened
directly in a browser. `ask/` is the one exception: it needs Node.js (`node ask/server.js`) —
see `Structure.md` for setup.
