# Structure.md

> What each file in this project is and its current shape. This is architecture/state, not
> durable facts about the user or preferences (those live in `memory.md`).

## Project Layout

```
Claude.md                  # persistent instructions
Agent_loop.md              # agent operating loop
memory.md                  # durable facts + session history + auto version log
Structure.md               # this file
Decision.md                # ADR log
Planning.md                # open tasks / current goals
frontend/                  # all served HTML, static, no build step
  frontend/dashboard.html              # desktop dashboard (no login)
  frontend/observations.html           # mobile UI (no login)
  frontend/observations_laptop.html    # full-featured desktop dashboard (has login)
  ask.html                     # box + button + answer, password login form (Ask tool)
backend/                   # the one deployable unit — a single Node process
  server.js                   # zero-dependency http server: serves frontend/ + the Ask API
  package.json                 # "start": "node server.js" — no dependencies, no build step
  .env.example                 # template — copy to .env, fill in real values (gitignored)
.claude/skills/
  project-overview/SKILL.md      # purpose, stack, conventions, common tasks, gotchas
  update-teacher-data/SKILL.md   # data model + deterministic score-generation rules
  manage-login-system/SKILL.md   # USER_DB/SCHOOL_CODES structure and conventions
  publish-artifact/SKILL.md      # CSP-safe substitutions for Claude Artifact publishing
.claude/agents/
  data-refresh-agent.md          # adds/refreshes school-teacher-coach data
  login-account-agent.md         # manages frontend/observations_laptop.html's login accounts
  artifact-publish-agent.md      # publishes/refreshes a dashboard as a Claude Artifact
  doc-keeper-agent.md            # syncs Planning.md/memory.md/Decision.md after a change
```

## frontend/dashboard.html — Current State (as of 2026-06-29)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\frontend/dashboard.html`
- **Title:** "Teacher Observation Score History" (renamed from "Teacher Observation Dashboard")
- **School selector** at the top: dropdown filters the entire page to one school or all schools.
- **KPI cards:** Teachers shown, observation average, Improving / Steady / Declining counts.
- **Monthly trend line chart:** Group average across Sept–Feb for the selected school. Full width.
- **Indicator bar chart: REMOVED** — the group-level "Average by Indicator" chart was removed per user request.
- **Teacher detail panel:** Clicking a table row shows that teacher's personal monthly trend line + indicator breakdown. Resets when school changes.
- **Teacher table:** Sortable by any column, searchable by name, filterable by trend.
- **Phone responsive:** Media query at 600px makes dropdowns full-width, cards stack, controls stack vertically. Table scrolls horizontally.
- **Offline:** No CDN. Works by double-clicking.
- **No login system.**
- **Data:** original 30-teacher / 6-school dataset — was NOT included in the 2026-06-30 refresh
  to 120 teachers / 12 schools that `frontend/observations.html` and `frontend/observations_laptop.html` received.

## frontend/observations.html — Mobile UI (as of 2026-06-29)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\frontend/observations.html`
- **Purpose:** Android-style mobile UI (Material Design 3). Separate from `frontend/dashboard.html` — phone-first, portrait only.
- **Requires internet once** to load Google Roboto font and Material Icons from CDN.
- **Color scheme:** Dark green — primary `#1b5e20` (changed from original blue `#1a56a4`).
- **Three screens:**
  - Screen 1 (Home): school dropdown → teacher dropdown (populated by school) → "View Observations" button (disabled until both chosen)
  - Screen 2 (Observations): teacher header card + trend badge, 3 summary cards, **3 collapsible accordion tabs** (Monthly Scores / Average by Indicator / Observation History — closed by default, tap to expand), "Add Observation" FAB
  - Screen 3 (Add Observation): date picker, four indicator steppers (1–4 scale, tap +/−), notes text area, fixed "Save Observation" bar at bottom (UI only — no backend)
- **Data:** updated to the full 120 teachers × 12 schools dataset (2026-06-30 data refresh).
- **Max-width:** 430px centred — looks like a phone on desktop too.
- **No login system.**

## frontend/observations_laptop.html — Laptop Dashboard (verified against source 2026-08-21)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\frontend/observations_laptop.html`
- **Purpose:** Full-featured desktop/laptop dashboard. Separate from `frontend/dashboard.html` and `frontend/observations.html`, and the most feature-complete of the three — well ahead of what the old `Memory.md` had documented (this section was re-verified directly against the file's source, not carried over from the stale doc).
- **Design identity:** Forest green sidebar (`#1b5e20`) + amber active-selection accent (`#e8a217`). Sage-green background (`#f5f9f5`).
- **Login system:** Full-screen login overlay, three roles — `coach`, `principal`, `admin` — shown as role pills in the UI.
  - Login credentials → see **Login Credentials** below.
  - School unlock codes → see **School Codes** below.
- **Data model:** 166 teacher records across **14 schools** (12 original + Minhaj Public School +
  New Horizon School), embedded in JS `DATA` array. Some teachers cover multiple subjects —
  their name is suffixed `(N subjects)` and their monthly/visit view splits into one box per
  subject (`MONTH_SUBJECTS` lookup). Some monthly scores are `null` (missing observation for
  that visit) — rendered as a gap, not zero.
- **Indicators — renamed from the original set:** `Objective Clarity`, `Student Engagement`,
  `Class Management`, `Instructional Quality` (this last one replaces the original
  "Differentiated Instruction" — a content change, not just a rename). Per-visit indicator
  breakdown is always "N/A" (indicators are latest-snapshot only, not tracked per visit) — those
  N/A tiles are intentionally non-clickable.
- **CPD recommendations:** `CPD_SUBJECT_DATA` / `CPD_DATA` constants supply a "CPD Recommendation"
  string shown inside each visit's subject box, keyed by school + teacher + (optionally) subject.
- **Layout:** Fixed sidebar with school selector + teacher roster (searchable/filterable, sorted
  A→Z by first name within each school). KPI strip changes between school summary and teacher
  detail. School overview shows monthly trend line + indicator bar chart + school average line;
  teacher detail shows personal line chart + indicator bars + collapsible visit tiles (subject
  boxes with indicators + CPD recommendation).
- **Interaction:** Click teacher → loads detail; click again → deselects. School dropdown resets selection.

### Login Credentials (frontend/observations_laptop.html)

All stored in `USER_DB` constant in the JS — passwords are simple (`123` / `admin`), visible in
source (client-side only — security by effort, not encryption). 8 coaches, each covering one or
more schools (no longer 1-to-1); 14 principal accounts, one per school, each scoped to only that
school; 1 admin (sees everything).

| Username | Password | Role | School(s) |
|---|---|---|---|
| `saima jabeen` | `123` | coach | Al-Noor Academy, Bright Future School, City Grammar School |
| `aneela khaliq` | `123` | coach | Daanish Public School, Evergreen Institute |
| `javeria khalil` | `123` | coach | Falcon Academy, Greenwood Public School |
| `hafsa bashir` | `123` | coach | Horizon Model School, Iqra Education Centre |
| `iqra arshad` | `123` | coach | Junior Scholars Academy, Knowledge Valley School |
| `ashas khan` | `123` | coach | Lighthouse Academy |
| `rabia saeed` | `123` | coach | Minhaj Public School |
| `usman tariq` | `123` | coach | New Horizon School |
| `admin` | `admin` | admin | All schools |
| `principal <school>` | `123` | principal | One school each — key is `principal` + a lowercase school slug (e.g. `principal alnoor`, `principal brightfuture`, … all 14 schools) |

### School Codes (frontend/observations_laptop.html)

`SCHOOL_CODES` constant — 14 entries, one per school (used to unlock/reference a school by code):

| Code | School |
|---|---|
| `ANA` | Al-Noor Academy |
| `BFS` | Bright Future School |
| `CGS` | City Grammar School |
| `DPS` | Daanish Public School |
| `EI` | Evergreen Institute |
| `FA` | Falcon Academy |
| `GPS` | Greenwood Public School |
| `HMS` | Horizon Model School |
| `IEC` | Iqra Education Centre |
| `JSA` | Junior Scholars Academy |
| `KVS` | Knowledge Valley School |
| `LA` | Lighthouse Academy |
| `MPS` | Minhaj Public School |
| `NHS` | New Horizon School |

## frontend/ + backend/ — the deployable app (reorganized 2026-09-29, see `Decision.md` ADR-005)

- **Purpose:** `frontend/` holds every served HTML file (the three dashboards, unchanged, plus
  `ask.html` — box/button/answer, password login form). `backend/server.js` is the one
  deployable unit: a single Node process that serves all of `frontend/` as static files *and*
  runs the Ask tool's API, so the whole project ships as one process with one public URL.
- **Why a server at all:** the Ask tool's Anthropic API key must stay server-side — it's the one
  component in the project that can't be a plain static file (see `Decision.md` ADR-004).
  ADR-005 records *why* it was pulled out into `backend/` + `frontend/` instead of staying a
  one-off `ask/` folder bolted on next to the dashboards.
- **Stack:** zero-dependency Node.js (`http`/`https`/`crypto`/`fs` built-ins only). `backend/
  package.json` exists only so deploy platforms detect it as a Node app and know `npm start` —
  there is still nothing to `npm install`.
- **Routing (`backend/server.js`):** `GET /ask.html` and `GET /health` are the only public GET
  routes. `/ask.html` is the login page. `/health` (added 2026-09-30) always returns a plain
  `200 ok` — deploy platforms ping this for their startup health check, since pinging `/` while
  logged out would get a `302` and could get misread as "unhealthy," killing the deploy. `GET
  /`, `/dashboard.html`, `/observations.html`, `/observations_laptop.html` all require a valid
  session (see ADR-006) — an unauthenticated request 302s to `/ask.html?next=<path>`, and
  logging in redirects straight back to it. `GET /me`, `POST /login`, `POST /logout`, `POST
  /ask` are the auth/Ask API (`observations_laptop.html`'s own separate client-side
  coach/principal/admin login still runs *behind* this gate, unaffected).
- **Auth (whole app, ADR-006):** single shared password (`APP_PASSWORD` env var), constant-time
  compared (`crypto.timingSafeEqual`). On success, a random session token is stored server-side
  (in-memory `Set` — resets on server restart/redeploy, fine for a single personal user) and
  handed to the browser as an `HttpOnly`, `SameSite=Strict` cookie.
- **Config:** copy `backend/.env.example` to `backend/.env` (gitignored) and fill in
  `APP_PASSWORD`, `ANTHROPIC_API_KEY`, optionally `ANTHROPIC_MODEL` (default
  `claude-sonnet-5`) and `PORT` (default `8787`).
- **Run it:** `node backend/server.js` (or `npm start` from `backend/`), then open
  `http://localhost:8787`.
- **Verified 2026-09-29:** re-tested end-to-end twice — once right after the frontend/backend
  reorg (all four pages served unauthenticated, byte-for-byte matching pre-reorg content), again
  after adding the full-site auth gate (unauthenticated → 302 to `/ask.html?next=...` on all
  four routes, authenticated → 200 with matching content, login/logout cycle intact). Still
  uses a fake API key — the real-answer success path is unverified (see `Planning.md`).
- **Node.js was not installed on this machine** before ADR-004's task — installed via
  `winget install OpenJS.NodeJS.LTS` (v24.19.0) with the user's confirmation.

## Note on dataset drift

`frontend/dashboard.html` still embeds the original 30-teacher / 6-school dataset (verified in its school
dropdown: only Al-Noor, Bright Future, City Grammar, Daanish, Evergreen, Falcon — the 6 new
schools from the 2026-06-30 Google Sheet refresh are missing). `frontend/observations.html` and
`frontend/observations_laptop.html` are both current with 120 teachers / 12 schools. This is a known
inconsistency (see `Planning.md`), not yet requested to be fixed.
