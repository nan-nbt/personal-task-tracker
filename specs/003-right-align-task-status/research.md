# Research: Right-Aligned Task Status

**Date**: 2026-11-13

## Outcome

Read the current specification, constitution, application markup, stylesheet, UI tests, package manifest and existing data/storage modules. A read-only planner review independently examined narrow-width layout and testing limits. All technical unknowns are resolved; no new dependency or external integration is needed.

## Layout

- **Decision**: Use the existing CSS Grid with three columns: `auto minmax(0, 1fr) max-content`. Place actions, title and status in columns 1, 2 and 3 of row 1. Remove the actions' two-row span and status's row-2 placement in both base and mobile rules. Preserve no-wrap status text and use `justify-self: end`. At the existing 480px breakpoint reduce column gap to `0.25rem`; retain existing title wrapping and minimum viewport width of 320px.
- **Rationale**: Current markup already has actions, title and status in the desired order. The defect is explicit two-row CSS placement. Reserving status width while allowing the middle track to shrink keeps labels visible without changing behavior. Preserve current vertical alignment rules (center on desktop, start on narrow screens); status remains beside rather than below the title.
- **Alternatives considered**: Absolute positioning needs fragile width reservation. Grid areas add declarations without changing the result. Moving status below title on mobile violates the specification. Truncating titles or shortening labels adds unwanted scope.
- **Status**: Owner approved the three-column CSS-only layout, narrower mobile gap, and preservation of full long/unbroken titles through existing character-boundary wrapping during this planning session on 2026-11-13. Existing vertical alignment is retained, not redesigned. Approval is not visual verification.

## Stack and boundaries

- **Decision**: Retain the implemented standalone React/TypeScript/Vite app and existing Vitest/Testing Library setup. Change only task-row layout selectors in `src/styles.css`; do not change markup, tooltip styles/interaction, task handlers, data or dependencies.
- **Rationale**: No rendering or state change is required. The existing standalone stack was previously owner-approved; the generic company stack document does not warrant migration for a row-layout change.
- **Alternatives considered**: A UI library, backend, new component or browser-test dependency adds unnecessary scope.
- **Status**: Existing approved stack retained; CSS-only approach explicitly approved by the owner in this session.

## Verification

- **Decision**: Run existing `npm test` and `npm run build` after implementation. Execute repeatable real-browser checks for both status labels with short, long and unbroken titles at desktop and 320px, plus existing action regression scenarios. Unbroken titles must wrap at available character boundaries while remaining fully visible; no truncation or hiding is allowed. Record actual results in `quickstart.md`.
- **Rationale**: Existing UI tests cover task text, action availability, DOM order, tooltip semantics and persisted transitions. jsdom cannot prove spatial layout. At 320px the title column may be very narrow; browser evidence must verify legible wrapping and absence of overlap rather than infer fit from track definitions.
- **Alternatives considered**: DOM order or stylesheet assertions alone cannot demonstrate visual placement. Installing new automation tooling is not needed for a repeatable manual acceptance check.
- **Status**: Owner approved the verification method on 2026-11-13; no checks executed in this documentation-only phase. Prior feature test success is not evidence of this layout's acceptance.

## Scope boundary

Existing tooltip gaps, hover transfer and Escape behavior belong to feature 002 and are not silently repaired here. Its outstanding manual/usability checks remain outstanding; this plan does not declare that feature complete.
