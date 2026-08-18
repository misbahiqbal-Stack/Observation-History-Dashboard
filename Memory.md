# Memory.md

> Durable, long-lived facts the agent should remember across sessions. Unlike `Session_log.md`
> (which is chronological and ephemeral), entries here represent the **current truth**. Update
> entries in place when they change; delete them when they become wrong.

---

## User & Preferences

- **Role:** Coach / educator. Non-technical — provides data and feedback, does not write code.
- **Identity:** Aneela Khaliq (aneela.khaliq@niete.edu.pk). Listed as coach for Bright Future School in the data.
- **Communication style:** Explain technical choices in plain language before building. Always confirm data structure and dashboard structure before making changes.
- **Preferred deliverable:** Single offline HTML file that opens by double-clicking in any browser. No software to install.
- **Corrections welcomed:** User actively catches mistakes mid-conversation (scale, indicator names) — always read back data before building.

## Project Facts

- **Project name:** Observation History
- **Goal:** Track and visualize teacher classroom observation scores (World Bank Teach Tool) over time, so progress and trends are easy to see at a glance.
- **Data source:** Google Sheet (expanded from original PDF): 12 schools × 10 teachers = 120 teachers total.
- **Schools:** 12 schools, 10 teachers each, 120 teachers total. Each school has exactly one dedicated coach (1-to-1 mapping).

| School | Coach |
|---|---|
| Al-Noor Academy | Saima Jabeen |
| Bright Future School | Aneela Khaliq |
| City Grammar School | Javeria Khalil |
| Daanish Public School | Hafsa Bashir |
| Evergreen Institute | Iqra Arshad |
| Falcon Academy | Ashas Khan |
| Greenwood Public School | Rabia Saeed |
| Horizon Model School | Usman Tariq |
| Iqra Education Centre | Mehnaz Iqbal |
| Junior Scholars Academy | Bilal Ahsan |
| Knowledge Valley School | Sana Yousaf |
| Lighthouse Academy | Kashif Mehmood |

- **Scoring scale:** Percentages, 0–100% (100 = highest). **NOT a 1–5 scale** — user corrected this early in session 1.
- **Four indicators scored per teacher (latest snapshot only, not monthly):**
  1. Lesson Objective Clarity
  2. Student Engagement
  3. Classroom Management
  4. Differentiated Instruction
  - Assessment Practices exists in the data but is **deliberately excluded** per user instruction.
- **Monthly data:** "Obs Score – Visit 1–6" = Sept, Oct, Nov, Dec, Jan, Feb. One overall score per visit per teacher. Not broken down by indicator.
- **Overall score calculation:** Simple average of the 4 indicator scores (equal weight).
- **Deliverable:** `dashboard.html` in `c:\Users\misba\OneDrive\Desktop\Project 1\`.

## Conventions Learned

- The four indicator columns are **"(Latest)" snapshots** — one value per teacher, not a monthly series. Month-by-month trends must come from the "Obs Score – Visit" columns.
- "Obs Avg" and "Trend" (↑/→/↓) already exist in the source file. The dashboard reuses them rather than recomputing.
- **Do not change the dashboard structure or scoring logic without confirming first.** User's explicit rule.
- When building, always read back the extracted data to the user before building the UI, so errors can be caught early.

## What Was Tried and Rejected

- **1–5 scoring scale** — user initially mentioned this, then corrected to percentages. Always use %.
- **3 indicators** (Classroom Culture, Instructional Quality, Socio-emotional Skills) — user's first description. Corrected to the actual 4 indicators listed above.
- **Mobile-only redesign of dashboard.html (2026-06-24):** Tried converting the desktop dashboard into a mobile card layout. User rejected it — "this is still like a dashboard." Reverted `dashboard.html` to its desktop layout. The desktop layout of `dashboard.html` must not be changed to mobile.
- **Moving observations.html into CLAUDE.md (2026-06-29):** User asked to "move the file to claude/md." Clarified and user said "drop it for now." Do not paste large HTML files into CLAUDE.md.

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

## observations.html — Mobile UI (as of 2026-06-29)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\observations.html`
- **Purpose:** Android-style mobile UI (Material Design 3). Separate from `dashboard.html` — phone-first, portrait only.
- **Requires internet once** to load Google Roboto font and Material Icons from CDN.
- **Color scheme:** Dark green — primary `#1b5e20` (changed from original blue `#1a56a4`).
- **Three screens:**
  - Screen 1 (Home): school dropdown → teacher dropdown (populated by school) → "View Observations" button (disabled until both chosen)
  - Screen 2 (Observations): teacher header card + trend badge, 3 summary cards, **3 collapsible accordion tabs** (Monthly Scores / Average by Indicator / Observation History — closed by default, tap to expand), "Add Observation" FAB
  - Screen 3 (Add Observation): date picker, four indicator steppers (1–4 scale, tap +/−), notes text area, fixed "Save Observation" bar at bottom (UI only — no backend)
- **Data:** same 30 teachers embedded in JS.
- **Max-width:** 430px centred — looks like a phone on desktop too.

## observations_laptop.html — Laptop Dashboard (as of 2026-07-01)

- **File:** `c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html`
- **Artifact URL:** `https://claude.ai/code/artifact/c7944fa0-726f-4149-9bb9-451120e415c0`
- **Purpose:** Full-featured desktop/laptop dashboard. Separate from `dashboard.html` and `observations.html`.
- **Requires internet once** to load DM Serif Display + Inter fonts from Google Fonts CDN (artifact version uses system fonts).
- **Design identity:** Forest green sidebar (`#1b5e20`) + amber active-selection accent (`#e8a217`). DM Serif Display for headings; Inter for body. Sage-green background (`#f5f9f5`).
- **Login system:** Full-screen login overlay guards the dashboard. Coaches see only their school after login. Admin sees all 12. Visit codes let coaches temporarily unlock additional schools.
  - Login credentials → see **Login Credentials** section below.
  - School visit codes → see **School Visit Codes** section below.
- **Layout:**
  - Fixed sidebar (264px): school selector dropdown (filtered to user's allowed schools) + teacher roster sorted A→Z by first name within each school. Trend arrows are bright (↑ green `#69f0ae` / ↓ red `#ff5252` / → faint white), font-size 16px bold.
  - Top bar: user chip (name + "+ Add School" button + "Sign out") appears after login.
  - KPI strip (5 cells): changes between school summary and teacher detail.
  - Main content area: school overview shows monthly trend line + indicator bar chart; teacher detail shows personal line chart + indicator progress bars + 6 visit tiles.
  - **Removed:** the four indicator KPI boxes (Lesson Objective Clarity etc.) that were below the charts in school overview — they duplicated the bar chart.
- **Interaction:** Click teacher → loads detail. Click again → deselects. School dropdown resets selection.
- **Data:** 120 teachers × 12 schools embedded in JS `DATA` array, sorted alphabetically by first name within each school.

## Login Credentials (observations_laptop.html)

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

## School Visit Codes (observations_laptop.html)

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

## Glossary

- **Obs Score – Visit N** — overall observation score for a monthly classroom observation (Sept=V1 … Feb=V6).
- **(Latest)** — the most-recent single value for an indicator; not a time series.
- **4-Ind Avg** — calculated average of the four latest indicator scores (Clarity, Engagement, Management, Differentiation).
- **Obs Avg** — average of the 6 monthly visit scores (Sept–Feb); taken from the source file.
- **Trend** — ↑ Improving / → Steady / ↓ Declining; taken from the source file, not recalculated.

---

_Last reviewed: 2026-06-29_

## Version 1 (2026-07-01 11:47)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\Session_log.md

## Version 2 (2026-07-01 11:50)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations.html
- What changed: Moved "Add Observation" FAB from bottom-right to bottom-center (left: 50% + translateX(-50%)). Applied to both observations.html and the Artifact scratchpad copy; artifact republished.

## Version 3 (2026-07-01 12:25)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 4 (2026-07-01 12:25)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 5 (2026-07-01 12:25)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 6 (2026-07-01 12:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 7 (2026-07-01 12:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 8 (2026-07-01 12:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 9 (2026-07-01) — Brighter trend arrows in teacher list
- Modified: observations_laptop.html + artifact scratchpad
- What changed: Trend arrows (↑↓→) made font-size 16px, font-weight 700, opacity 1. Improving = #69f0ae with glow, Declining = #ff5252 with glow, Steady = rgba(255,255,255,.75).

## Version 10 (2026-07-01) — Login system added to observations_laptop.html
- Modified: observations_laptop.html + artifact scratchpad
- What changed: Full login overlay added. 12 coach accounts (one per school) + admin account. After login, school dropdown shows only the coach's assigned school. "+ Add School" button in top bar lets coaches enter a visit code (e.g. BF25) to temporarily unlock another school. Session persists via sessionStorage (clears on tab close). Artifact republished at https://claude.ai/code/artifact/c7944fa0-726f-4149-9bb9-451120e415c0

## Version 11 (2026-07-01) — Memory.md updated with 12-school data and login credentials
- Modified: Memory.md
- What changed: Corrected project facts from 6 schools/30 teachers to 12/120. Added full school–coach table. Updated observations_laptop.html state description. Added Login Credentials and School Visit Codes sections.

## Version 12 (2026-07-01 12:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\Session_log.md

## Version 13 (2026-07-01 15:02)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 14 (2026-07-01 15:03)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 15 (2026-07-01 15:33)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 16 (2026-07-01 15:33)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 17 (2026-07-01 15:34)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 18 (2026-07-01 15:34)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 19 (2026-07-01 15:34)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 20 (2026-07-01 15:34)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 21 (2026-07-07 10:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 22 (2026-07-07 11:00)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 23 (2026-07-07 11:04)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 24 (2026-07-07 11:04)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 25 (2026-07-07 11:04)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 26 (2026-07-07 11:06)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 27 (2026-07-07 11:06)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 28 (2026-07-07 11:09)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 29 (2026-07-07 11:09)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 30 (2026-07-07 11:14)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 31 (2026-07-07 11:14)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 32 (2026-07-07 11:18)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 33 (2026-07-07 11:22)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 34 (2026-07-07 11:22)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 35 (2026-07-07 11:32)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 36 (2026-07-07 11:32)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 37 (2026-07-07 11:32)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 38 (2026-07-07 11:33)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 39 (2026-07-07 13:39)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 40 (2026-07-07 13:39)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 41 (2026-07-07 13:39)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 42 (2026-07-07 13:52)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 43 (2026-07-07 13:52)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 44 (2026-07-07 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 45 (2026-07-07 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 46 (2026-07-07 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 47 (2026-07-07 13:54)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 48 (2026-07-07 13:54)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 49 (2026-07-07 13:54)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 50 (2026-07-07 13:55)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 51 (2026-07-07 13:55)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 52 (2026-07-07 13:55)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 53 (2026-07-07 13:55)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 54 (2026-07-07 14:22)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 55 (2026-07-07 14:23)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 56 (2026-07-07 14:32)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 57 (2026-07-07 14:45)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 58 (2026-07-07 14:47)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 59 (2026-07-07 15:00)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 60 (2026-07-07 15:10)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 61 (2026-07-07 15:12)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 62 (2026-07-07 15:13)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 63 (2026-07-07 15:13)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 64 (2026-07-07 15:15)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 65 (2026-07-07 15:15)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 66 (2026-07-07 15:20)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 67 (2026-07-07 15:20)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 68 (2026-07-07 15:20)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 69 (2026-07-07 15:23)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 70 (2026-07-07 15:23)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 71 (2026-07-07 15:25)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 72 (2026-07-07 15:33)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 73 (2026-07-07 15:33)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 74 (2026-07-07 15:34)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 75 (2026-07-07 15:35)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 76 (2026-07-07 15:36)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 77 (2026-07-07 15:36)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 78 (2026-07-07 15:36)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 79 (2026-07-07 15:41)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 80 (2026-07-07 15:41)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 81 (2026-07-07 15:41)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 82 (2026-07-07 15:49)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 83 (2026-07-07 15:49)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 84 (2026-07-07 15:49)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 85 (2026-07-07 15:50)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 86 (2026-07-07 15:50)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 87 (2026-07-07 15:51)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 88 (2026-07-07 15:51)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 89 (2026-07-08 10:42)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 90 (2026-07-08 10:42)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 91 (2026-07-08 11:07)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 92 (2026-07-08 11:07)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 93 (2026-07-08 11:07)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 94 (2026-07-08 11:08)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 95 (2026-07-08 11:08)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 96 (2026-07-08 11:08)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 97 (2026-07-08 11:08)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 98 (2026-07-08 11:09)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 99 (2026-07-08 11:17)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 100 (2026-07-08 11:17)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 101 (2026-07-08 11:17)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 102 (2026-07-08 11:18)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 103 (2026-07-08 11:18)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 104 (2026-07-08 11:23)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 105 (2026-07-08 11:24)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 106 (2026-07-08 11:30)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 107 (2026-07-08 11:30)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 108 (2026-07-08 11:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 109 (2026-07-08 11:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 110 (2026-07-08 11:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 111 (2026-07-08 11:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 112 (2026-07-08 11:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 113 (2026-07-08 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 114 (2026-07-08 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 115 (2026-07-08 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 116 (2026-07-08 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 117 (2026-07-08 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 118 (2026-07-08 13:53)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 119 (2026-07-08 13:55)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 120 (2026-07-08 13:56)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 121 (2026-07-08 14:10)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 122 (2026-07-08 14:10)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 123 (2026-07-08 14:10)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 124 (2026-07-08 14:12)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 125 (2026-07-08 15:30)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 126 (2026-07-08 15:30)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 127 (2026-07-08 15:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 128 (2026-07-08 15:41)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 129 (2026-07-08 15:41)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 130 (2026-07-14 11:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 131 (2026-07-14 11:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 132 (2026-07-14 11:26)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 133 (2026-07-14 11:31)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\observations_laptop.html

## Version 134 (2026-08-18 14:40)
- Modified: c:\Users\misba\OneDrive\Desktop\Project 1\.gitignore
