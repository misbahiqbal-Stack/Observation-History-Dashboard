# Decisions.md

> An **append-only** Architecture Decision Record (ADR) log. Each entry captures a significant
> choice, the context that forced it, and its consequences. Never rewrite history — if a decision
> is reversed, add a new entry that supersedes the old one and mark the old one accordingly.

## How to add a decision

Copy the template below to the **top** of the log (newest first). Give each a sequential ID
(`ADR-001`, `ADR-002`, …) and a status.

**Statuses:** `Proposed` · `Accepted` · `Superseded by ADR-NNN` · `Deprecated`

---

### Template

```markdown
### ADR-NNN: <short title>

- **Date:** YYYY-MM-DD
- **Status:** Accepted
- **Context:** What problem or force prompted this decision?
- **Decision:** What did we decide to do?
- **Alternatives considered:** What else was on the table, and why was it rejected?
- **Consequences:** What becomes easier? What becomes harder? What follow-up is needed?
```

---

## Log

<!-- Newest entries on top. -->

### ADR-003: Average of four indicators is the calculated "overall" score

- **Date:** 2026-06-24
- **Status:** Accepted
- **Context:** Each teacher has four latest indicator scores (Lesson Objective Clarity, Student
  Engagement, Classroom Management, Differentiated Instruction) and the dashboard needs one
  headline number per teacher.
- **Decision:** Overall = simple (unweighted) average of the four indicators. The adjacent
  "Assessment Practices" column is excluded per the user's instruction.
- **Alternatives considered:** Weighted average (rejected — no weighting rationale provided);
  using the file's "Avg Observation Score" as the only headline (rejected — that is the average
  of the six monthly visits, a different measure; both are shown and clearly labelled).
- **Consequences:** Two clearly-labelled averages coexist: "Obs Avg" (monthly visits) and
  "4-Ind Avg" (latest indicators). Changing the indicator set changes this number.

### ADR-002: Single self-contained offline HTML file as the dashboard

- **Date:** 2026-06-24
- **Status:** Accepted
- **Context:** A non-technical user needs an interactive dashboard with charts, no installation,
  and easy to share.
- **Decision:** Build `dashboard.html` — one file with data embedded and charts drawn as inline
  SVG (no external libraries/CDN), so it works fully offline by double-clicking.
- **Alternatives considered:** Excel charts (less interactive, harder to share a single live
  view); a charting library via CDN (rejected — would require internet); a hosted web app
  (rejected — overkill and needs setup).
- **Consequences:** Zero dependencies and trivial sharing. Trade-off: data is embedded in the
  file, so updating scores means regenerating the file from the source spreadsheet.

### ADR-001: Adopt the four-file agentic workflow scaffold

- **Date:** 2026-06-23
- **Status:** Accepted
- **Context:** The project needs a repeatable structure so an agent retains instructions,
  memory, rationale, and progress across sessions.
- **Decision:** Use `Claude.md` (instructions), `Memory.md` (durable facts),
  `Decisions.md` (this ADR log), and `Session_log.md` (chronological progress).
- **Alternatives considered:** A single monolithic notes file — rejected because it mixes
  stable rules with ephemeral logs and bloats per-session context.
- **Consequences:** Clear separation of concerns; each file has one job. Requires discipline
  to keep them updated, enforced via the workflow rules in `Claude.md`.
