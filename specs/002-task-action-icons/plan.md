# Implementation Plan: Task Action Icons

**Branch**: `feat/002-task-action-icons` | **Date**: 2026-11-13 | **Spec**: [spec.md](spec.md)

**Input**: Updated feature specification from `specs/002-task-action-icons/spec.md`, reread before planning as requested. This command produces design artifacts only; it does not implement the feature or create `tasks.md`.

## Summary

Replace the existing per-task text actions with icon-only completion/delete buttons and explanatory hover/focus tips. Place the action group to the left of the title at desktop and narrow widths, preserve accessible task-specific names and native keyboard operation, and retain all existing completion, confirmation, persistence and error behavior. Reuse the implemented standalone app; propose decorative inline SVGs, a local reusable tooltip/button component, and responsive grid adjustments without new dependencies.

The specified layout is preserved verbatim:

> **FR-006**: The completion and delete action buttons MUST be positioned to the left of their task title.

Supporting technical proposals require owner review before implementation. Requirements in `spec.md` are unchanged.

## Technical Context

**Language/Version**: Existing TypeScript manifest range `^7.0.2`, strict configuration, JSX; no version change. Node.js `>=22.12.0` is already declared.

**Primary Dependencies**: Existing React/React DOM `^19.3.1`, Vite `^8.3.8` with React plugin; use current lockfile. No added UI, icon or tooltip dependency.

**Storage**: Existing browser localStorage key `task-tracker.tasks`, version 1 snapshot. No migration or persistence change.

**Testing**: Existing Vitest `^5.1.0`, React Testing Library, user-event, jest-dom, and jsdom. Extend co-located UI tests; browser validation covers layout and visual interaction limits of jsdom.

**Target Platform**: Existing modern desktop/mobile browsers supporting the app's localStorage/crypto requirements; retain the existing 320px minimum viewport width. No cross-device requirement.

**Project Type**: Existing standalone client-only web app; no backend or network interface.

**Performance Goals**: No new numeric latency, throughput or capacity target is specified. Show tips in response to hover/focus without network requests or persistence work; no benchmark or telemetry framework is introduced. SC-001–004 measure recognition, placement, accessibility and unchanged task outcomes; SC-001 uses the five-participant moderated usability check in `quickstart.md`.

**Constraints**: Native buttons, hover and keyboard-focus tips, visible focus, left-of-title placement, no completion reversal, existing native delete confirmation, persist-before-commit and unchanged save failure behavior. No app migration, new package, task editing, extra metadata, login, localization framework, or storage redesign.

**Scale/Scope**: One existing personal list and two per-task actions. No task-count or title-length cap is added. Titles wrap; completed tasks retain only delete. Tooltip state is local and transient.

### Technology Decisions

| Area | Choice | Status (Proposed/Approved) | Rationale | Alternatives considered |
|------|--------|----------------------------|-----------|-------------------------|
| App/test/storage stack | Retain current standalone React/TypeScript/Vite, Vitest/RTL and localStorage | Approved | Prior owner-approved stack already implemented | Generic company stack is not a requirement to migrate this app |
| Icon artwork | Decorative inline SVG checkmark and trash-can | Approved | Small deterministic assets; no extra package | Unicode rendering varies; icon libraries add dependencies |
| Buttons | Native non-submit buttons; preserve task-specific accessible names | Approved | Keyboard and regression-query compatibility | Unnamed/custom clickable controls violate accessibility |
| Tooltip implementation | Local `TaskActionButton` component in `App.tsx`, React visibility state, `useId`, tooltip descriptions | Approved | Shared per-action behavior; hover/focus and Escape support | Native title lacks reliable focus behavior; CSS-only tips complicate Escape suppression |
| Tooltip interaction | Hoverable continuous region, focus persistence, Escape suppression until both pointer/focus leave | Approved | Readable/dismissible hints without new task behavior | Third-party positioning unnecessary for short fixed tips |
| Row layout | Actions-first grid column; wrapping title; status below title on narrow screens | Approved | Keeps actions on the left at 320px | Mobile stacking actions above/below title contradicts placement |
| Verification | Existing full suite/build plus repeatable manual browser checks | Approved | Real-browser evidence supplements jsdom limitations | New browser-test dependency not required |

Rationale, alternatives and resolved research topics are in [research.md](research.md). On 2026-11-13, the owner explicitly approved the listed technical design proposals for implementation, contingent on keeping implementation within `spec.md`. No unresolved technical clarification remains.

## Constitution Check

*GATE: Pass before Phase 0 research and re-evaluate after Phase 1 design.*

- [x] **Simple, readable, bounded implementation**: Three existing source/test files are the intended change area. One local button component is justified by shared tooltip interaction and accessibility requirements; no new architectural layer or dependency.
- [x] **Requirements and technology choices are separate**: `spec.md` remains implementation-neutral and unchanged; proposed design and approved existing stack are distinguished above and in research. Owner approval remains required before implementation.
- [x] **Validated input**: Existing task ID/title validation remains unchanged. Buttons target stable IDs; labels/tips are text, never executable markup. Duplicate-title controls remain row-scoped.
- [x] **Safe saved data**: No tooltip event performs storage writes. Existing validated load and candidate-save-before-UI-commit behavior remain intact; load/save failures retain saved data and report errors.
- [x] **Core flow verification**: Every US1/US2 scenario maps to tests or repeatable browser validation in [quickstart.md](quickstart.md). All required checks must run and results be recorded before implementation completion; none are claimed passed here.
- [x] **Bounded product scope**: Presentation, location, accessibility and preserved task behaviors trace to FR-001–008; unrelated features are excluded.

**Pre-research gate**: PASS against constitution 1.0.0 for planning. No unjustified violation.

**Post-design gate**: PASS after evaluating data model, UI contract and validation guide. Existing validation/storage boundaries stay unchanged; no new entity or external integration. On 2026-11-13 the owner approved the proposed implementation design listed above; approval does not expand the feature scope beyond `spec.md`.

## Project Structure

### Documentation (this feature)

```text
specs/002-task-action-icons/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── contracts/task-actions.md
```

`tasks.md` is a later `/speckit.tasks` output and is not generated here.

### Source Code (repository root)

```text
src/
├── App.tsx                  # Intended change: local icon/tooltip component and actions-first markup
├── App.test.tsx             # Intended change: new interaction/semantics coverage; retain regression cases
├── styles.css              # Intended change: compact controls, tooltip positioning, responsive grid
├── tasks.ts                # Unchanged: identity, validation, immutable candidates
├── tasks.test.ts           # Unchanged: run as regressions
├── taskStorage.ts          # Unchanged: validated load/save transaction
├── taskStorage.test.ts     # Unchanged: run as regressions
├── main.tsx                # Unchanged
└── test/setup.ts           # Unchanged
```

**Structure Decision**: Keep the small shared `TaskActionButton` local to `App.tsx`; no new source folder/package is warranted. Preserve `complete`, `remove` and `persist` handlers. UI state for tooltip visibility is isolated from task state. `AGENTS.md` points to this current plan; project config/package files need no change.

### Implementation approach (for later task decomposition)

1. Add UI tests for named icon-only actions, tooltip hover/focus/Escape/reset behavior, pointer transfer, and keyboard activation while keeping regression checks.
2. Introduce local button/tooltip presentation using decorative SVGs and stable IDs. Keep existing names (`Mark {title} complete`, `Delete {title}`), existing handlers and completed-task action omission.
3. Move the action group before the title in markup. Use grid columns that keep actions to the left at 320px, allow title wrapping, and put status below the title when space is limited. Preserve visible focus and completed-state text.
4. Run the existing test/build commands and real-browser cases after the final implementation change; record actual evidence rather than treating DOM assertions as visual proof.

## Complexity Tracking

No constitution violations or exceptions. No deviation from the specified left-of-title layout. The new tooltip state is justified by keyboard-focus explanations, hover persistence and dismissal; inline icon assets avoid a dependency change. Spec and constitution are untouched.
