---
name: project-overview
description: Core context for the Observation History Dashboard project — purpose, tech stack, conventions, common tasks, and gotchas. Load this first for any work in this repository so you don't have to re-explore the codebase.
---

# Observation History Dashboard — Project Overview

## What this project is

A set of self-contained HTML dashboards that let school coaches, principals, and an admin
track and visualize teacher classroom-observation scores (based on the World Bank Teach Tool)
over time — so progress and trends are visible at a glance, without any software install. The
project owner is a non-technical coach/educator who edits nothing directly; all changes are
made by an AI assistant on her behalf, in plain language, confirming data structure before
building.

## Tech stack

- **Language:** HTML + CSS + vanilla JavaScript. No build step, no package manager, no framework.
- **Charts:** hand-rolled inline SVG — no charting library.
- **Data:** embedded directly in each file's JS as arrays/objects (no backend, no database).
- **Fonts/icons:** system font stack by default; `frontend/observations.html` and
  `frontend/observations_laptop.html` optionally load Google Fonts / Material Icons from a CDN — this
  breaks under Claude Artifact's CSP, see the `publish-artifact` skill for the fix.
- **Hosting:** none required — files run by double-clicking, or published as read-only Claude
  Artifacts for sharing.

## File map

| File | Role |
|---|---|
| `frontend/dashboard.html` | Desktop dashboard. No login. **Stale dataset**: 6 schools / 30 teachers (original). |
| `frontend/observations.html` | Mobile (Material Design) UI. No login. 12 schools / 120 teachers. |
| `frontend/observations_laptop.html` | Full-featured desktop dashboard. **Only file with login** (coach/principal/admin roles). Most advanced: 14 schools / 166 teacher records, multi-subject teachers, CPD recommendations. |
| `Claude.md` | Persistent instructions (loaded every session). |
| `Agent_loop.md` | The agent's operating loop + guardrails for this project. |
| `memory.md` | Durable facts, conventions, rejected approaches, session history, auto version log. |
| `Structure.md` | Per-file architecture / current state — the source of truth for what each dashboard actually contains right now. |
| `Decision.md` | ADR log — architectural decisions and why. |
| `Planning.md` | Open tasks / current goals. |
| `.claude/skills/`, `.claude/agents/` | This skill and the project's custom subagents. |

**Always check `Structure.md` before assuming what a file contains** — the three dashboards
have diverged (different school/teacher counts, different indicator names) and it's easy to
carry stale assumptions from one file into another. This has already caused a documentation
bug once (see `Decision.md` / `memory.md` session history, 2026-08-21).

## Coding conventions

- Match the style of surrounding code; don't reformat unrelated lines.
- Keep each dashboard file self-contained — no new external CDN dependencies unless the user
  explicitly accepts the tradeoff.
- Data lives in embedded JS arrays/objects per file — there is no shared data source between
  the three dashboards. Changing one does not change the others.
- Never paste large HTML file contents into `Claude.md` — rejected once already (see
  `memory.md` → "What Was Tried and Rejected").
- Percentages (0–100%), never a 1–5 scale, for all scores.

## Common tasks (and where to go for each)

- **Add/update school, teacher, or coach data** → `update-teacher-data` skill / `data-refresh-agent`.
- **Add or change a login account, role, or school code** (`frontend/observations_laptop.html` only) →
  `manage-login-system` skill / `login-account-agent`.
- **Publish or refresh a Claude Artifact** for one of the dashboards → `publish-artifact` skill
  / `artifact-publish-agent`.
- **Record a decision or bring the docs scaffold up to date after a change** →
  `doc-keeper-agent`, or manually per `Agent_loop.md`.

## Critical gotchas

1. **Three dashboards, three datasets.** Never assume a data change to one file applies to the
   others — confirm with the user which file(s) are in scope.
2. **`frontend/dashboard.html`'s desktop layout must not be changed to a mobile/card layout** — this was
   tried and explicitly rejected by the user once already.
3. **`frontend/observations_laptop.html`'s 4th indicator is "Instructional Quality"**, not "Differentiated
   Instruction" like the other two files — a real content difference, not a typo.
4. **Passwords are plain-text in source** across all login accounts in
   `frontend/observations_laptop.html` (`123` / `admin`). This is an accepted tradeoff for a
   client-side-only static file, not an oversight — don't "fix" it without asking.
5. **A PostToolUse hook auto-appends a `## Version N` entry to `memory.md`** on every
   Write/Edit in this project (except to `memory.md` itself). Don't hand-edit those entries;
   supplement the most recent one with a plain-English description of what changed.
6. **Do not change dashboard structure or scoring logic without confirming with the user
   first** — an explicit standing rule, given the owner is non-technical and reviews changes
   in plain language.
7. **Claude Artifacts enforce a strict CSP** — no external CDN requests. Any file with Google
   Fonts/Material Icons needs the substitutions documented in the `publish-artifact` skill
   before it can be published.
