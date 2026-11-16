# Data Model: Right-Aligned Task Status

## Existing Task (unchanged)

| Field | Type | Constraints |
|-------|------|-------------|
| id | string | Nonblank, unique within the list; actions target identity rather than title |
| title | string | Contains non-whitespace text; duplicate titles allowed; render as text |
| completed | boolean | Determines existing “Complete” or “Incomplete” label; completion is one-way |

The status label is derived from `completed`; its placement introduces no new field, entity, input, or transient application state.

## Persistence and lifecycle (unchanged)

The existing `task-tracker.tasks` localStorage entry contains a version 1 snapshot of ordered tasks. No migration, key change, storage write on resize, or new validation is required. Existing load validation rejects invalid snapshots without overwriting them. Mutations persist candidates before updating visible task state; save failures retain the previous state and report an error. Deletion retains native confirmation and cancellation behavior.

`src/tasks.ts`, `src/taskStorage.ts`, and application handlers remain unchanged. Layout must not alter task identity, order, lifecycle, accessible action names, or tooltip behavior.

See [contracts/task-status.md](contracts/task-status.md) for the presentation contract.
