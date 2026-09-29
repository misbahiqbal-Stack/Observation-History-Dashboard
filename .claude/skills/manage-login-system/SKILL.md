---
name: manage-login-system
description: Use when adding, removing, or modifying login accounts, roles, or school codes in frontend/observations_laptop.html — the only one of the three dashboard files with a login system.
---

# Managing the Login System (frontend/observations_laptop.html only)

`frontend/dashboard.html` and `frontend/observations.html` have **no login system** — this skill only applies to
`frontend/observations_laptop.html`.

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
- Passwords are plain-text in source (currently `123` for coaches/principals, `admin` for
  admin). **This is an accepted tradeoff for a static, client-side-only file — do not "harden"
  it (e.g. hashing) without the user asking**, since there's no backend to keep a secret from.

## Adding a new school

1. Add the school to the relevant `DATA`/dropdown structures (see `update-teacher-data` skill).
2. Add an entry to `SCHOOL_CODES` — a short, distinct 2–3 letter code.
3. Add a `principal <slug>` account to `USER_DB`, scoped to just that school.
4. Assign the school to an existing coach's `schools` array, or add a new coach account if the
   user specifies one.
5. Update the **Login Credentials** / **School Codes** tables in `Structure.md`.

## Adding a new coach or principal account

- Coach: add `"<firstname lastname>": { name, pass: "123", role: "coach", schools: [...] }`.
- Principal: add `"principal <slug>": { name: "Principal (<School Name>)", pass: "123", role:
  "principal", schools: ["<School Name>"] }`.
- Keep the password scheme consistent with existing accounts unless the user asks for a change
  in the login model itself — that would be a `Decision.md`-worthy architectural change, not a
  routine edit.

## After any change

Update `Structure.md`'s Login Credentials / School Codes tables to match — this drifted out of
sync with the actual file once already (caught 2026-08-21) and caused a documentation bug.
