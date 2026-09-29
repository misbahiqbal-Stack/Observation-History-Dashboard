---
name: update-teacher-data
description: Use when adding, refreshing, or reconciling school/teacher/coach data in frontend/dashboard.html, frontend/observations.html, or frontend/observations_laptop.html. Covers the deterministic rules for generating monthly/indicator scores when source data doesn't supply them, and what to update afterward.
---

# Updating Teacher/School Data

## Before touching any file

1. Read `Structure.md` to confirm the **current** dataset shape of each target file — the three
   dashboards have diverged (`frontend/dashboard.html` = 6 schools/30 teachers, `frontend/observations.html` = 12
   schools/120 teachers, `frontend/observations_laptop.html` = 14 schools/166 records). Don't assume a
   change to one applies to the others.
2. Confirm with the user **which file(s)** are in scope. Read the new source data back to them
   before building — this project's history is full of corrections caught this way (see
   `memory.md` → "Conventions Learned" and "What Was Tried and Rejected").

## Data model per teacher

Each embedded record needs:
- `school`, `name` (append `(N subjects)` to the name if the teacher covers multiple subjects —
  only `frontend/observations_laptop.html` uses this)
- `months` — 6 values, Sept→Feb, one overall score per visit. Use `null` for a missing visit,
  never `0`.
- `obsAvg` — average of the 6 monthly scores (or taken directly from source if provided)
- `trend` — `Improving` / `Steady` / `Declining`
- `cats` — 4 latest-snapshot indicator scores (see indicator names below — they differ by file)

## If the source data doesn't supply monthly/indicator scores

This has happened before (2026-06-30 refresh, source Google Sheet only had name/obsAvg/coach/tier).
The established deterministic rule set, applied per teacher based on their tier:

- **Trend**, by tier and position index `idx` within that tier's group:
  - Platinum: idx 0,1,4,5 → `Improving`; others → `Steady`
  - Gold: idx 0,3 → `Improving`; others → `Steady`
  - Silver: idx 0 → `Steady`; others → `Declining`
- **Monthly scores** (6 values from `obsAvg`), clamped to `[45, 96]`:
  - `Improving` → ramp from `obsAvg × 0.88` to `obsAvg × 1.09`
  - `Declining` → the same ramp, reversed
  - `Steady` → alternating ±4% around `obsAvg`
- **Indicator `cats`** (4 values from `obsAvg`), clamped to `[40, 98]`:
  `[obsAvg × 1.05, obsAvg × 0.97, obsAvg × 1.02, obsAvg × 0.98]`

Only use this generation when the source truly doesn't provide real scores — always prefer
real data when available, and tell the user explicitly which fields were generated vs sourced.

## Indicator names differ by file

- `frontend/dashboard.html` / `frontend/observations.html`: Lesson Objective Clarity, Student Engagement,
  Classroom Management, Differentiated Instruction.
- `frontend/observations_laptop.html`: Objective Clarity, Student Engagement, Class Management,
  **Instructional Quality** (not the same as "Differentiated Instruction" — a real content
  difference, not a renaming typo).

## After the update

1. Sort teachers alphabetically by first name within each school (established convention).
2. Update the school dropdown / `TEACHER_LIST` / `USER_DB`-adjacent structures as needed if
   schools were added or removed (see `manage-login-system` skill if `frontend/observations_laptop.html`
   is affected — new schools need principal accounts + a school code).
3. Update `Structure.md`'s per-file section with the new counts/schools.
4. Add a dated entry to `memory.md` → "Session History" describing what changed and whether
   any fields were generated vs sourced.
5. If a file is published as a Claude Artifact, republish it (see `publish-artifact` skill) —
   this project has previously shipped a stale artifact after forgetting this step.
