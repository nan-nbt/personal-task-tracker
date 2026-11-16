# UI Contract: Task Action Icons

**Status**: Supporting design approved by the owner on 2026-11-13, subject to `spec.md` scope. Requirements originate in [../spec.md](../spec.md). This application exposes a user interface, not a network API.

## Action availability and semantics

| Task state | Controls | Accessible names | Activation |
|------------|----------|------------------|------------|
| Incomplete | Checkmark completion icon, then trash-can delete icon | `Mark {title} complete`; `Delete {title}` | Existing `complete(id)` or `remove(id, title)` handler |
| Complete | Trash-can delete icon only | `Delete {title}` | Existing `remove(id, title)` handler |

Each control is a native non-submit button; SVG artwork is decorative and not focusable. Accessible names remain task-specific even though visible tips are short (`Mark as complete`, `Delete task`). Duplicate titles may have equal names; each control remains scoped to its row and stable task ID. No completion reversal, new confirmation mechanism, or replacement status presentation is introduced.

## Placement

The specification's layout requirement is retained verbatim:

> **FR-006**: The completion and delete action buttons MUST be positioned to the left of their task title.

The action group precedes title and status in DOM order and occupies the left column on desktop and at the existing minimum viewport width of 320px. Completion precedes deletion where present. Titles wrap within the remaining width; status may move below the title without moving actions above/below it. Completed titles retain their existing strike-through and textual completion state. Buttons remain unobscured, at least 32px square, with visible keyboard focus. No page-level sidebar, overflow menu, or replacement Add button is part of this feature.

## Tooltip interaction

| Event | Required result for proposed design |
|-------|-------------------------------------|
| Pointer enters action region | Show that action's explanatory tip |
| Button gains keyboard focus | Show tip and visible focus indicator |
| Pointer transfers from button to tip | Tip remains available; no dead gap in hover region |
| Pointer leaves while button remains focused | Tip remains visible unless dismissed |
| Button blurs while region remains hovered | Tip remains visible unless dismissed |
| Both pointer and focus leave region | Hide tip and reset prior dismissal |
| Escape while tip is visible | Hide tip without action activation; suppress reopening until both pointer and focus leave |
| Successful completion/delete removes trigger | Remove associated tip with the action |

Use a unique `useId`-generated tooltip identifier, `role="tooltip"`, and an `aria-describedby` association when the description is available. Tips contain plain text only, have no tab stop, and do not replace the button's accessible name. Avoid native `title` duplication. Hidden tips must not be exposed as visible tips to role queries. Tips are positioned without covering the trigger or clipping outside the usable viewport; browser validation is required, not inferred from DOM tests.

## Existing data and safety contract

Retain the existing [UI/storage contract](../../001-personal-task-tracker/contracts/ui-and-storage.md) and [../data-model.md](../data-model.md). No storage key/version change, migration, new field, or network request occurs. Hover, focus, Escape and tip display perform zero task mutations or persistence writes.

Completion updates only the selected incomplete task and commits UI state only after save succeeds. Deletion asks native confirmation before mutation; cancellation causes zero writes; confirmation targets only the selected ID. Failed saves retain previous list and saved bytes and show the existing error. Invalid load continues to block mutations without overwriting storage.

## Verification obligations

- US1 scenarios 1–5 / FR-003–005/007: role/name/description, hover, focus and action-availability checks; browser validation for actual appearance and focus outline.
- US1 scenarios 6–8 / FR-001/002/008: completion and confirmed/cancelled deletion, failed-write preservation, remount/refresh retention.
- US2 / FR-006: DOM-order test plus real-browser relative placement at desktop and 320px with long titles.
- Escape/reset and hover transfer: React-state interaction tests plus browser checks for real hit regions.

See [../quickstart.md](../quickstart.md) for commands, repeatable scenarios and evidence recording.
