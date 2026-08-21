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
dashboard.html              # desktop dashboard (no login)
observations.html           # mobile UI (no login)
observations_laptop.html    # full-featured desktop dashboard (has login)
```

## dashboard.html — Current State (as of 2026-06-29)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\dashboard.html`
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
  to 120 teachers / 12 schools that `observations.html` and `observations_laptop.html` received.

## observations.html — Mobile UI (as of 2026-06-29)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\observations.html`
- **Purpose:** Android-style mobile UI (Material Design 3). Separate from `dashboard.html` — phone-first, portrait only.
- **Requires internet once** to load Google Roboto font and Material Icons from CDN.
- **Color scheme:** Dark green — primary `#1b5e20` (changed from original blue `#1a56a4`).
- **Three screens:**
  - Screen 1 (Home): school dropdown → teacher dropdown (populated by school) → "View Observations" button (disabled until both chosen)
  - Screen 2 (Observations): teacher header card + trend badge, 3 summary cards, **3 collapsible accordion tabs** (Monthly Scores / Average by Indicator / Observation History — closed by default, tap to expand), "Add Observation" FAB
  - Screen 3 (Add Observation): date picker, four indicator steppers (1–4 scale, tap +/−), notes text area, fixed "Save Observation" bar at bottom (UI only — no backend)
- **Data:** updated to the full 120 teachers × 12 schools dataset (2026-06-30 data refresh).
- **Max-width:** 430px centred — looks like a phone on desktop too.
- **No login system.**

## observations_laptop.html — Laptop Dashboard (as of 2026-07-01)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html`
- **Artifact URL:** `https://claude.ai/code/artifact/c7944fa0-726f-4149-9bb9-451120e415c0`
- **Purpose:** Full-featured desktop/laptop dashboard. Separate from `dashboard.html` and `observations.html`.
- **Requires internet once** to load DM Serif Display + Inter fonts from Google Fonts CDN (artifact version uses system fonts).
- **Design identity:** Forest green sidebar (`#1b5e20`) + amber active-selection accent (`#e8a217`). DM Serif Display for headings; Inter for body. Sage-green background (`#f5f9f5`).
- **Login system:** Full-screen login overlay guards the dashboard. Coaches see only their school after login. Admin sees all 12. Visit codes let coaches temporarily unlock additional schools.
  - Login credentials → see **Login Credentials** below.
  - School visit codes → see **School Visit Codes** below.
- **Layout:**
  - Fixed sidebar (264px): school selector dropdown (filtered to user's allowed schools) + teacher roster sorted A→Z by first name within each school. Trend arrows are bright (↑ green `#69f0ae` / ↓ red `#ff5252` / → faint white), font-size 16px bold.
  - Top bar: user chip (name + "+ Add School" button + "Sign out") appears after login.
  - KPI strip (5 cells): changes between school summary and teacher detail.
  - Main content area: school overview shows monthly trend line + indicator bar chart; teacher detail shows personal line chart + indicator progress bars + 6 visit tiles.
  - **Removed:** the four indicator KPI boxes (Lesson Objective Clarity etc.) that were below the charts in school overview — they duplicated the bar chart.
- **Interaction:** Click teacher → loads detail. Click again → deselects. School dropdown resets selection.
- **Data:** 120 teachers × 12 schools embedded in JS `DATA` array, sorted alphabetically by first name within each school.

### Login Credentials (observations_laptop.html)

All stored in `USER_DB` constant in the JS. Passwords are visible in source (client-side only — security by effort, not encryption).

| Username | Password | School |
|---|---|---|
| `saima.jabeen` | `noor2025` | Al-Noor Academy |
| `aneela.khaliq` | `bright2025` | Bright Future School |
| `javeria.khalil` | `city2025` | City Grammar School |
| `hafsa.bashir` | `daanish2025` | Daanish Public School |
| `iqra.arshad` | `ever2025` | Evergreen Institute |
| `ashas.khan` | `falcon2025` | Falcon Academy |
| `rabia.saeed` | `green2025` | Greenwood Public School |
| `usman.tariq` | `horizon2025` | Horizon Model School |
| `mehnaz.iqbal` | `iqra2025` | Iqra Education Centre |
| `bilal.ahsan` | `junior2025` | Junior Scholars Academy |
| `sana.yousaf` | `know2025` | Knowledge Valley School |
| `kashif.mehmood` | `light2025` | Lighthouse Academy |
| `admin` | `admin2025` | All schools |

### School Visit Codes (observations_laptop.html)

Coaches type these after login via "+ Add School" to unlock an additional school for that session.

| Code | School |
|---|---|
| `AN25` | Al-Noor Academy |
| `BF25` | Bright Future School |
| `CG25` | City Grammar School |
| `DP25` | Daanish Public School |
| `EV25` | Evergreen Institute |
| `FA25` | Falcon Academy |
| `GP25` | Greenwood Public School |
| `HM25` | Horizon Model School |
| `IE25` | Iqra Education Centre |
| `JS25` | Junior Scholars Academy |
| `KV25` | Knowledge Valley School |
| `LA25` | Lighthouse Academy |

## Note on dataset drift

`dashboard.html` still embeds the original 30-teacher / 6-school dataset (verified in its school
dropdown: only Al-Noor, Bright Future, City Grammar, Daanish, Evergreen, Falcon — the 6 new
schools from the 2026-06-30 Google Sheet refresh are missing). `observations.html` and
`observations_laptop.html` are both current with 120 teachers / 12 schools. This is a known
inconsistency (see `Planning.md`), not yet requested to be fixed.
