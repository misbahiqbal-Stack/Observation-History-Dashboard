---
name: daily-wrap-up
description: Read today's notes and write a short dated Done/Doing/Next summary to log/. Use at the end of a work session, or once a day if several sessions happened, to keep a running record without re-deriving it later.
---

# Daily Wrap-Up

## When to use it

At the end of a work session — or once daily if multiple sessions happened — whenever real
progress occurred and is worth recording before it's lost to a context reset (new session,
compaction). This is a lightweight, purely chronological log, distinct from `doc-keeper-agent`
(which updates the *living* docs: `Planning.md`, `memory.md`, `Decision.md`). Wrap-up entries
are a diary; the living docs are current truth.

## Steps

1. **Gather today's notes.** Read the most recent entries in `memory.md` → "Session History",
   `Planning.md`'s Open Tasks, and (if useful) `git status`/`git log` for what actually changed
   today.
2. **Sort into three short lists** — a handful of bullets each, not a re-narration:
   - **Done** — what genuinely finished today.
   - **Doing** — in progress, not yet finished.
   - **Next** — queued up, not yet started.
3. **Write to `log/YYYY-MM-DD.md`** (create `log/` if it doesn't exist yet), using this shape:
   ```
   # YYYY-MM-DD

   ## Done
   - ...

   ## Next
   - ...

   ## Doing
   - ...
   ```
4. **Point back, don't repeat.** Link to `Planning.md`/`memory.md`/`Decision.md` for detail
   instead of restating it — the wrap-up is a pointer with just enough context to orient a
   reader (including a future session), not a duplicate of the living docs.

## Example

`log/2026-08-27.md`:

```markdown
# 2026-08-27

## Done
- Wrote 4 skills (.claude/skills/) and 4 agents (.claude/agents/) for this project — see
  Structure.md's "Project Layout" for the full list.
- Cross-linked Claude.md and Structure.md to the new .claude/ scaffold.
- Loosened .gitignore from blanket `.claude/` to just `.claude/settings.local.json` so the
  new skills/agents can be committed.

## Next
- None of the new agents have been run yet — first real use will validate whether their
  instructions are complete.

## Doing
- (nothing left in progress at end of session)
```
