# Quickstart and Validation Guide: Personal Task Tracker

## Status and prerequisites

The standalone React/TypeScript/Vite application is implemented. Runtime prerequisite: Node.js 22.12+ (verified with Node v24.18.0), npm, and a modern browser with localStorage and `crypto.randomUUID`. The package manifest requires Node >=22.12. Use one browser profile, one active app tab, and the same origin (including port) for persistence checks. Use an isolated test browser profile/origin to avoid changing personal data.

Storage uses localStorage key `task-tracker.tasks`, containing the version-1 `{ "version": 1, "tasks": [...] }` snapshot. Missing key means a fresh list; malformed or invalid snapshots block mutations and show an error without modifying saved bytes. Save failures retain the last displayed and stored tasks (and a submitted draft), show an alert, and make no success claim. See [data-model.md](data-model.md) and [contracts/ui-and-storage.md](contracts/ui-and-storage.md) for the exact constraints and failure behavior.

## Setup and run (after implementation)

From the repository root:

```bash
npm ci
npm test
npm run build
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

`package.json` and `package-lock.json` are checked in. `npm ci` installs the locked dependencies. Scripts run Vitest once (`vitest run`) and type-check plus build (`tsc -b && vite build`). Open `http://127.0.0.1:5173`. Strict port prevents an automatic origin change hiding saved tasks. Previewing the static build on another port uses a separate storage origin and is not a persistence failure.

For data constraints and boundary behavior see [data-model.md](data-model.md) and [contracts/ui-and-storage.md](contracts/ui-and-storage.md); this guide does not duplicate implementation code.

## Automated validation matrix

The executable coverage currently includes model validation and immutable add/complete/delete operations, storage validation/failure handling, and role/label-based UI flows. The focused tests are in `src/tasks.test.ts`, `src/taskStorage.test.ts`, and `src/App.test.tsx`.

| Specification coverage | Executable checks | Expected result |
|------------------------|---------------------------|-----------------|
| US1 scenarios 1, 3, 4; FR-001/003/010 | `App.test.tsx`: add a valid title, inspect all titles/statuses, initial empty state, no login controls | New incomplete task visible; all retained tasks accessible without login |
| US1 scenario 2; FR-002; SC-002 | `tasks.test.ts`: table of empty/spaces/tabs/line breaks/mixed whitespace; `App.test.tsx`: invalid submit with pre-existing tasks | Every whitespace-only input rejected; feedback visible; list/raw storage unchanged, no write |
| Title assumptions/identity safety | Model/UI tests: preserve valid surrounding whitespace; Unicode/markup-like text; duplicate titles with distinct IDs | No unrequested restrictions; plain-text rendering; actions target IDs |
| US2 scenarios 1, 2; FR-004/005; SC-003 | UI complete then remount with saved snapshot; no reversal control; model repeated-completion test | Selected task remains visible as complete, retains order; no unintended reversal |
| US3 scenarios 1–3; FR-006; SC-004 | Mock native confirm true/false separately for incomplete and completed tasks; duplicate-title targeting | No write before confirmation; cancel changes nothing; confirm removes only selected task |
| US4 scenarios 1–3; FR-007 | UI add/complete/delete/cancel sequence, unmount/remount using same storage | Retained titles/states restored; confirmed deletion absent; cancelled task unchanged |
| Invalid saved data; FR-008 | `taskStorage.test.ts`: malformed JSON, empty raw text, null/wrong root, unsupported version, invalid fields, duplicate IDs, one invalid member, thrown getter/read | Whole payload rejected; raw storage unchanged; no partial list or write |
| Load failure presentation; FR-008 | UI tests under StrictMode with invalid/throwing storage | Blocking error, no false empty-list claim; mutations disabled; zero writes |
| Failed saves; FR-009 | Adapter validation/serialization/access/write failures; UI failed add/complete/confirmed-delete with pre-seeded good storage | Prior raw snapshot and visible state unchanged; draft retained for failed add; error and no success claim |
| Normal adapter contract | Round-trip nonempty/empty valid snapshots; missing-key read; verify unrelated key retained | Valid tasks restored, missing key genuinely empty; writes use one app key only |

Test setup must reset mocks and storage between cases. Use RTL role/label queries and user-event interactions. For failed-write tests, seed a good raw snapshot first and mock `setItem` to throw without writing; assert unchanged raw value and UI, not just an error message. Inject/mock serialization failure at the adapter boundary if not naturally reachable for valid string/boolean tasks. Space/tab/line-break model cases supplement form tests because a single-line HTML input normalizes line breaks.

## Real-browser core-flow validation

**Status**: The owner reports reviewing and confirming all previously uncompleted real-browser scenarios by following this Quickstart. The confirmation covers timed add/find, invalid submission, completion visibility, deletion confirmation/cancellation for both task states, same-origin refresh, and normal close/reopen. No browser/version, profile/origin, duration, or detailed observations were supplied in the confirmation; see the evidence note below. jsdom tests are separate automated verification and are not substituted for the owner's browser checks.

1. Open a fresh isolated test origin. Verify no login screen or collaboration UI.
2. Start a timer, add `Buy groceries`, and find the visible incomplete task. Expected: within 30 seconds (SC-001). Record measured duration.
3. Add `Call dentist`, plus a third task to delete. Submit empty and spaces-only titles. Expected: actionable title feedback and unchanged existing list.
4. Complete `Buy groceries`. Expected: still visible with complete status and no reversal action.
5. Request deletion of a retained task and cancel. Expected: title/state unchanged. Confirm deletion of the third task. Expected: only that task disappears.
6. Refresh on the same origin. Expected: retained titles/states identical; confirmed deletion absent; cancellation preserved.
7. Close the app tab/browser normally (not clearing data), reopen the same URL in the same profile, and inspect again. Expected: identical retained titles/states and deletion outcome. This real-browser step is not replaced by jsdom remount tests.
8. Repeat deletion cancellation/confirmation on a completed task. Expected: completed task remains until confirmed; refresh does not resurrect it after successful confirmed deletion.

Use the automated failure matrix for quota/denied-storage/corruption cases; do not inject corrupt data into a real user's origin. If manually exercising load errors in an isolated profile, preserve the prior raw value outside the app and only restore test data deliberately; the app itself must never auto-clear corruption.

## Completion evidence to record during implementation

| Check | Result | Evidence |
|-------|--------|----------|
| Foundation tests | PASS, 34 tests | `npm test -- src/tasks.test.ts src/taskStorage.test.ts`; initial RED run had four expected failures before implementation. |
| Final automated suite | PASS, 62 tests | After clean dependency install, `npm ci && npm test`, 2026-11-13. |
| Final production build | PASS | `npm run build` (`tsc -b && vite build`), 2026-11-13. |
| Timed add/find (SC-001) | OWNER-CONFIRMED PASS | Owner confirmed following Quickstart; duration and browser/version not supplied. |
| Refresh persistence (SC-003/SC-005) | OWNER-CONFIRMED PASS | Owner confirmed same-browser Quickstart flow; profile/origin details not supplied. |
| Close/reopen persistence (SC-003/SC-005) | OWNER-CONFIRMED PASS | Owner confirmed following Quickstart; browser/profile details not supplied. |
| Confirmation/cancellation (SC-004) | OWNER-CONFIRMED PASS; AUTOMATED PASS | Owner confirmed both-state deletion confirmation/cancellation; tests also cover cancel no-write, failed save and remount outcome. |

### Execution evidence (2026-11-13)

- Automated-test environment: Node v24.18.0, npm 11.16.0. The owner separately confirmed the browser checks described above; browser/version, exact profile/origin, and timing were not included in the confirmation.
- `npm test -- src/tasks.test.ts src/taskStorage.test.ts`: PASS, 34 tests; initial RED run failed as expected on missing title/payload/storage behavior.
- `npm ci && npm test`: PASS after clean locked dependency installation; 62 tests across the model, storage adapter, and application UI.
- `npm run build`: PASS; TypeScript type-check and Vite production build completed.
- Owner's confirmation: “I've reviewed and confirm by test following quickstart those all not completed task.” This is recorded as confirmation that the Quickstart's real-browser core-flow checks were performed and passed; specific environment metadata and measured duration were not provided.
- The owner-confirmed checks complete the browser-dependent portions of T015, T020, T025 and T031, as well as T034. Automated RTL tests remain a separate form of evidence; they are not claimed as real-browser verification.

SC-001/003/004/005 browser scenarios are owner-confirmed per this report. Timing, browser version, profile/origin, and detailed observed task states remain unspecified.
