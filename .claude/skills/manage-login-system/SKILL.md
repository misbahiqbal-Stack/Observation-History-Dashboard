---
name: manage-login-system
description: Use when adding, removing, or modifying login accounts, roles, or school codes in backend/public/observations_laptop.html — the only one of the three dashboard files with a login system.
---

# Managing the Login System (backend/public/observations_laptop.html only)

`backend/public/dashboard.html` and `backend/public/observations.html` have **no login system** — this skill only applies to
`backend/public/observations_laptop.html`.

## Where it lives

- `USER_DB` (JS constant): every account. Key = lowercase username, value =
  `{ name, pass, role, schools }`.
  - `role` is one of `coach`, `principal`, `admin`.
  - `schools` is an array of school names the account can see (`null` for admin = all schools).
  - Coach accounts can cover **multiple** schools. Principal accounts are scoped to exactly
    **one** school each, keyed as `principal <lowercase-school-slug>` (e.g.
    `principal alnoor`, `principal brightfuture`).
- `SCHOOL_CODES` (JS constant): one short code per school (e.g. `ANA` → Al-Noor Academy), used
  to reference/unlock a school.
- Session state persists via `sessionStorage` (clears when the tab closes) — not a real backend
  session.
- Passwords are **not** in this file. Per ADR-010 it holds `__COACH_PW__` / `__PRINCIPAL_PW__` /
  `__ADMIN_PW__` placeholders, and `backend/server.js` substitutes the real values from
  `backend/.env` as the page is served. New accounts reuse the placeholder for their role;
  changing an actual password means editing `backend/.env`. **Never write a literal password
  into `USER_DB`.** The substituted values still reach the browser and are visible in View
  Source — a known gap tracked in `Planning.md`; don't "harden" it further (e.g. hashing)
  without the user asking, since the real fix is the server-side login endpoint, not obfuscation.

## Adding a new school

1. Add the school to the relevant `DATA`/dropdown structures (see `update-teacher-data` skill).
2. Add an entry to `SCHOOL_CODES` — a short, distinct 2–3 letter code.
3. Add a `principal <slug>` account to `USER_DB`, scoped to just that school.
4. Assign the school to an existing coach's `schools` array, or add a new coach account if the
   user specifies one.
5. Update the **Login Credentials** / **School Codes** tables in `Structure.md`.

## Adding a new coach or principal account

- Coach: add `"<firstname lastname>": { name, pass: "__COACH_PW__", role: "coach", schools: [...] }`.
- Principal: add `"principal <slug>": { name: "Principal (<School Name>)", pass: "__PRINCIPAL_PW__", role:
  "principal", schools: ["<School Name>"] }`.
- Keep the password scheme consistent with existing accounts unless the user asks for a change
  in the login model itself — that would be a `Decision.md`-worthy architectural change, not a
  routine edit.

## After any change

Update `Structure.md`'s Login Credentials / School Codes tables to match — this drifted out of
sync with the actual file once already (caught 2026-08-21) and caused a documentation bug.
