# Claude.md

> Persistent project instructions. Loaded into the agent's context at the start of every
> session. Keep it concise — the operating loop lives in `Agent_loop.md`, durable facts in
> `memory.md`, architecture in `Structure.md`, open work in `Planning.md`, ADRs in `Decision.md`.

## 1. Project Overview

- **Name:** Observation History Dashboard
- **Purpose:** Track and visualize teacher classroom observation scores (World Bank Teach Tool)
  over time across 12 schools / 120 teachers, so a coach/admin can see progress and trends at a
  glance.
- **Status:** Active development.

## 2. Tech Stack

- **Language(s):** HTML, CSS, JavaScript — no build step.
- **Frameworks / key libraries:** None. Charts are inline SVG, no CDN dependencies (except
  `observations.html` and `observations_laptop.html`'s Google Fonts, loaded once).
- **Tooling:** None — plain text editing, opened directly in a browser.

## 3. Project Structure

See `Structure.md` for the full breakdown of each file's current state. Summary:

```
dashboard.html              # desktop dashboard, no login, 6-school dataset (stale)
observations.html           # mobile UI, no login, 12-school dataset
observations_laptop.html    # full desktop dashboard, login system, 12-school dataset
```

## 4. Commands

No build/install/test tooling — these are self-contained HTML files opened directly in a
browser (double-click, or `start dashboard.html` etc.).

## 5. Coding Conventions

- Match the style of surrounding code; do not reformat unrelated lines.
- Keep each dashboard file self-contained (no external CDN dependencies) unless the user
  accepts the tradeoff (e.g. Google Fonts in `observations.html` / `observations_laptop.html`).
- Data lives embedded in JS arrays/objects within each file — there is no external database.

## 6. Agent Workflow Rules

See `Agent_loop.md` for the full operating loop and guardrails.

## 7. Guardrails

See `Agent_loop.md` → "Guardrails".

## 8. References

- Planning / open tasks: [Planning.md](Planning.md)
- Agent operating loop: [Agent_loop.md](Agent_loop.md)
- Memory (durable facts + session history): [memory.md](memory.md)
- Structure (per-file architecture): [Structure.md](Structure.md)
- Decisions (ADR log): [Decision.md](Decision.md)
