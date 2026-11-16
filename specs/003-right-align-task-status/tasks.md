# Tasks: Right-Aligned Task Status

**Input**: Design documents from `specs/003-right-align-task-status/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/task-status.md), [quickstart.md](quickstart.md)

**Verification**: Owner approved the three-column layout, full-title wrapping behavior, and test/build plus browser verification approach on 2026-11-13; approvals are recorded in `plan.md`. The owner confirmed T002, T008 and T009 OK in this session. Browser device/version and detailed evidence were not supplied here; see `quickstart.md`.

**Scope**: Only existing task-row layout selectors in `src/styles.css`. Preserve `src/App.tsx`, action icons/tooltips, task behavior, data, storage and dependencies.

## Format: `[ID] [P?] [Story] Description`

- `[P]` only means tasks touch disjoint files and can run independently after dependencies.
- `[US1]` is required for each user-story task. Paths are relative to repository root.

## Phase 1: Setup (Baseline)

**Purpose**: Capture current behavior and establish a passing test/build baseline without changing dependencies.

- [X] T001 Run `npm test` and `npm run build` from repository root; record actual test count and build result in `specs/003-right-align-task-status/quickstart.md`. If a baseline fails, report it before layout work and distinguish existing failures from feature regressions.
- [X] T002 Start the existing app with `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` and capture the current below-title status layout at 1024px, 480px and 320px with short and long task titles in an isolated profile; record browser/version, widths, status labels and baseline positioning in `specs/003-right-align-task-status/quickstart.md`.

## Phase 2: Foundational (No New Infrastructure)

**Purpose**: Confirm scope/approval already present in the approved plan; establish no code-level prerequisites beyond baseline.

- [X] T003 Confirm the owner-approved verification approach is recorded in `specs/003-right-align-task-status/plan.md` and that the approved behavior is consistent across `specs/003-right-align-task-status/spec.md`, `specs/003-right-align-task-status/research.md` and `specs/003-right-align-task-status/contracts/task-status.md`: only CSS changes; existing title wrapping preserves full unbroken titles; no new packages, DOM/state changes, tooltip fixes, status wording changes, truncation, hidden controls, or persistence changes. Reconcile any document conflict before implementation without expanding scope.

**Checkpoint**: Baseline, owner-approved verification approach, and approved layout behavior are recorded. No user data, task behavior, markup or dependencies will be changed.

## Phase 3: User Story 1 - See task status at the right edge (Priority: P1) — MVP

**Goal**: Preserve the existing Complete/Incomplete text while placing it to the right of the title and task actions at all supported widths.

**Independent Test**: With incomplete and completed tasks and short, wrapping and unbroken long titles, inspect 1024px, 480px and 320px browser layouts. Existing character-boundary wrapping must keep the full title visible at 320px; status remains visible at each row's right edge, beside rather than below the title; actions remain left of the title. Automated suite/build also pass.

### Core Flow Verification for User Story 1 (REQUIRED)

- [X] T004 Confirm the existing UI tests in `src/App.test.tsx` already assert the “Incomplete”/“Complete” labels, actions-before-title DOM order, task transitions, deletion cancellation/confirmation and tooltip behavior. Do not add duplicate tests or assertions coupled to CSS selectors; this feature changes placement only. Run `npm test -- src/App.test.tsx` and record its actual result in `specs/003-right-align-task-status/quickstart.md`.

### Implementation for User Story 1

- [X] T005 [US1] In `src/styles.css`, change `.task` to three columns `auto minmax(0, 1fr) max-content`; set `.task-actions` to column 1/row 1 with no two-row span; set `.task-title` to column 2/row 1 preserving `min-width: 0` and `overflow-wrap: anywhere`; set `.task-status` to column 3/row 1 with `justify-self: end` and existing `white-space: nowrap`. Preserve desktop `align-items: center`, existing status text/color, completed-title style, all other CSS, and the existing DOM/behavior.
- [X] T006 [US1] In the existing `@media (max-width: 480px)` block in `src/styles.css`, retain the same three columns and row-1 placements, reduce only the task column gap to `0.25rem`, keep existing `align-items: start` and title wrapping, and remove mobile rules that place status below title or make actions span multiple rows. Do not hide/truncate any content or modify tooltip styles.
- [X] T007 [US1] After T005–T006, run `npm test` and `npm run build` from repository root; resolve feature-caused failures and record actual commands/results in `specs/003-right-align-task-status/quickstart.md`. Confirm the existing UI DOM and task/action regression checks still pass; do not claim visual alignment from jsdom.
- [X] T008 [US1] Run the repeatable browser scenarios in `specs/003-right-align-task-status/quickstart.md` at 1024px, 480px and 320px with both task states, a short title, a wrapping long title and a 100-character unbroken title; record browser/version, each viewport/state/title result and evidence. At 320px confirm existing character-boundary wrapping keeps the full unbroken title visible while status remains right-aligned beside it without overlap; actions remain left of title. Confirm completion/delete/resize behavior and task data remain unchanged. Keep unchecked if any required case cannot be run or fails.

**Checkpoint**: Automated checks pass and the owner confirmed the browser scenarios OK; detailed browser evidence is not included in this repository. No code outside `src/styles.css` was changed for this feature.

## Phase 4: Polish & Cross-Cutting Verification

**Purpose**: Review scope, requirement traceability and actual evidence.

- [X] T009 Compare the feature-specific `src/styles.css` diff against FR-001–005 and `specs/003-right-align-task-status/contracts/task-status.md`; verify the task-row layout selectors implement the contract and no title truncation, label changes, tooltip or logic repairs were introduced by this feature. Distinguish pre-existing unrelated worktree edits from feature changes and report any browser case that remains unrun or failed. (CSS contract review performed; owner confirmed the task OK in this session.)

## Dependencies & Execution Order

### Phase Dependencies

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009
```

T001/T002 establish the pre-change state. T003 verifies the approved bounded approach. T004 checks existing behavior assertions before CSS work. T005/T006 are deliberately sequential because both edit the same stylesheet. Automated checks follow final CSS; browser geometry follows automated checks; final scope review follows all evidence.

### User Story Dependencies

- **US1 (P1)**: Starts after baseline and design-boundary confirmation; delivers the entire feature as one independently verifiable CSS-only story. There are no additional user stories in the specification.

### Parallel Opportunities

- No implementation task is safely parallelizable: all implementation work touches the same `src/styles.css` file.
- Baseline test and build commands in T001 may be run as a single combined validation; browser baselining T002 is separate.
- DOM/regression review T004 must finish before layout to distinguish behavior regressions.

## Parallel Example: Independent Baseline Commands

```text
Task: Run `npm test` and record the baseline outcome in specs/003-right-align-task-status/quickstart.md (T001)
Task: Run `npm run build` and record the baseline outcome in specs/003-right-align-task-status/quickstart.md (T001)
```

Do not concurrently write the shared evidence file; one executor should record both results.

## Implementation Strategy

### MVP First

Complete T001–T004, then make only the CSS changes in T005–T006. Run T007, then verify the actual visible layout and full-title wrapping using T008. The feature is not complete until browser acceptance proves right-side placement and non-overlap at 320px and wider viewports.

### Incremental Delivery

1. Record baseline code/test/build and browser layout.
2. Confirm all plan/design artifacts agree on scope.
3. Preserve existing UI/test contracts, then adjust base grid and narrow gap.
4. Run suite/build; record actual outcomes.
5. Verify both statuses, title lengths, widths and unchanged actions in a browser.
6. Review the diff and acceptance mapping before completion.

## Acceptance Coverage

| Specification coverage | Tasks |
|------------------------|-------|
| US1 scenarios 1–2; FR-001–003; SC-001 | T004, T007, T008 |
| US1 scenario 3; FR-004; SC-002 | T002, T005–T008 |
| US1 scenario 4; FR-005; SC-003 | T004, T007–T009 |
| Edge cases: wrapping, narrow width, both states, no behavior/data changes | T002, T004, T008–T009 |

## Notes

T001–T009 are marked complete based on recorded automated-check results, CSS contract review and the owner's confirmation of T002, T008 and T009. Detailed browser device/version and per-case evidence were not supplied in this session. Existing feature-002 browser/usability tasks remain out of scope and must not be marked complete here. No dependency or data-model change was made.
