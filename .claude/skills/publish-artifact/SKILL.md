---
name: publish-artifact
description: Use when publishing or refreshing a Claude Artifact for one of this project's dashboard HTML files. Covers the CSP-safe substitutions required and what to record afterward.
---

# Publishing a Dashboard as a Claude Artifact

Claude Artifacts enforce a strict Content-Security-Policy that blocks **all** external CDN
requests. `frontend/observations.html` and `frontend/observations_laptop.html` load Google Fonts and (in
`frontend/observations.html`'s case) Material Icons from a CDN in their normal, double-click-to-open
form — these must be substituted before the file will render as an Artifact.

## Required substitutions (established pattern, done for frontend/observations.html on 2026-07-01)

- **Google Fonts link** → replace with a system font stack:
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Material Icons** → replace each icon with a Unicode equivalent, e.g. `←` (arrow_back),
  `▾` (expand_more/chevron), `⋮` (more_vert), `◎` (visibility), `+` (add), `✓` (save). Add an
  `aria-label` to each icon button once the icon glyph alone is less self-describing.
- Add `font-variant-numeric: tabular-nums` to numeric displays (scores, dates) for alignment.
- Add `:focus-visible` outlines for keyboard navigation.
- All layout, color tokens, data, and JS logic stay unchanged — this is a compatibility pass,
  not a redesign.

## Steps

1. Make the substitutions above in the actual source file (not just a scratch copy) if the
   change is meant to be permanent — otherwise work from a scratchpad copy per the artifact
   workflow.
2. Verify the file still opens correctly by double-clicking it locally (it must keep working
   fully offline outside of Artifacts too).
3. Publish via the Artifact tool.
4. Record the resulting Artifact URL in `Structure.md`'s entry for that file, and add a dated
   `memory.md` → "Session History" entry noting what was republished and why.

## Known failure mode — keep source and Artifact in sync

A past session (2026-07-01, Session 5) republished an Artifact that was **behind** the actual
source file (stale sort order, a leftover `ind-kpi-row` element) — the scratchpad copy hadn't
been kept in sync with edits made to the real file. When republishing, always diff the
scratchpad/Artifact content against the current source file first, not just against your
memory of what changed.
