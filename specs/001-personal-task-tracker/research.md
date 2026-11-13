# Research: Personal Task Tracker

**Date**: 2026-11-13 | **Specification**: [spec.md](spec.md)

## Decision status and resolved questions

The project owner explicitly selected React, TypeScript, Vite, Vitest with React Testing Library, browser localStorage, and single-browser standalone use in the planning request. The owner selected **one-way completion** in the planning clarification: completed tasks cannot be marked incomplete. These decisions resolve the three open decisions recorded in the original specification; that document is retained unchanged as the historical requirements input. No NEEDS CLARIFICATION items remain.

Supporting design choices below are proposals, not additional product requirements. Before implementation, the owner must review the proposed design choices in [plan.md](plan.md). Research used the current constitution and specification plus a read-only planner consultation; no dependencies were installed and no runtime experiments were performed.

## 1. Standalone browser application

- **Decision**: Approved React with TypeScript built by Vite; proposed compatible stable versions selected and locked when scaffolding. Use a single screen, React state, native HTML controls, and plain CSS.
- **Rationale**: Covers FR-001–FR-010 without server infrastructure. TypeScript supports readable entity and result types; React handles rendering and form interactions.
- **Alternatives considered**: Plain JavaScript would be smaller but conflicts with the selected stack. Company G2FW, routing, global state libraries, login, a backend, and cross-device synchronization have no requirement and are excluded. Guidance in `docs/` does not override this explicitly standalone choice.

## 2. Versioned localStorage snapshot

- **Decision**: Approved localStorage; proposed one app-owned key `task-tracker.tasks` containing `{ "version": 1, "tasks": [...] }`. Read once on initialization. Missing key means a genuinely new empty list. Present data must pass whole-payload validation.
- **Rationale**: Same-origin, same-browser storage survives refresh and ordinary browser close/reopen (FR-007). A version field detects unsupported formats without speculative migration logic.
- **Alternatives considered**: IndexedDB adds unnecessary asynchronous complexity. A remote database adds a backend and cross-device scope. Session storage does not satisfy close/reopen persistence. No backup, migrations, or data export are proposed.
- **Limits**: Same browser profile and exact origin, including port, are required. Clearing site data or private browsing policies may remove data; there is no external backup. Concurrent tabs and external storage changes are outside this single-active-instance design.

## 3. Failure-safe writes and reads

- **Decision**: Proposed synchronous adapter with explicit success/error results. Catch storage access, JSON parsing, validation, serialization, and write failures. A load error shows a blocking notice and disables mutations; it never substitutes an empty list or writes data. Allow retry by reloading after the underlying problem is resolved; do not offer automatic reset or repair.
- **Rationale**: FR-008 and constitution IV prohibit overwriting data that failed to load. Reject the entire payload if any task is invalid; do not silently drop damaged records.
- **Alternatives considered**: Empty-list fallback or partial salvage risks hiding or overwriting data. A repair/reset UI introduces destructive behavior not requested.
- **Decision**: Build and validate a candidate list, serialize, call `setItem`, and only then commit React task state. Failed saves retain the prior displayed and saved snapshot, retain an add form's draft, and show actionable failure feedback. A later successful operation clears the save error.
- **Rationale**: FR-009 requires failures not to claim success. A single-key localStorage write provides an atomic replacement on success and leaves the previous value untouched on a failed write; do not remove the key first or attempt a cleanup write.
- **Alternatives considered**: Optimistic UI adds rollback logic. Autosave effects risk persisting an initial empty list. Writing inside React updater functions risks repeated side effects. Use explicit event-handler transactions instead, with pure candidate transformations.

## 4. Minimal input and interaction semantics

- **Decision**: Proposed title validation checks `title.trim().length > 0` but stores the original valid string. Add no title length limit, deduplication, or character filter. Render text through React, never HTML injection.
- **Rationale**: FR-002 and the specification's assumptions require rejection of blank/whitespace-only titles and specify no other restrictions. Preserve meaningful input instead of silently changing it.
- **Alternatives considered**: Trimming valid titles or imposing a maximum introduces unrequested constraints. Treat storage quota failures as save failures rather than arbitrary input limits.
- **Decision**: Approved one-way completion. Proposed native `window.confirm` before deleting either an incomplete or completed task. Identify the target by generated stable ID, not title or position.
- **Rationale**: FR-004–FR-006; duplicate titles are allowed, and cancellation must have no mutation or storage side effect.
- **Alternatives considered**: Reversible checkboxes introduce unapproved reversal. A custom modal adds focus-management complexity without an additional requirement.

## 5. Verification strategy

- **Decision**: Approved Vitest with React Testing Library; proposed jsdom, jest-dom, and user-event as supporting test dependencies. Co-locate model, storage, and UI tests. Use accessible role/label queries and observable behavior rather than React internals.
- **Rationale**: Model tests cover title and payload validation; adapter tests cover failed access/writes and unchanged raw snapshots; UI tests cover add/view/complete/confirm/cancel and remount persistence. Reset mocks and storage between tests. Under React StrictMode verify that mounting, including load failure, never writes.
- **Alternatives considered**: Snapshots alone do not prove core behavior. A new browser automation framework is unnecessary: a repeatable real-browser refresh/reopen check covers actual browser persistence while Vitest provides executable regression coverage.
- **Evidence plan**: Map every acceptance scenario and SC-001–SC-005 in [quickstart.md](quickstart.md). No application tests can run during planning because no application or package manifest exists yet. Record actual results after implementation, not fabricated planning-time passes.
