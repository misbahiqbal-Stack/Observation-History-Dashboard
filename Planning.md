# Planning.md

> Forward-looking: current goals and the standing list of open work. This is the file to check
> at the start of a session to see what's outstanding. Historical/completed work lives in
> `memory.md` → "Session History"; architectural rationale lives in `Decision.md`.

## Current Goals

- Deploy the app (one self-contained `backend/`, ADR-005/009) — in progress, see below.
- Keep the three dashboard files (`backend/public/dashboard.html`, `backend/public/observations.html`,
  `backend/public/observations_laptop.html`) accurate and in sync with the latest 12-school /
  120-teacher dataset (see `Structure.md`).
- `backend/public/observations_laptop.html` is the most feature-complete (login system, visit
  codes) — the reference implementation to bring the other two files up to when features are
  added.

## Open Tasks

- [ ] **Deploy the app** (ADR-005/006/007/008/009/010/011) — in progress on Railway. **Five** env
  vars are now required for the server to boot: `APP_USERNAME` + `APP_PASSWORD` (ADR-011) plus
  `COACH_PASSWORD`, `PRINCIPAL_PASSWORD`, and `ADMIN_PASSWORD` (ADR-010). Set them all in Railway's
  environment or the deploy will exit on startup; confirm the live URL works end-to-end once
  `ANTHROPIC_API_KEY` is added too (see below). Two real bugs only
  surfaced once actually deployed, both now fixed: a query-string routing bug (ADR-008) and a
  sibling-directory deploy issue that needed `public/` nested inside `backend/` (ADR-009) —
  re-verify the live URL once more after this latest fix lands.
- [ ] **The old `123`/`admin` passwords are still in git history** (found by the 2026-11-06 full
  scan). ADR-010 removed them from the working tree, but `HEAD` still contains 22 `pass: "123"`
  entries and they appear in 2 commits reachable from `main` — `5d102dc`, `89ec7b5`, `2b6af4f`.
  Anyone who clones the repo can recover them with `git log -p`. Options: (a) accept it, since
  these were always weak demo passwords behind the `APP_PASSWORD` gate and the live values are
  now different — lowest effort, and the exposed strings no longer unlock anything; (b) rewrite
  history with `git filter-repo`, which changes every commit hash and needs a force-push.
  **Not started — needs the user's call.** No API key was ever committed (verified), and
  `backend/.env` has never been committed.
- [ ] **Move `observations_laptop.html`'s login server-side** (follow-up to ADR-010). ADR-010 got
  the 23 `USER_DB` passwords out of committed source, but they are still substituted into the page
  and therefore visible in View Source. The real fix is a `POST /api/dashboard-login` endpoint that
  verifies against `.env` and returns only `{name, role, schools}`, so passwords never reach the
  browser. Lower urgency than it sounds: per ADR-006 the whole app already sits behind the
  `APP_PASSWORD` gate, so this is an inner layer, not the public boundary.
- [ ] `backend/public/observations.html` has no login system (only `observations_laptop.html` does).
- [ ] `backend/public/dashboard.html` has no login system (only `observations_laptop.html` does).
- [ ] All three dashboard files still have **different datasets** (verified 2026-08-21):
  `dashboard.html` = 6 schools/30 teachers (original), `observations.html` = 12 schools/120
  teachers (2026-06-30 refresh), `observations_laptop.html` = 14 schools/166 records, 8
  multi-school coaches, principal+admin roles (furthest ahead, undocumented until now — see
  `Structure.md`). Not yet requested to be reconciled, but worth flagging to the user.
- [ ] Passwords in `observations_laptop.html`'s `USER_DB` are plain-text in source — acceptable
  for now (client-side-only, static file), but flag if this ever needs to be hardened.
- [ ] No feedback yet from the user on the current desktop `dashboard.html` layout after the
  mobile-redesign revert (2026-06-24) — could resurface if the user wants further layout changes.
- [ ] Potential future asks (not yet requested): more months of data, export/print views.
- [ ] The Ask tool (ADR-004/007) needs a real `ANTHROPIC_API_KEY` in `backend/.env` (or the
  deploy host's env vars) before it can actually return an answer — only tested with a fake
  key so far (auth/error paths only; the server now starts fine without it per ADR-007).
- [ ] The Ask tool's in-memory sessions reset on every server restart/redeploy — fine for
  personal use, but worth knowing, especially once deployed (a redeploy logs everyone out).

## How to use this file

- Check off / remove items as they're completed — completed work moves to `memory.md` →
  "Session History", not this file.
- Add new items here as soon as they're identified (mid-session), don't wait until the end.
