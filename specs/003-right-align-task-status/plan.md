# Implementation Plan: Right-Aligned Task Status

**Branch**: `feat/003-right-align-task-status` | **Date**: 2026-11-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-right-align-task-status/spec.md`. Setup returned an empty branch field; `git branch --show-current` confirmed the branch above.

## Summary

Move existing “Complete”/“Incomplete” text from beneath the title into a right-side area of each task row, retaining actions on the left. Implement only CSS task-row placement changes using the existing markup and behavior. Owner approved a three-column CSS-only layout and narrower mobile gap during this planning session. No new dependency, component, task state, tooltip behavior or persistence change is introduced.

The layout requirements are preserved verbatim:

- **FR-001**: Each task row MUST show its existing completion status at the right side of the row.
- **FR-002**: The completion status MUST NOT be positioned underneath the task title.
- **FR-004**: Status alignment MUST remain at the right side of the row for wrapped titles and at the supported narrow viewport width.

## Technical Context

**Language/Version**: Existing CSS and strict TypeScript (`^7.0.2` manifest range), React JSX; no version changes. Node >=22.12.0 per manifest.

**Primary Dependencies**: Existing React/React DOM `^19.3.1`, Vite `^8.3.8`; retain lockfile and current standalone architecture.

**Storage**: Existing localStorage `task-tracker.tasks`, version 1 snapshot; unchanged.

**Testing**: Existing Vitest `^5.1.0`, Testing Library, user-event, jest-dom and jsdom. Owner-approved verification: run the current suite/build and repeatable real-browser geometry checks. jsdom cannot verify spatial alignment.

**Target Platform**: Existing modern desktop/mobile browsers, minimum viewport 320px; existing mobile breakpoint 480px.

**Project Type**: Standalone client-only web app, no backend/API.

**Performance Goals**: No new latency/throughput targets. CSS reflow introduces no requests or storage work; verifiable outcomes are right alignment, non-overlap and preserved behavior (SC-001–003).

**Constraints**: Existing labels/colors, action icons, tooltip behavior, DOM order, validation and handlers remain unchanged. Status stays beside even long wrapping titles at 320px; existing character-boundary wrapping preserves the entire title. No migration to the generic stack in `docs/tech-stack.md`; the implemented standalone stack is already approved.

**Scale/Scope**: One task-row presentation change. No new title length/count limit. Preserve the existing `overflow-wrap: anywhere` behavior so even unbroken titles can wrap at 320px without truncating or hiding title content; browser checks are mandatory to establish fit.

### Technology Decisions

| Area | Choice | Status (Proposed/Approved) | Rationale | Alternatives considered |
|------|--------|----------------------------|-----------|-------------------------|
| Stack | Retain existing standalone app and packages | Approved | Existing implemented and owner-approved baseline | Framework/backend migration unrelated |
| Layout | Existing grid: `auto minmax(0, 1fr) max-content`; columns actions/title/status, all row 1; right-align status | Approved | Owner approved in this session; no DOM changes required | Absolute positioning fragile; grid areas add declarations |
| Narrow layout | Preserve three columns at 480px and below, reduce column gap to `0.25rem`, preserve title wrapping | Approved | Owner approved tighter gap; avoids status stacking | Shortened labels, hidden actions or truncation add scope |
| Vertical alignment | Retain existing desktop center and mobile start alignment | Approved | Part of preserving existing CSS behavior, not a new UX mode | Status below title contradicts spec |
| Verification | Existing full suite/build plus repeatable browser acceptance at 1024px/480px/320px | Approved | Existing tests cover behavior; browser proves geometry; owner approved this verification approach on 2026-11-13 | New automation dependency unnecessary |

Owner explicitly approved the layout and verification approach on 2026-11-13. Verification execution remains pending; record actual results before claiming completion. Research is complete with no unresolved technical unknowns; see [research.md](research.md).

## Constitution Check

*Pre-research and post-design gates evaluated against constitution 1.0.0.*

- [x] **Simple, readable, bounded implementation**: Only row layout selectors change in `src/styles.css`; no added state, abstraction, dependency or unrelated repair.
- [x] **Requirements and technology choices are separate**: Specification remains unchanged and implementation-neutral; choices and actual approval status are explicit above.
- [x] **Validated input**: No new inputs; existing title/ID validation and rejection feedback remain unchanged.
- [x] **Safe saved data**: CSS changes cannot initiate writes; validated load/save and persist-before-commit remain unchanged.
- [x] **Core flow verification**: Every scenario maps to repeatable browser checks and existing regressions in [quickstart.md](quickstart.md). Run and record required results before reporting implementation complete.
- [x] **Bounded product scope**: Changes trace to FR-001–005 only; prior feature's tooltip defects and manual/usability checks are not silently repaired or declared complete.

**Pre-research gate**: PASS for planning. **Post-design gate**: PASS for planning after reviewing model, contract and validation guide. No constitution violations or unresolved technical clarifications. Owner approval of the layout and verification approach is recorded above; actual browser and test evidence remains mandatory before completion.

## Project Structure

### Documentation (this feature)

```text
specs/003-right-align-task-status/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/task-status.md
└── checklists/requirements.md
```

`tasks.md` is generated later by `/speckit.tasks`, not here.

### Source Code (repository root)

```text
src/
├── styles.css             # Only intended implementation change: row grid and responsive placements
├── App.tsx                # Unchanged markup, labels, icons, handlers and tooltips
├── App.test.tsx           # Existing semantics, DOM-order and interaction regressions retained
├── tasks.ts               # Unchanged task identity, validation and transitions
├── tasks.test.ts          # Existing regressions
├── taskStorage.ts         # Unchanged persistence
└── taskStorage.test.ts    # Existing regressions
```

**Structure Decision**: Change `.task`, `.task-actions`, `.task-title` and `.task-status` layout rules, including their mobile overrides, in the existing stylesheet. Preserve other selectors and all source logic. Supporting docs describe unchanged entities and the UI contract; `AGENTS.md` references this plan.

### Phase 0: Research

Completed: inspected explicit row-2 placement in current CSS, existing actions/title/status DOM ordering, narrow width constraints and testing limits. Independent planner advice supports a three-column CSS-only change; decisions/rationale/alternatives are recorded in [research.md](research.md).

### Phase 1: Design and Contracts

Completed: [data-model.md](data-model.md) records unchanged Task/snapshot/lifecycle; [contracts/task-status.md](contracts/task-status.md) defines layout and preservation; [quickstart.md](quickstart.md) supplies runnable regression and browser scenarios. Agent context update points to this plan. The post-design constitution gate passes.

### Phase 2: Task-planning handoff

After review, `/speckit.tasks` should order: remaining approval/baseline checks, capture current below-title browser behavior, modify only the CSS row placements and narrow gap, run suite/build, execute geometry and preserved-action scenarios, record evidence and mark only verified tasks complete. No implementation code or `tasks.md` is generated in this phase.

## Complexity Tracking

No violations, additional complexity, or specification deviations. The current below-title CSS is the behavior explicitly requested to change; the spec's right-side layout is retained in full. Prior feature's uncommitted work remains untouched.
