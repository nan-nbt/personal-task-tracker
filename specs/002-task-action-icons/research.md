# Research: Task Action Icons

**Date**: 2026-11-13
**Inputs**: Current [spec.md](spec.md), `src/App.tsx`, `src/styles.css`, `src/App.test.tsx`, `src/tasks.ts`, `src/taskStorage.ts`, `package.json`, and `vite.config.ts`; read-only design advice from the planner agent. Owner approval of the listed proposals was received on 2026-11-13, conditional on implementation remaining within the specification.

## Research outcome

No unresolved technical clarification remains. This is a presentation change on the implemented standalone app. The decisions below have owner approval for this scoped feature; no implementation code or dependencies were changed during planning.

## 1. Retain the existing application stack and boundaries

- **Decision**: Reuse the previously owner-approved React/TypeScript/Vite app, Vitest/React Testing Library tests, browser localStorage, and native deletion confirmation. Do not introduce a UI framework, backend, or new package.
- **Rationale**: `package.json` and existing source already supply all needed capabilities. Completion/delete handlers and persist-before-commit sequencing already enforce FR-008. The prior feature plan records the owner's standalone-stack choice; the generic company stack in `docs/tech-stack.md` is not a mandate to migrate this app.
- **Alternatives considered**: G2FW migration, icon packages, tooltip packages, custom deletion dialog. These add unrelated scope or dependencies without a feature requirement.
- **Status**: Existing stack Approved in the prior feature; unchanged confirmation/storage are existing behavior. No dependency-version update is proposed.

## 2. Icon-only native buttons

- **Decision**: Propose checkmark and trash-can inline SVGs in native `button type="button"` controls. Mark SVGs decorative (`aria-hidden="true"`, `focusable="false"`). Retain task-specific accessible names: `Mark {title} complete` and `Delete {title}`. Use short visible tooltip descriptions: `Mark as complete` and `Delete task`.
- **Rationale**: Native buttons retain Enter/Space activation and disabled semantics. Existing accessible names keep regression queries compatible and distinguish actions from their visual artwork. Task IDs, not titles, continue to determine mutations; duplicate titles remain allowed.
- **Alternatives considered**: Unicode glyphs vary in rendering; icon fonts/packages add assets/dependencies; unnamed icon controls fail accessibility; full visible text buttons do not satisfy the requested presentation.
- **Status**: Owner-approved for this feature on 2026-11-13.

## 3. Hover and focus tooltips

- **Decision**: Propose a small local `TaskActionButton` component in `src/App.tsx`, shared by both actions. React-managed pointer/focus/dismissal state controls an associated `role="tooltip"` element with a unique `useId` identifier and `aria-describedby`. Render tooltip text as plain text. Do not rely on the native `title` attribute.
- **Rationale**: Native title tips are not a reliable keyboard-focus explanation. React-managed visibility supports executable interaction tests and Escape dismissal without a tooltip library. A local component contains state per action rather than duplicating handlers or adding list-wide state.
- **Behavior**: Show the tip when the action is hovered or its button focused. Keep it available while the pointer moves onto the tooltip, using a continuous hover region. Escape dismisses the visible tip without activating the button. Keep it dismissed while pointer or focus remains in the region; reset dismissal once both leave. The tooltip has no interactive content and no tab stop. Leaving pointer alone does not hide a focused button's tip, and blur alone does not hide a hovered tip. Activation/unmount naturally removes a completed/deleted action's tip.
- **Alternatives considered**: CSS-only hover/focus tips are simpler but make persistent Escape dismissal harder. A third-party positioning system is excessive for two short fixed tips; native `title` alone does not meet focus behavior.
- **Status**: Owner-approved supporting accessibility design for this feature on 2026-11-13. These details do not change task lifecycle or introduce a new user flow.

## 4. Responsive left-of-title placement

- **Decision**: Propose action-group-first DOM order and grid placement with an auto-sized action column followed by a `minmax(0, 1fr)` title column. Keep completion then delete ordering for incomplete tasks and only delete for completed tasks. Place status after the title on wide screens and below the title in its own column on narrow screens. Remove the current full-width actions row and narrow-screen one-column collapse.
- **Rationale**: Current CSS explicitly places actions below the title; preserving the left action column at the existing 320px minimum width meets FR-006 even for long titles. Keep title wrapping and completed-state text. Proposed buttons have at least 32px by 32px targets and visible focus outlines. Anchor short tooltip boxes within the row and avoid clipping or pointer-breaking gaps.
- **Alternatives considered**: Moving actions above/below titles on mobile violates the requested left placement. Absolute row positioning is fragile for wrapped titles. A separate sidebar breaks task association.
- **Status**: Owner-approved layout implementation for this feature on 2026-11-13, preserving the specified relative placement.

## 5. Verification strategy

- **Decision**: Extend `src/App.test.tsx` for icon-button names, decorative SVGs, hover/focus visibility, Escape dismissal/reset, pointer transfer, keyboard activation, and action-before-title DOM order. Run the existing full suite and build after implementation. Supplement with repeatable real-browser desktop/320px/long-title checks.
- **Rationale**: Existing tests cover completion, delete confirm/cancel, duplicate-title targeting, save failure and remount restoration. jsdom can validate roles, attributes, DOM order and state-driven visibility, but cannot prove rendered grid placement, focus outlines, text wrapping, tooltip overlap or SVG recognizability. Focus and pointer movement tests must not depend on an assumed CSS layout.
- **Alternatives considered**: Snapshot-only assertions cannot demonstrate interaction behavior. Installing a browser automation framework is not necessary when the project already allows repeatable manual acceptance checks. Existing prior-feature pass reports are not evidence that this new presentation works.
- **Status**: Owner-approved verification design for this feature on 2026-11-13; checks have not yet been executed. Detailed mapping and evidence requirements are in [quickstart.md](quickstart.md).
