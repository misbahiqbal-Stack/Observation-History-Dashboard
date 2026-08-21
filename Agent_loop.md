# Agent_loop.md

> The agent's operating loop for this project. Expanded from `Claude.md`'s old "Agent Workflow
> Rules" section into a standalone description of how each task should be worked.

## The Loop

1. **Read.** Before touching anything, read `memory.md` (durable facts + session history) and
   `Structure.md` (what each file currently is). Check `Planning.md` for open tasks that might
   already cover the request.
2. **Plan.** For anything non-trivial, outline the steps before acting. Confirm data structure
   or scope with the user first if there's any ambiguity — this project's history is full of
   corrections caught early by reading data back before building (see `memory.md` →
   "Conventions Learned").
3. **Act.** Make the change. Match existing style; don't reformat unrelated lines.
4. **Verify.** Open the file / run it, confirm the change works as intended. For these static
   HTML files, that means actually checking the page renders and behaves correctly, not just
   that the edit applied cleanly.
5. **Record.**
   - Any architectural or non-obvious choice → append an entry to `Decision.md`.
   - Any durable new fact (preference, constraint, gotcha) → update `memory.md`.
   - Anything left unfinished or discovered mid-task → add to `Planning.md`'s Open Tasks.
6. **Ask when blocked.** Surface genuine decisions to the user rather than guessing — this
   project's owner is non-technical and has repeatedly caught wrong assumptions early when
   asked; guessing has caused rework (see the mobile-redesign rejection in `memory.md`).

## Guardrails

- Do not commit secrets or credentials beyond what's already accepted as client-side-only
  (e.g. the plain-text passwords in `observations_laptop.html` — a known, accepted tradeoff,
  see `Decision.md`).
- Do not perform destructive git operations (force-push, hard reset) without explicit
  confirmation.
- Do not change dashboard structure or scoring logic without confirming first — explicit
  standing rule from the project owner (see `memory.md` → "Conventions Learned").
