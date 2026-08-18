# CLAUDE.md

> Persistent project instructions. This file is loaded into the agent's context at the
> start of **every** session. Keep it concise, current, and high-signal — everything here
> costs context budget on every run.

## 1. Project Overview

- **Name:** <project name>
- **Purpose:** <one or two sentences on what this project does and for whom>
- **Status:** <prototype | active development | maintenance>

## 2. Tech Stack

- **Language(s):** <e.g. Python 3.12, TypeScript>
- **Frameworks / key libraries:** <e.g. FastAPI, React>
- **Tooling:** <package manager, linter, formatter, test runner>

## 3. Project Structure

```
<top-level layout — only the directories that matter>
src/        # application code
tests/      # test suite
docs/       # documentation
```

## 4. Commands

| Task    | Command            |
| ------- | ------------------ |
| Install | `<install cmd>`    |
| Run     | `<run cmd>`        |
| Test    | `<test cmd>`       |
| Lint    | `<lint cmd>`       |
| Build   | `<build cmd>`      |

## 5. Coding Conventions

- Match the style of surrounding code; do not reformat unrelated lines.
- <naming conventions, e.g. snake_case for functions>
- <error-handling expectations>
- <testing expectations — write/update tests for changed behavior>

## 6. Agent Workflow Rules

These rules govern how the agent operates in this project:

1. **Read before writing.** Inspect existing files and patterns before adding code.
2. **Plan, then act.** For non-trivial work, outline the steps first.
3. **Record decisions.** Append any architectural or non-obvious choice to `Decisions.md`.
4. **Update memory.** Durable facts (preferences, constraints, gotchas) go in `Memory.md`.
5. **Log sessions.** Summarize what changed and what's next in `Session_log.md`.
6. **Verify.** Run tests/build after changes; report failures honestly.
7. **Ask when blocked.** Surface genuine decisions to the user rather than guessing.

## 7. Guardrails

- Do **not** commit secrets, credentials, or `.env` contents.
- Do **not** perform destructive operations (force-push, mass-delete, drop tables) without explicit confirmation.
- Do **not** edit generated files or `node_modules` / `dist` directly.
- <other project-specific boundaries>

## 8. References

- Memory: [Memory.md](Memory.md)
- Decisions: [Decisions.md](Decisions.md)
- Session log: [Session_log.md](Session_log.md)
- External docs: <links>
