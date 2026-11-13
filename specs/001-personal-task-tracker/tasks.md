# Tasks: Personal Task Tracker

**Input**: Reviewed design documents in `specs/001-personal-task-tracker/`: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-and-storage.md`, and `quickstart.md`; constitution version 1.0.0.

**Scope**: One standalone React/TypeScript/Vite screen, Vitest/React Testing Library, localStorage, one-way completion. No login, sharing, backend, G2FW, reversal, editing, filtering, or extra task metadata.

**Review status**: The owner reviewed and approved the consistency corrections proposed in the analysis. Implementation choices still marked Proposed in `plan.md` remain subject to owner approval before implementation. The spec's historical open decisions are resolved by the dated clarification.

**Verification**: Write tests before implementing the corresponding behavior, observe the intended failure, implement, and run again. Verification tasks record actual results in `quickstart.md`; a checked task means its work/check actually completed. No implementation checks have run during task generation.

## Format and Path Conventions

Tasks use `- [ ] Tnnn [P?] [USn?] Description with file path`. Paths are repository-relative. `[P]` means separate-file work can run concurrently after the prerequisites listed below have completed, not that the task can ignore dependencies. Only story tasks have `[USn]` labels. Do not create a backend or an additional package.

## Phase 1: Setup

**Purpose**: Establish the standalone app and existing project checks without overwriting repository documentation or configuration.

- [ ] T001 Create `package.json` and `package-lock.json` for React/React DOM, TypeScript, Vite/React plugin, Vitest, React Testing Library, jsdom, jest-dom, and user-event; select compatible stable versions meeting Node engine constraints and lock them; supply `dev`, `test` (`vitest run`), `build` (`tsc -b && vite build`), and `preview` scripts without company dependencies
- [ ] T002 Configure `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, and `src/test/setup.ts` for React, strict TypeScript, jsdom, jest-dom, RTL cleanup, and mock/storage isolation between tests
- [ ] T003 Create `index.html`, `src/main.tsx`, minimal `src/App.tsx`, and `src/styles.css` with a React StrictMode root; update existing `.gitignore` for node_modules and build artifacts without replacing existing entries; create no persistence effects or unrelated sample features

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared validation and safe persistence so every story uses durable mutations from its first increment.

**Boundary contracts**: `src/tasks.ts` exports Task (`id`, `title`, `completed`), version-1 snapshot types, title/payload validation, and explicit success/error results. `src/taskStorage.ts` exports `loadTasks` and `saveTasks` results and key `task-tracker.tasks`; safely access storage at call time, never at module import. Pure add/complete/delete helpers are implemented in their story phases.

- [ ] T004 [P] Write failing table-driven tests in `src/tasks.test.ts` for blank/spaces/tabs/line-break/mixed-whitespace titles, preserved valid strings, non-null object snapshot root, numeric version 1, task array, valid field types, nonblank IDs, unique IDs, whole-payload rejection, and copying recognized fields only while tolerating extras per `data-model.md`
- [ ] T005 [P] Write failing adapter tests in `src/taskStorage.test.ts` for missing key versus malformed/empty/null/wrong-version data, one invalid member, duplicate IDs, storage getter/read exceptions, valid empty/nonempty round trips, and unchanged unrelated keys; assert zero writes/removals on every load path and unchanged seeded raw bytes on validation/serialization/access/setItem failures
- [ ] T006 Implement types and validators in `src/tasks.ts` to satisfy T004: use `trim().length > 0` only to validate and retain original valid titles; accept duplicate titles, reject duplicate IDs, validate every task before accepting any, and add no title-length/character/task-count restrictions
- [ ] T007 Implement `src/taskStorage.ts` to satisfy T005: distinguish `getItem` null from corrupt data, parse and validate the whole versioned snapshot, validate/serialize candidate before one `setItem`, catch all boundary errors, return explicit errors, and never call clear/removeItem, repair corrupt data, or perform a cleanup write
- [ ] T008 Run `npm test -- src/tasks.test.ts src/taskStorage.test.ts` and `npm run build`; fix failures in `src/tasks.ts`, `src/taskStorage.ts`, and setup files and record actual commands, failure-to-pass evidence, and final outcomes in `specs/001-personal-task-tracker/quickstart.md`
- [ ] T009 Update `specs/001-personal-task-tracker/quickstart.md` with actual Node/tooling prerequisites, `npm ci`, `npm test`, `npm run build`, and `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` instructions, same-profile/origin limits, and an execution-evidence section that leaves unrun checks explicitly NOT RUN

**Checkpoint**: Foundation is complete only after T008 passes. Every mutation below saves before committing displayed state; persistence is not deferred to US4. US4 adds comprehensive restoration/error verification and hardening.

## Phase 3: User Story 1 - Capture and review tasks (Priority: P1) — MVP

**Goal**: Add/view tasks without login; reject blank titles without changing valid data.

**Independent test**: Open fresh test storage, add a title, find its incomplete status, submit blank/spaces-only titles, and inspect unchanged prior tasks and storage with actionable feedback. Test tabs/line breaks at the model boundary because a single-line HTML input normalizes them.

### Core Flow Verification (tests first)

- [ ] T010 [P] [US1] Add failing add-candidate tests in `src/tasks.test.ts`: append original valid title with unique generated ID and `completed: false`, allow same-title tasks, retain insertion order, reject invalid titles/IDs or ID collisions, and never mutate the input array
- [ ] T011 [P] [US1] Write failing role/label-based RTL tests in `src/App.test.tsx` for fresh list, labeled title input, valid add and visible statuses, mixed completed/incomplete seeded list, blank submission feedback/no writes, duplicate/Unicode/markup-like titles rendered as text, no login/sharing controls, and failed-add draft/list/raw-value preservation

### Implementation

- [ ] T012 [US1] Implement pure add-candidate operation in `src/tasks.ts`; generate new IDs with `crypto.randomUUID` at the caller boundary and validate uniqueness before accepting a candidate; return actionable errors instead of changing valid tasks
- [ ] T013 [US1] Implement form/list in `src/App.tsx` with validated lazy `loadTasks`, ready versus blocking load-error states, title validation, stable-ID rows and textual completion status; on add call `saveTasks` before setting React task state/clearing draft, preserve draft/list on error, render strings as text, and never write in render/updaters/mount effects
- [ ] T014 [US1] Implement minimal keyboard-usable layout and visible error/status/focus styling in `src/styles.css`; use associated input labels, semantic form/list/buttons and alert feedback in `src/App.tsx`, with completion cues not dependent on color alone
- [ ] T015 [US1] Run `npm test -- src/tasks.test.ts src/App.test.tsx`; manually time adding/finding a task at `http://127.0.0.1:5173` using the quickstart command, verify under 30 seconds plus no-login/blank-title behavior, and record command/results, browser, origin and duration in `specs/001-personal-task-tracker/quickstart.md`

**Checkpoint**: Usable add/view/validation MVP with safe storage. Completion and deletion controls are not yet delivered; do not describe the MVP as the full feature.

## Phase 4: User Story 2 - Complete and retain tasks (Priority: P1)

**Goal**: One-way completion keeps completed tasks visible in the same position.

**Independent test**: Complete one incomplete task, verify only its state changes and it remains visible with no reversal control; remount, refresh and close/reopen on the same origin to verify it remains complete.

### Core Flow Verification (tests first)

- [ ] T016 [P] [US2] Write failing complete-candidate tests in `src/tasks.test.ts` for selecting stable ID, preserving peers/order/input, rejecting unknown/invalid IDs, and treating already-completed targets as no-op without reversal
- [ ] T017 [P] [US2] Write failing RTL tests in `src/App.test.tsx` for complete action, retained complete text, no mark-incomplete or reversal action, same-storage remount restoration, and failed save preserving displayed incomplete state and seeded raw bytes with feedback; test repeated-completion no-op only at the model boundary in T016

### Implementation

- [ ] T018 [US2] Implement pure complete-candidate result in `src/tasks.ts` with distinct changed/no-op/error outcomes; unknown targets are errors, already-completed targets are no-op, and no reversal operation exists
- [ ] T019 [US2] Add stable-ID complete actions in `src/App.tsx`; persist changed candidates before updating state, do not write for no-op/error, keep completed rows visible, report actionable target/save errors, and provide no reversal control
- [ ] T020 [US2] Run `npm test -- src/tasks.test.ts src/App.test.tsx`; verify completed visibility and refresh/close-reopen on the same browser profile/origin using `quickstart.md`, and record exact automated/manual outcomes in `specs/001-personal-task-tracker/quickstart.md`

**Checkpoint**: Complete/retain flow passes independently on a seeded task list; no deletion feature is needed for this check.

## Phase 5: User Story 4 - Return to saved tasks (Priority: P1)

**Goal**: Prove restoration and failure-safe persistence for available operations; verify deletion persistence again after US3 is implemented.

**Independent test**: Seed or create mixed-state tasks, reload/remount/reopen and compare titles/states. Inject corrupted/denied storage and failed saves only in automated tests or an isolated test profile, never a user's data.

### Core Flow Verification (tests first)

- [ ] T021 [US4] Add a focused StrictMode integration test in `src/App.test.tsx` proving React mount/remount reads valid and corrupt saved data without writing or removing storage
- [ ] T022 [US4] Extend `src/App.test.tsx` with add/complete unmount/remount restoration and load/save error UI tests for corrupt/getter/read failures; assert blocking actionable feedback, unavailable mutations, failed-save no-success/list/draft preservation, and later successful retry clearing the save error

### Implementation and verification

- [ ] T023 [US4] Review `src/taskStorage.ts` against the T005 tests and fix only any observed failures; do not duplicate the corruption/failure test matrix or add reset, migration, backup, queue or partial recovery
- [ ] T024 [US4] Harden `src/App.tsx` load/error and transaction handling against T022; disable mutations after failed load, suggest resolving storage/reloading, commit only saved candidates, preserve last-good tasks on error, clear stale save errors after successful retry, and keep all storage side effects outside React updaters/effects
- [ ] T025 [US4] Run `npm test -- src/taskStorage.test.ts src/App.test.tsx`; follow same-origin refresh and normal browser close/reopen checks for mixed-state retained tasks from `quickstart.md`, record results in `specs/001-personal-task-tracker/quickstart.md`, and explicitly mark the confirmed/cancelled-deletion subscenarios pending T031 rather than passed
- [ ] T026 [US4] Update `specs/001-personal-task-tracker/quickstart.md` to reflect implemented storage key/version, supported browser/origin assumptions, load/save feedback, unchanged-data guarantees and run instructions; retain accurate evidence and reference `data-model.md`/`contracts/ui-and-storage.md` rather than duplicating implementation

**Checkpoint**: US4's add/completion restoration and errors are verified; its deletion acceptance scenarios cannot be closed until T031. Priority ordering is preserved without pretending a dependency is implemented.

## Phase 6: User Story 3 - Delete a task deliberately (Priority: P2)

**Goal**: Request confirmation before removing either incomplete or completed tasks; cancellation changes nothing and confirming removes only selected ID after a successful save.

**Independent test**: Seed incomplete/completed tasks, including same-title peers; request delete and inspect list/raw snapshot inside the mocked prompt before returning false/true. Cancel preserves title/state; confirm deletes only selected ID; failed save keeps it visible.

### Core Flow Verification (tests first)

- [ ] T027 [P] [US3] Write failing delete-candidate tests in `src/tasks.test.ts` for immutable selected-ID removal, preservation of same-title peers/title/state/order, rejection of invalid/unknown IDs, and valid empty candidate after last-task deletion
- [ ] T028 [P] [US3] Write failing native-confirm RTL tests in `src/App.test.tsx` for both task states, inspecting no removal/write before prompt answer; cover cancel no-op, confirm only selected ID, duplicate titles, failed confirmed-delete save retaining UI/raw bytes, and remount proving confirmed deletion absent/cancelled deletion unchanged

### Implementation

- [ ] T029 [US3] Implement pure delete-candidate operation in `src/tasks.ts` returning an error for unavailable IDs and removing only the selected task from a copied list without mutating peers
- [ ] T030 [US3] Add accessible per-row delete actions in `src/App.tsx`; validate target before native `window.confirm` identifying its title, return without writes on cancellation, save confirmed candidate before committing removal, and preserve prior data/show actionable failure on save error
- [ ] T031 [US3] Run `npm test -- src/tasks.test.ts src/taskStorage.test.ts src/App.test.tsx`; manually confirm/cancel deletion for both states and repeat the full US4 add/complete/confirm-one/cancel-another refresh and close-reopen sequence; record commands/browser/profile/origin/results in `specs/001-personal-task-tracker/quickstart.md` and close pending US4 deletion checks only when they pass

**Checkpoint**: US3 confirmation/cancellation and US4 deletion persistence all pass; completed tasks remain until successfully saved confirmed deletion.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final evidence, scope check, and accurate start/test instructions; no speculative refactor or tooling.

- [ ] T032 Review `src/App.tsx`, `src/styles.css`, `src/tasks.ts`, and `src/taskStorage.ts` against `specs/001-personal-task-tracker/contracts/ui-and-storage.md` and FR-001–FR-010; correct actual accessibility/data-safety gaps, ensure no HTML injection or unapproved features, and retain native confirmation/minimal module boundaries
- [ ] T033 After the last code edit run `npm test` and `npm run build` from the root using `package.json`; fix failures and record actual final command/date/test summary/type-check/build results in `specs/001-personal-task-tracker/quickstart.md`
- [ ] T034 Repeat every real-browser core-flow scenario in `specs/001-personal-task-tracker/quickstart.md` on an isolated same-origin/profile: timed add/find under 30 seconds, invalid submission, completed visibility, both-state deletion confirm/cancel, refresh, and normal close/reopen; record expected versus observed tasks/states/deletions and pass/fail, never substitute jsdom for real reopening
- [ ] T035 Finalize `specs/001-personal-task-tracker/quickstart.md` start/test instructions and actual verification evidence; check this `specs/001-personal-task-tracker/tasks.md` against the traceability matrix; report incomplete/blocked checks explicitly; close implementation only after all required flows and final checks pass


## Dependencies & Execution Order

### Phase and story graph

```text
Setup T001–T003
  → Foundation T004–T009
  → US1 T010–T015 (P1; MVP)
  → US2 T016–T020 (P1)
  → US4 T021–T026 (P1; deletion verification pending)
  → US3 T027–T031 (P2; also closes US4 deletion checks)
  → Final T032–T035
```

Stories follow priorities P1 (US1, US2, US4), then P2 (US3). US4's saved deletion outcome is necessarily verified only after US3; this is a verification dependency, not a reason to postpone safe storage in earlier stories. Tests can independently seed known valid incomplete/completed lists rather than requiring previous story interactions as setup.

### Task-level prerequisites

| Task(s) | Prerequisites and ordering |
|---------|----------------------------|
| T001 → T002 → T003 | Sequential setup; T003 provides a buildable empty UI |
| T004, T005 | T003; parallel failing-test authoring in different files against the boundary contracts |
| T006 | T004; run model tests and see expected failure first |
| T007 | T005 and T006; adapter uses model validation |
| T008 → T009 | T006/T007; baseline checks then accurate instructions |
| T010, T011 | T009; parallel model/UI tests in different files |
| T012 → T013 → T014 → T015 | T010/T011 failures observed; implement model, UI, styles, then run/record story checks |
| T016, T017 | T015; parallel model/UI tests |
| T018 → T019 → T020 | T016/T017 failures observed; operation, integration, checks |
| T021 → T022 | T020; same-file mount-safety test then restoration/error tests, serialize edits |
| T023 → T024 → T025 → T026 | T021/T022 failures observed; review adapter against T005, fix only observed gaps, UI, checks, instructions |
| T027, T028 | T026; parallel model/UI tests |
| T029 → T030 → T031 | T027/T028 failures observed; operation, UI, automated/manual persistence checks |
| T032 → T033 → T034 → T035 | T031; final review/corrections, checks after last edit, manual checks, evidence/report |

All tasks are written in recommended execution order. Only paired test-authoring tasks are marked `[P]`; those share completed prerequisites, edit different files, and do not depend on one another. Within a single source/test file and across story phases, serialize work. Do not parallelize whole stories against shared `App.tsx`/`App.test.tsx`.

## Parallel Examples Per Story

After each preceding checkpoint, launch independent test-writing tasks together, then resume sequential implementation:

| Story | Workstream A | Workstream B | Join before |
|-------|--------------|--------------|-------------|
| US1 | T010: `src/tasks.test.ts` add candidates | T011: `src/App.test.tsx` capture/view UI | T012–T015 |
| US2 | T016: `src/tasks.test.ts` completion | T017: `src/App.test.tsx` completion UI | T018–T020 |
| US3 | T027: `src/tasks.test.ts` deletion | T028: `src/App.test.tsx` confirmation UI | T029–T031 |

US4 tasks T021/T022 both edit `src/App.test.tsx`, so serialize them rather than parallelizing. Foundation permits T004 (`src/tasks.test.ts`) and T005 (`src/taskStorage.test.ts`) in parallel. Failure observation, implementation and completion checks still follow the listed prerequisites.

## Required Behavior Traceability

| Requirement / acceptance scenarios | Implementation tasks | Tests / executed verification tasks |
|-----------------------------------|----------------------|-------------------------------------|
| FR-001 add; US1 scenario 1 | T012–T013 | T010–T011, T015, T034 |
| FR-002 reject blank/whitespace unchanged with feedback; US1 scenario 2; SC-002 | T006, T012–T013 | T004, T010–T011, T015, T034 |
| FR-003 view titles/states; US1 scenario 3 | T013–T014, T019 | T011, T015, T017, T020 |
| FR-004 one-way completion; US2 scenario 1 | T018–T019 | T016–T017, T020, T034 |
| FR-005 retain visible completed until confirmed delete; US2 scenario 2; SC-003 | T019, T024, T030 | T017, T021–T022, T028, T020, T025, T031, T034 |
| FR-006 request/confirm/cancel delete only target; US3 scenarios 1–3; SC-004 | T029–T030 | T027–T028, T031, T034 |
| FR-007 refresh/reopen retains titles/state and deletion outcomes; US4 scenarios 1–3; SC-005 | T007, T013, T019, T024, T030 | T005, T017, T021–T022, T028, T020, T025, T031, T034 |
| FR-008 invalid saved data/load failure reported without overwrite | T006–T007, T013, T023–T024 | T004–T005, T021–T022, T008, T025, T033 |
| FR-009 failed save reported without false success/overwrite | T007, T013, T019, T023–T024, T030 | T005, T011, T017, T021–T022, T028, T015, T020, T025, T031, T033 |
| FR-010 no login/sharing/collaboration; US1 scenario 4 | T001, T013, T032 | T011, T015, T034–T035 |
| SC-001 add/find within 30 seconds | T013–T014 | T015, T034 |
| Accessible UI and plain-text title contract | T013–T014, T019, T030 | T011, T017, T028, T032, T034 |
| Start/test/build instructions and recorded core-flow evidence | T001–T003, T009, T026, T035 | T008, T015, T020, T025, T031, T033–T035 |

Every required behavior has implementation plus verification coverage. Adapter safety is foundational because saving unsafely even during an MVP would violate the constitution. Final manual checks do not replace the automated failure matrix.

## Implementation Strategy

### MVP First

Complete T001–T015 and demonstrate US1: no-login add/view, visible completion states from stored data, title validation, and safe durable add. Run its checks before calling the increment complete. Do not claim completion actions, deletion, or full acceptance coverage until their later phases pass.

### Incremental Delivery

Add US2 and verify it; strengthen US4 restoration/errors; add US3 and close US4 deletion subscenarios; then run final full suite, type-checked build and actual browser checks. Preserve previously passing tests at every checkpoint. Do not commit or push automatically.

### Start and Test

After T001 creates the manifest/lockfile and T002 configures tooling, run from the repository root:

```bash
npm ci
npm test
npm run build
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173`. Use the same origin/port/browser profile and one active app instance for persistence checks; keep the server available when reopening. `npm ci` installs from the lockfile, not scaffolding. Do not clear site data between reopen checks. Browser/site-data deletion, concurrent-tab synchronization and cross-device access are not supported scope. Use only isolated test storage for destructive/corruption testing.
