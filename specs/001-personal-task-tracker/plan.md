# Implementation Plan: Personal Task Tracker

**Branch**: `feat/001-personal-task-tracker` | **Date**: 2026-11-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-personal-task-tracker/spec.md`, the owner's standalone-stack planning request, and the owner's one-way completion clarification.

## Summary

Build one personal task-list screen: add a nonblank title, view all tasks and their completion state, mark incomplete tasks complete, and delete only after confirmation. Retain completed tasks and persist successful changes across refresh and close/reopen in the same browser. Use React/TypeScript with Vite, Vitest/React Testing Library, and localStorage. No login, backend, G2FW, sharing, routing, or unrelated task features.

The owner has resolved the specification's open decisions: one-way completion, no cross-device requirement, and browser localStorage. The original specification is not rewritten by this planning command. Supporting design choices remain explicitly Proposed until owner review. This command generates design artifacts only, not implementation or `tasks.md`.

## Technical Context

**Language/Version**: TypeScript with strict type checking; compatible stable dependency versions chosen and lockfile recorded during scaffolding, not invented during planning.

**Primary Dependencies**: React, React DOM, Vite and its React plugin. No company-stack dependencies.

**Storage**: Browser localStorage; proposed single versioned JSON snapshot at `task-tracker.tasks`.

**Testing**: Vitest and React Testing Library; proposed jsdom, jest-dom, user-event; repeatable real-browser refresh/reopen and timed usability checks.

**Target Platform**: Modern desktop/mobile browsers with localStorage and `crypto.randomUUID`, served on a stable HTTP(S) origin; one active app instance in one browser profile. Proposed Node.js 22.12+ or a newer LTS meeting selected tooling engines, with npm for tooling.

**Project Type**: Standalone client-only web app; static build output.

**Performance Goals**: SC-001: add and find a task within 30 seconds. No numeric runtime throughput or capacity target is specified; no benchmark framework is proposed.

**Constraints**: No login, sharing, backend, cross-device sync, reversal, editing, filtering, sorting, due dates, or extra task metadata. Validate all inputs and persisted data; do not overwrite on load/save failure. Persistence depends on intact site storage and the same origin. No offline application-shell or service-worker requirement is inferred.

**Scale/Scope**: One personal list and one screen; no arbitrary task-count/title-length limit. Browser storage capacity bounds persistence; quota errors are visible failures.

### Technology Decisions

| Area | Choice | Status (Proposed/Approved) | Rationale | Alternatives considered |
|------|--------|----------------------------|-----------|-------------------------|
| UI/build | React + TypeScript + Vite | Approved | Explicit owner request; standalone browser UI | Plain JS; company G2FW excluded |
| Tests | Vitest + React Testing Library | Approved | Explicit owner request; observable flow tests | Snapshot-only checks insufficient |
| Storage | Browser localStorage, single-browser scope | Approved | Explicit owner request; FR-007 | IndexedDB unnecessary; remote storage out of scope |
| Completion | One-way incomplete → complete | Approved | Owner's planning clarification | Reversal not required |
| State/modules | React state, pure task helpers, focused storage adapter | Proposed | Small readable boundaries; FR-008/FR-009 safety | Global store/repository framework unnecessary |
| Snapshot | Version 1 envelope, one key, whole-payload validation | Proposed | Detect corruption; preserve saved data | Unvalidated arrays/partial salvage unsafe |
| Save sequence | Save candidate before committing UI state | Proposed | No false success or rollback complexity | Optimistic updates and autosave effects |
| Title handling | Validate whitespace, preserve valid original string | Proposed | No other title constraints specified | Trimming, length limits, deduplication |
| Confirmation | Native `window.confirm` | Proposed | Smallest confirmation supporting FR-006 | Custom dialog adds focus-management work |
| Supporting tooling | npm lockfile; compatible stable versions; jsdom/jest-dom/user-event | Proposed | Reproducible build and interaction tests | Extra frameworks not needed |

Rationale and alternatives are expanded in [research.md](research.md). Proposed design choices require owner review before implementation under constitution Development Workflow.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Simple, readable, bounded implementation**: One screen with three focused model/storage/UI responsibilities. Versioning and explicit save transactions justify their small complexity with FR-008/FR-009.
- [x] **Requirements and technology choices are separate**: Original spec stays implementation-neutral and unchanged; owner selections and design proposals are distinguished above. Historical open decisions are resolved explicitly here, not silently selected.
- [x] **Validated input**: Title, task identity, confirmation result, task fields, snapshot version, and ID uniqueness have constraints and rejection behavior in [data-model.md](data-model.md) and [contracts/ui-and-storage.md](contracts/ui-and-storage.md).
- [x] **Safe saved data**: Whole-snapshot validation, no writes during load, mutation blocking after load error, and persist-before-commit transactions preserve the last good state and expose failures.
- [x] **Core flow verification**: All four stories and failure cases map to automated and manual checks in [quickstart.md](quickstart.md). These checks must run and actual results be recorded before implementation completion; this plan does not claim they passed.
- [x] **Bounded product scope**: All behaviors trace to FR-001–FR-010 or the owner's completion decision. No unrelated features.

**Pre-research gate**: PASS against constitution 1.0.0 using the selected bounded approach and planned safety/verification requirements. No unjustified violations.

**Post-design gate**: PASS. Data model, UI/storage contract, file responsibilities, and verification matrix preserve all six checks. The gate approves planning completeness, not execution of not-yet-written tests or approval of Proposed choices. Before implementation: owner reviews design proposals; before implementation completion: execute and record core-flow verification.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-task-tracker/
├── spec.md                       # Existing requirements; unchanged
├── plan.md                       # This plan
├── research.md                   # Decisions, rationale, alternatives
├── data-model.md                 # Task/snapshot shapes and transitions
├── quickstart.md                  # Setup and validation guide
└── contracts/
    └── ui-and-storage.md          # User-facing and persistence boundaries
```

`tasks.md` is a later `/speckit.tasks` output, not created here.

### Source Code (repository root; proposed, not yet created)

```text
package.json
package-lock.json
index.html
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
src/
├── main.tsx
├── App.tsx
├── App.test.tsx
├── styles.css
├── tasks.ts
├── tasks.test.ts
├── taskStorage.ts
├── taskStorage.test.ts
└── test/
    └── setup.ts
```

**Structure Decision**: Single Vite app at the repository root. No backend, shared package, routing layer, or speculative component hierarchy. Keep the short list/form/items in `App.tsx`; split further only if implementation readability requires it.

### File responsibilities

| File | Responsibility |
|------|----------------|
| `package.json`, lockfile | Selected dependencies and scripts: `dev`, `test` (`vitest run`), `build` (`tsc -b && vite build`), `preview`; lock resolved versions |
| `index.html`, `src/main.tsx` | HTML mount point and React root; no persistence writes |
| `vite.config.ts`, TypeScript configs | React build, strict checking, Vitest jsdom environment/setup; no company config |
| `src/tasks.ts` | Task/snapshot types; title and complete payload validation; pure add/complete/delete candidates; no React or storage side effects |
| `src/taskStorage.ts` | Key/version boundary; validated load/save result types; catch browser access/parse/serialization/write errors; never clear or repair data |
| `src/App.tsx` | Accessible title form/list/status/actions; lazy validated load; explicit persist-before-commit event handlers; deletion prompt and visible errors |
| `src/styles.css` | Small readable layout and visible completed/error states; no UI framework |
| Co-located tests, `src/test/setup.ts` | Model edge cases, storage failures, user-visible flows, storage cleanup/mocks and jest-dom setup |

## Task Persistence and Validation

1. On mount, safely obtain localStorage, read the app key and validate the entire versioned payload. Only `null` means a new empty list; invalid JSON, empty text, wrong version, duplicate IDs, malformed records, or exceptions mean a reported load error. No write occurs on mount, including StrictMode remounts.
2. Represent loading outcomes as `ready(tasks)` or `load-error(message)`. After load error, show “Saved tasks could not be loaded; no saved data was changed. Resolve the storage problem and reload.” Do not claim an empty list; disable add/complete/delete. Automatic reset/recovery is not part of this plan.
3. On an action, validate title or selected ID and allowed transition. Build an immutable candidate. Native confirmation must return true before a delete candidate exists; cancel causes no write. Validate and serialize the candidate, then synchronously call `setItem` once.
4. Only successful persistence replaces React task state and clears a submitted title. On any failure, retain previous task state and raw saved value; keep the user's draft and show “Could not save this change. Your saved tasks were not changed; check browser storage and try again.” Do not show a success result or attempt a cleanup write.
5. Persist only stable ID, original valid title, and boolean completion state in insertion order. Generate IDs with `crypto.randomUUID` and ensure uniqueness; use IDs to target actions. Duplicate titles and arbitrary nonblank text are allowed. React renders titles as text, not executable markup.

See [data-model.md](data-model.md) and [contracts/ui-and-storage.md](contracts/ui-and-storage.md) for exact constraints and observable error behavior.

## Verification and Phase 2 Handoff

Model tests cover whitespace (spaces, tabs, line breaks), valid-title preservation, IDs, allowed one-way transitions, and every invalid snapshot class. Storage tests prove no writes on read/error, complete rejection rather than partial load, single-key successful replacement, and unchanged raw storage on failed serialization/access/write. RTL tests cover every story with accessible queries, both task states for deletion confirmation/cancellation, no false successful UI on failed save, and remount restoration. A real-browser timed add plus refresh and close/reopen scenario covers SC-001 and actual FR-007 behavior.

[quickstart.md](quickstart.md) specifies expected commands and a requirements-to-check matrix. No application tests/build are runnable yet: the repository has no package manifest or source. At implementation, add the planned project checks, run tests and type-checked build, and record manual results. Phase 2 ends here with planning handoff; implementation and task decomposition are separate commands.

## Complexity Tracking

No constitution violations; no complexity exceptions or deviation log required. The standalone stack follows the owner's explicit instruction rather than unrelated company-stack guidance. Constitution and immutable specification content are unchanged.
