# Tasks: Task Action Icons

**Input**: Design documents from `specs/002-task-action-icons/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/task-actions.md), [quickstart.md](quickstart.md)

**Verification**: Every core flow requires executable tests or repeatable browser verification and recorded results. This document generates work, not implementation evidence. All tasks start unchecked. The owner approved the technical design on 2026-11-13, explicitly subject to staying within `spec.md`; approval is recorded in `plan.md`, `research.md`, and `contracts/task-actions.md`.

**Organization**: Two P1 user-story increments on the existing app. No scaffolding, new dependency, model, API, or storage migration is required.

## Format: `[ID] [P?] [Story] Description`

- `[P]` identifies disjoint-file tasks that may run together once their shared prerequisites are complete.
- `[US1]` and `[US2]` map to specification stories; setup, foundation and final tasks have no story label.
- Paths are relative to repository root. Run commands from repository root. Preserve unrelated uncommitted work; do not commit unless requested.

## Phase 1: Setup (Existing Project Baseline)

**Purpose**: Establish the existing app's working baseline, not initialize a new project.

- [x] T001 Check the existing Node >=22.12 requirement and installed dependencies in `package.json`; run `npm test` and `npm run build`, recording actual baseline results in `specs/002-task-action-icons/quickstart.md`. Resolve or identify baseline blockers without changing dependencies for this feature.

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Satisfy the constitution's owner-approval gate.

- [x] T002 Record the owner's explicit 2026-11-13 approval of the inline SVG artwork, native button/naming approach, React-managed hover/focus tooltip behavior, responsive left-of-title grid, and validation approach in `specs/002-task-action-icons/plan.md`, `specs/002-task-action-icons/research.md`, and `specs/002-task-action-icons/contracts/task-actions.md`; approval is conditional on staying within `specs/002-task-action-icons/spec.md`.

**Checkpoint**: Baseline recorded in `specs/002-task-action-icons/quickstart.md`; design approval recorded in the linked planning documents. T001 baseline tasks remain pending execution.

## Phase 3: User Story 1 - Recognize task actions (Priority: P1) — MVP

**Goal**: Named icon-only completion/delete buttons with hover/focus tips and unchanged task behavior. Row placement is delivered in US2.

**Independent Test**: On incomplete and completed tasks, inspect icon actions, hover/focus explanations and keyboard operation; complete/delete/cancel/fail saves and verify unchanged persistence semantics. US1 can be validated before layout changes.

### Core Flow Verification for User Story 1 (REQUIRED)

- [x] T003 [US1] Add tests in `src/App.test.tsx` for native icon-only controls named `Mark {title} complete` and `Delete {title}`, decorative nonfocusable SVGs, completed-task omission of completion, tips `Mark as complete`/`Delete task` on hover and keyboard focus, unique valid `aria-describedby` relationships, hover-to-tooltip transfer, focus/hover persistence, Escape suppression until both exit, and Enter/Space activation; assert hover/focus/Escape cause no storage writes or confirmation. Retain/extend row-scoped duplicate-title, successful completion/remount, both-state delete confirm/cancel and failed completion/delete save checks; run `npm test -- src/App.test.tsx` before implementation and record expected new-test failures in `specs/002-task-action-icons/quickstart.md`.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Implement a local `TaskActionButton` component in `src/App.tsx` with `.task-action` wrapper, `.task-action-button` native non-submit button, and `.task-action-tooltip` tip; use inline checkmark/trash SVGs marked `aria-hidden` and nonfocusable, explicit task-specific accessible names, `useId` tooltip IDs, and `role="tooltip"` descriptions only when available. Show on hover or focus, preserve during pointer transfer, dismiss on Escape even for hover-only tips, reset dismissal only after pointer and focus both exit, and clean up any listeners on unmount. Reuse existing `complete`, `remove`, `persist`, disabled semantics and completed-task action omission; keep all transient state out of storage and titles as text.
- [ ] T005 [P] [US1] Style `.task-action`, `.task-action-button`, and `.task-action-tooltip` in `src/styles.css` with compact at-least-32px controls, visible focus, recognizable SVGs and readable tips; provide a continuous hover region without a pointer-breaking gap, avoid covering controls or clipping tips, and scope changes to task actions without restyling Add task or changing row placement yet.
- [ ] T006 [US1] After T004/T005, run `npm test -- src/App.test.tsx`; fix feature-caused failures and record passing outcomes in `specs/002-task-action-icons/quickstart.md`, including icon availability, tooltip interactions, keyboard activation, complete/remount, delete confirm/cancel and failed-save unchanged-state checks.
- [ ] T007 [US1] Start `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` and execute browser scenarios 1–7 and 9 in `specs/002-task-action-icons/quickstart.md` using an isolated profile; record browser/version and actual icon recognition/action availability, focus outline, hover transfer, Escape/reset, keyboard complete/delete/cancel, accessibility inspection, and same-origin refresh outcomes there. Conduct and record the five-participant, three-row recognition check specified in `specs/002-task-action-icons/quickstart.md` for SC-001, without collecting personal data. Defer all relative-to-title placement verification to scenario 8 and T011. Keep this task unchecked if required browser checks cannot be run.

**Checkpoint**: T006's focused UI tests pass. Browser checks and the SC-001 moderated recognition check remain pending (T007); full feature completion also requires US2.

## Phase 4: User Story 2 - Find actions beside the task title (Priority: P1)

**Goal**: Actions appear to the left of each title on desktop and at 320px, including long wrapped titles and completed rows.

**Independent Test**: DOM ordering plus real-browser desktop/320px checks show each task's available controls left of its title, unobscured and reachable. DOM assertions alone do not prove visual placement.

### Core Flow Verification for User Story 2 (REQUIRED)

- [x] T008 [US2] Add failing assertions in `src/App.test.tsx` that `.task-actions` precedes its `.task-title` within every row for incomplete/completed/duplicate-title/long-title cases, completion precedes delete when available and completed rows offer delete only; run `npm test -- src/App.test.tsx` before reordering and record the expected ordering failures in `specs/002-task-action-icons/quickstart.md`.

### Implementation for User Story 2

- [ ] T009 [P] [US2] Move `.task-actions` before `.task-title` and `.task-status` in each task row in `src/App.tsx`; retain stable row keys, task order, correct per-ID handlers, incomplete/complete status text, and US1 tooltip/button behavior.
- [ ] T010 [P] [US2] Replace the full-width `.task-actions` row and mobile single-column collapse in `src/styles.css` with an auto-sized left actions column, wrapping `minmax(0, 1fr)` title column, and readable status (below title on narrow screens); retain left-of-title controls at 320px, completed-title styling and focus outlines, and prevent action/title/tooltip overlap or horizontal clipping.
- [ ] T011 [US2] After T009/T010, run `npm test -- src/App.test.tsx` and repeat browser layout and interaction scenarios 1–9 in `specs/002-task-action-icons/quickstart.md` at desktop and 320px with mixed-state, duplicate and very long titles; execute Quickstart scenario 8 for layout and repeat scenarios 2–5 for tooltips after layout changes; record test result, viewport/browser, actual left-of-title positioning, wrapping, unobscured targets and unclipped hover/focus tips there. Confirm layout changes do not regress US1; do not mark complete from jsdom ordering alone.

**Checkpoint**: Automated DOM and interaction tests pass. Real-browser evidence, including 320px/wrapped-row placement and tooltip hit behavior, remains required by T007/T011 before claiming complete.

## Phase 5: Polish & Cross-Cutting Verification

**Purpose**: Final evidence and bounded-scope acceptance review.

- [ ] T012 Run `npm test` and `npm run build` after the final source edit; fix feature-caused failures and record commands/results in `specs/002-task-action-icons/quickstart.md`, preserving regression coverage in `src/tasks.test.ts`, `src/taskStorage.test.ts` and `src/App.test.tsx`. Recheck affected browser scenarios after any visual/interaction fix.
- [ ] T013 Review `src/App.tsx`, `src/App.test.tsx`, and `src/styles.css` against every US1/US2 scenario and FR-001–008/SC-001–004 in `specs/002-task-action-icons/spec.md`; record evidence links/outcomes in `specs/002-task-action-icons/quickstart.md`, confirm no new dependency or storage-format/handler change, and update completed task checkboxes in `specs/002-task-action-icons/tasks.md` only for work actually verified. Report blocked/unrun checks rather than claiming completion.

## Dependencies & Execution Order

### Phase Dependencies

Setup → Foundation/approval → US1 → US2 → Final verification.

```text
T001 → T002 → T003 → (T004 || T005) → T006 → T007
     → T008 → (T009 || T010) → T011 → T012 → T013
```

The second line continues after T007. Both stories are P1; specification order determines delivery order. US2 uses US1's action markup/component and shares files, so story-level concurrent implementation is not recommended. Its placement acceptance remains separately testable.

### Within Each User Story

- Write and execute expected failing tests before implementation; distinguish expected missing-feature failures from broken test setup.
- Parallel implementation pairs start only after their story's RED tests and after approval.
- Execute tests after both pair members finish; record browser checks before the story checkpoint.
- Keep model/storage code unchanged; no model/service/API tasks are necessary.

### Parallel Opportunities

- T004 (`src/App.tsx`) and T005 (`src/styles.css`) share predetermined action class names and may run together after T003.
- T009 (`src/App.tsx`) and T010 (`src/styles.css`) may run together after T008; they use existing row class names.
- Tests and browser evidence edits share files with other tasks; do not concurrently write them. Use sequential checks and a single evidence writer.

## Parallel Example: User Story 1

After T003 and approval:

```text
T004: Implement the local TaskActionButton and tooltips in src/App.tsx.
T005: Style .task-action, .task-action-button and .task-action-tooltip in src/styles.css.
```

Wait for both, then execute T006 and T007. T007 includes the moderated SC-001 recognition check and US1-only browser verification; do not infer passing behavior from either change alone.

## Parallel Example: User Story 2

After T008 and US1 checkpoint:

```text
T009: Move .task-actions before title/status in src/App.tsx.
T010: Keep actions in the left grid column at desktop/320px in src/styles.css.
```

Wait for both before running T011; jsdom does not validate actual CSS geometry. T011 performs left-of-title placement checks and repeats tooltip browser checks after layout changes.

## Implementation Strategy

### MVP First (User Story 1)

Complete T001–T002, then T003–T007. Deliver recognizable named icons and explanatory tips with preserved task behaviors. Review that increment before layout changes; it is not the full feature because left-of-title placement is still pending.

### Incremental Delivery

Add US2 via T008–T011, preserving US1 outcomes, then run T012–T013. No deployment, commits or unrelated refactors are implied by task completion.

## Acceptance Coverage

| Specification coverage | Tasks |
|------------------------|-------|
| US1 scenarios 1–5; FR-003–005/007; SC-001/003 | Automated semantics/tooltip tests: T003, T006; SC-001 moderated check and visual/focus browser verification: T007 (pending); tooltip browser recheck after layout: T011 (pending) |
| US1 scenarios 6–8; FR-001/002/008; SC-004 | T003, T004, T006, T007, T012 |
| US2 scenarios 1–2; FR-006; SC-002 | T008–T011 |
| Safety and edge cases; all-flow evidence | T003, T007, T011–T013 |

## Notes

Implementation session on 2026-11-13: new US1/US2 tests were added; full suite passed (64/64) and production build passed after the feature implementation. A final CSS adjustment to tooltip pointer behavior was made afterward, so T006's final-post-change test verification is pending and remains unchecked. Browser and five-participant usability evidence are also pending. Record verification honestly; do not substitute base-feature results for this feature's evidence.
