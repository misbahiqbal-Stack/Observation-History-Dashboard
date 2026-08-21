# Planning.md

> Forward-looking: current goals and the standing list of open work. This is the file to check
> at the start of a session to see what's outstanding. Historical/completed work lives in
> `memory.md` → "Session History"; architectural rationale lives in `Decision.md`.

## Current Goals

- Keep the three dashboard files (`dashboard.html`, `observations.html`,
  `observations_laptop.html`) accurate and in sync with the latest 12-school / 120-teacher
  dataset (see `Structure.md`).
- `observations_laptop.html` is the most feature-complete (login system, visit codes) — the
  reference implementation to bring the other two files up to when features are added.

## Open Tasks

- [ ] `observations.html` has no login system (only `observations_laptop.html` does).
- [ ] `dashboard.html` has no login system (only `observations_laptop.html` does).
- [ ] All three dashboard files now have **different datasets** (verified 2026-08-21):
  `dashboard.html` = 6 schools/30 teachers (original), `observations.html` = 12 schools/120
  teachers (2026-06-30 refresh), `observations_laptop.html` = 14 schools/166 records, 8
  multi-school coaches, principal+admin roles (furthest ahead, undocumented until now — see
  `Structure.md`). Not yet requested to be reconciled, but worth flagging to the user.
- [ ] Passwords in `observations_laptop.html`'s `USER_DB` are plain-text in source — acceptable
  for now (client-side-only, static file), but flag if this ever needs to be hardened.
- [ ] No feedback yet from the user on the current desktop `dashboard.html` layout after the
  mobile-redesign revert (2026-06-24) — could resurface if the user wants further layout changes.
- [ ] Potential future asks (not yet requested): more months of data, export/print views.

## How to use this file

- Check off / remove items as they're completed — completed work moves to `memory.md` →
  "Session History", not this file.
- Add new items here as soon as they're identified (mid-session), don't wait until the end.
