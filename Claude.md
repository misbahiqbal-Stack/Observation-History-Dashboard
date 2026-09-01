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

```
dashboard.html              # desktop dashboard, no login
observations.html           # mobile UI, no login
observations_laptop.html    # full desktop dashboard, login system
```

## Commands

No build/install/test tooling — self-contained HTML files, opened directly in a browser.
