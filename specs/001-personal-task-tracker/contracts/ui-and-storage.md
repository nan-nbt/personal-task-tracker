# UI and Storage Contract: Personal Task Tracker

**Status**: Proposed supporting design; owner-approved scope/stack in [../plan.md](../plan.md). This application exposes a user interface and a local persistence format, not a network API.

## User-facing contract

| Interaction | Required observable outcome | Requirements |
|-------------|-----------------------------|--------------|
| Open app | No authentication; show retained tasks with completion state, or a genuine fresh empty state; never present a load failure as an empty list | FR-003, FR-007, FR-008, FR-010 |
| Submit title | A labeled title input and Add action accept any string containing non-whitespace; append one incomplete task only after save succeeds | FR-001 |
| Submit blank/whitespace | Show “Enter a task title containing at least one non-whitespace character”; no task change or storage call | FR-002 |
| Complete | An action for incomplete tasks marks only that task complete after a successful save; task stays visible with textual complete status | FR-003–FR-005 |
| Completed task | No mark-incomplete action; completion reversal excluded by owner decision | Owner clarification |
| Request deletion | Native confirmation identifies the selected title; task remains present until confirmation and successful persistence | FR-006 |
| Cancel deletion | No task change and no persistence write | FR-006 |
| Confirm deletion | Remove exactly selected stable ID after save success, even when titles are duplicated | FR-006/FR-007 |
| Invalid target | Reject unknown/invalid target without writing; explain that the task is unavailable and suggest reloading | Constitution III |
| Load error | Visible blocking message: saved tasks could not be loaded and no saved data changed; resolve storage problem and reload; mutations disabled | FR-008 |
| Save error | Visible message: change could not be saved, saved tasks unchanged; check browser storage and retry; retain list/state/draft | FR-009 |

Use semantic form/list/button elements, an associated input label, readable incomplete/complete text, visible errors announced through alert semantics, and keyboard-operable actions. Completed state must not depend only on color. Duplicate-title rows still target their own IDs. Treat user titles as plain text; never use HTML injection. No login, sharing, filters, editing, reversal, or cross-device controls.

## Persistence contract

**Key**: `task-tracker.tasks` in the current origin's localStorage.

**Format**: Version 1 JSON envelope and Task constraints in [../data-model.md](../data-model.md). Use recognized validated fields only. No external endpoint or authentication credential exists.

### Load boundary

`loadTasks` returns either a validated task list (including empty only for missing key or valid empty snapshot) or an error result. Safely obtain storage and catch exceptions. Parse present raw data and validate the whole payload before returning tasks. Reading performs zero writes/removals, including malformed data and React StrictMode initialization. Errors preserve raw bytes and block app mutations. No automatic repair, reset, migration, or partial recovery.

### Save boundary

`saveTasks(candidate)` returns success or an error result. Validate candidate, serialize the full versioned snapshot, then synchronously replace the single app key with `setItem`. Do not call `clear` or `removeItem`, and do not touch unrelated keys. Any access, validation, serialization, or write failure returns an error; the caller must not commit candidate UI state or announce success. The previous stored value is untouched by failed localStorage writes; do not attempt destructive cleanup or compensating writes.

### Caller ordering

1. Reject invalid input/target before creating a candidate; confirm deletion before changing anything.
2. Compute candidate purely from current validated tasks.
3. Call save synchronously once.
4. Commit task state only on success; otherwise keep previous state and report failure.

Never write from a render, React state updater, mount effect, or automatic fallback. No asynchronous API, retry queue, concurrent-tab merge, or backend service is required. Successful state is durable within normal same-origin browser-storage guarantees; this is not protection against browser/site-data deletion.

## Contract verification

Adapter tests check null versus malformed values, version/root/field validation, duplicate IDs, invalid member rejection, storage access/read exceptions, successful round trip, and failed writes leaving previous raw bytes untouched. UI tests check accessible interactions and exact visible state after success, cancellation, and failure; StrictMode mount must not write. [../quickstart.md](../quickstart.md) maps scenarios to automated and real-browser checks.
