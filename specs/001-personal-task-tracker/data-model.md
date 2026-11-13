# Data Model: Personal Task Tracker

**Specification**: [spec.md](spec.md) | **Decisions**: [research.md](research.md)

## Task

| Field | Type | Constraint | Source |
|-------|------|------------|--------|
| `id` | string | Nonempty, non-whitespace; unique in snapshot; generated with `crypto.randomUUID` for new tasks | Stable identity needed to delete only selected task (FR-006) |
| `title` | string | `title.trim().length > 0`; preserve original valid title; no maximum or uniqueness constraint | FR-001/FR-002; spec assumptions |
| `completed` | boolean | Exactly `true` or `false`, never coerced; new tasks start `false` | FR-003/FR-004/FR-007 |

Tasks have no relationships beyond membership in one personal list. No user/account entity, timestamps, priority, tags, due dates, or editing metadata. Duplicate titles are valid and distinct by ID. Render title strings as text.

## Persisted snapshot (proposed interface)

One JSON object stored at localStorage key `task-tracker.tasks`:

```json
{
  "version": 1,
  "tasks": [
    { "id": "a-generated-unique-id", "title": "Buy groceries", "completed": false }
  ]
}
```

- Root must be a non-null object, not an array; `version` must equal numeric `1`; `tasks` must be an array.
- Every array entry must be a non-null object with the three fields satisfying the Task constraints; IDs must be unique across the list.
- Validate the complete payload before accepting it. Any invalid entry rejects the entire snapshot; no partial recovery or normalization.
- Unknown extra properties may be ignored after required fields pass validation; copy only recognized fields into runtime tasks. Wrong versions are rejected; no migration is assumed.
- Missing key (`getItem` returns `null`) is valid fresh state. An explicit empty tasks array is valid saved empty state. Empty raw text, malformed JSON, `null`, wrong root shape, unsupported version, invalid fields, and duplicate IDs are errors, not empty state.
- Preserve array order (append new tasks); completion does not reorder tasks. A successful confirmed deletion may persist an empty array.

## State transitions

| Event | Preconditions | Persisted candidate | Visible result |
|-------|---------------|---------------------|----------------|
| Add | Ready state; title valid; new ID unique | Append `{id, title, completed: false}` | Added only after successful save; clear draft then |
| Complete | Ready state; ID exists and task incomplete | Selected task becomes `completed: true` | Task remains visible; no reversal action |
| Repeated complete | ID exists and already complete | No change, no write | Idempotent no-op; complete action unavailable |
| Request deletion | Ready state; ID exists | None yet | Confirmation prompt; task still present |
| Cancel deletion | Confirmation false | None, no write | Title/state/list remain unchanged |
| Confirm deletion | Confirmation true; ID exists | Remove only selected ID | Removed only after successful save |
| Invalid title/action target | Invalid title or nonexistent/invalid ID | None, no write | Actionable error; preserve valid state |
| Load missing/valid snapshot | Valid read/parse/validation | No write | Ready with empty or restored tasks |
| Load failure | Storage access/read throws or payload invalid | No write | Blocking error, no false empty-list claim, mutations unavailable |
| Save failure | Access/validation/serialization/write fails | No replacement | Prior tasks and storage retained; error shown; draft retained |

One-way completion is the owner's explicit planning decision. Refresh/reopen rehydrates all retained titles, states, and confirmed deletion results from the last successful snapshot.

## Transient UI state (not persisted)

- Load result: `ready(tasks)` or `load-error(message)`; no saved-data fallback on error.
- Title draft and title-validation feedback.
- Save/action error; successful later action may clear it.
- Native confirmation return value, accepted only as an explicit positive decision.

No pending transaction log, autosave queue, backup copy, or cross-tab reconciliation. The supported operating assumption is one active instance on a stable origin. Errors do not change the task array. A failed candidate is discarded rather than retained as an unsaved successful task.
