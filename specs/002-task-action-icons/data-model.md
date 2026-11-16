# Data Model: Task Action Icons

## Existing persistent entities

This feature does not add fields, entities, storage keys, or migrations. `src/tasks.ts` and `src/taskStorage.ts` remain unchanged.

### Task

| Field | Type | Constraints |
|-------|------|-------------|
| id | string | Nonblank, unique in the task list; actions target this value, not the title |
| title | string | Contains a non-whitespace character; preserve original valid text; duplicates allowed |
| completed | boolean | Incomplete to complete is one-way; completed tasks remain visible until confirmed deletion |

### Snapshot

Existing version 1 envelope contains `version: 1` and the ordered `tasks` list. Existing storage key is `task-tracker.tasks`. Whole-payload validation rejects malformed values, unsupported versions, and duplicate IDs without rewriting saved data.

## Action transitions (unchanged)

| Event | Preconditions | Success | Failure/cancellation |
|-------|---------------|---------|----------------------|
| Complete | Valid existing incomplete task ID; loaded state ready | Persist candidate first, then display selected task complete and omit its completion action | Report failure; retain previous UI and saved bytes |
| Delete | Valid existing task ID; explicit confirmation | Persist candidate first, then remove selected task | Cancel writes nothing; failed save retains task and reports failure |
| Repeated complete | Already complete | No-op; no reversal | No new state |
| Load error | Invalid/unavailable saved data | No mutation allowed | Report error; do not present failed load as empty success or overwrite data |

## Transient presentation state

Icon artwork, tooltip text, accessible names, and tooltip visibility are derived UI information, never persisted. A task title is rendered as text, not markup. Separate tooltip identifiers are unique per rendered action even when task titles are duplicated.

Tooltip visibility depends on pointer presence and keyboard focus, with an Escape-dismissed state that resets only when both pointer and focus leave the action area. This state must not cause a task save, confirmation prompt, or completion transition. Full interaction behavior is specified in [the UI contract](contracts/task-actions.md).

No login, collaboration, synchronization, import/export, or new data-volume constraints are introduced.
