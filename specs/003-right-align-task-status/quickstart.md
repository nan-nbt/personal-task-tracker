# Quickstart: Right-Aligned Task Status

## Prerequisites

Use the existing installed dependencies, Node >=22.12 and npm from `package.json`, and a modern browser. For a fresh checkout use the locked `npm ci` setup from [the base guide](../001-personal-task-tracker/quickstart.md); do not add dependencies. Use an isolated browser profile for test tasks, not personal data.

See [UI contract](contracts/task-status.md) and [unchanged data model](data-model.md). This guide proves feature 003 only; feature 002's outstanding verification remains separate.

## Existing automated checks

From repository root after the final implementation change:

```bash
npm test
npm run build
```

Expected: existing unit/storage/UI tests pass and TypeScript/Vite build succeeds. Preserve the UI tests for status wording, actions-before-title DOM order, completion/remount, delete confirmation/cancellation, failed writes and tooltip semantics. No test-framework or application-logic changes are needed for a CSS-only implementation. Automated checks do not prove grid geometry or narrow-screen fit.

## Repeatable browser acceptance

Start from repository root:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173` in an isolated profile; keep this origin throughout.

1. Create tasks titled `Short task`, `A long task title that wraps across multiple lines in a narrow row`, and a single unbroken 100-character title. Complete the short task to show both labels. Create a second completed long-title task to exercise wrapping with both states. The existing `overflow-wrap: anywhere` behavior must wrap the entire unbroken title at available character boundaries; do not truncate or hide any title content.
2. At a 1024px viewport, inspect every row: actions left, title middle, status right. Confirm status text's right edge matches the row's inner content edge (inside padding), and status is beside the title, not on a following line beneath it. Both labels must remain unchanged, visible and non-overlapping.
3. Repeat at 480px and 320px. Long and unbroken titles may wrap at available character boundaries using existing behavior, but the complete title must remain visible and neither label may move below it. Verify no horizontal clipping or overlap; icons remain left of the title and reachable. Record screenshots or observed geometry and pass/fail for each width/state/title case. Do not infer browser results from DOM order.
4. Complete an incomplete task using the existing icon. Verify only its status becomes “Complete,” its completion action disappears, and right alignment remains. Refresh the same origin and confirm retention.
5. Delete a completed and an incomplete task using existing confirmation: cancellation preserves the row and saved state; confirmation removes only the selected row. Remaining statuses stay right-aligned.
6. Verify keyboard access and existing hover/focus tooltip behavior are not changed by layout. Compare with the pre-change behavior; if a pre-existing tooltip defect is found, record it separately instead of silently broadening this feature.
7. At each width, verify empty-list presentation remains unchanged after deleting test tasks. Resize without activating actions and confirm it does not change task state or saved data.

If any required check cannot be executed, record it as unrun and keep its implementation task open. Failed-save and invalid-load safety remains covered by the existing automated regressions.

## Evidence (implementation phase)

| Check | Status | Required evidence |
|-------|--------|-------------------|
| Baseline `npm test` (T001) | Passed | 64 tests passed across 3 files before the CSS change |
| Baseline `npm run build` (T001) | Passed | `tsc -b && vite build` succeeded before the CSS change |
| Focused `npm test -- src/App.test.tsx` (T004) | Passed | 17 tests passed; existing labels, DOM order, state transitions, delete behavior and tooltip checks retained |
| Final `npm test` (T007) | Passed | 64 tests passed across 3 files after the CSS change |
| Final `npm run build` (T007) | Passed | `tsc -b && vite build` succeeded after the CSS change |
| Baseline browser layout (T002) | Owner confirmed OK | Owner confirmation received in this session; browser/version and detailed baseline evidence were not provided here |
| Desktop/480px/320px geometry (T008) | Owner confirmed OK | Owner confirmation received in this session; browser/version and per-case evidence were not provided here |
| Existing actions/refresh/empty list (T008) | Owner confirmed OK | Owner confirmation received in this session; specific scenario details were not provided here |

Owner approved the verification approach and full-title wrapping expectation on 2026-11-13. The owner confirmed T002, T008 and T009 OK in this session. Browser/version, screenshots or detailed observations were not provided here; owner confirmation is recorded without inventing evidence.
