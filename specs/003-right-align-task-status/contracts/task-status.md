# UI Contract: Right-Aligned Task Status

This app exposes a user interface, not a network API. The three-column CSS-only layout and narrower mobile gap were approved by the owner on 2026-11-13. See [the specification](../spec.md) and [research](../research.md).

## Layout requirements (verbatim)

- **FR-001**: Each task row MUST show its existing completion status at the right side of the row.
- **FR-002**: The completion status MUST NOT be positioned underneath the task title.
- **FR-004**: Status alignment MUST remain at the right side of the row for wrapped titles and at the supported narrow viewport width.

## Presentation

Existing `.task-actions`, `.task-title`, and `.task-status` elements keep their DOM order. Their visual columns are actions, wrapping title, status; all occupy the same grid row. The status text's right edge aligns to the task row's inner content edge, respecting existing row padding. With a multiline title, status stays beside that title, never in a following row. Preserve existing desktop-centered and narrow-screen top alignment.

Use the existing grid with `auto minmax(0, 1fr) max-content` columns. Actions occupy column 1/row 1 without a two-row span; title occupies column 2/row 1; status occupies column 3/row 1 with `justify-self: end` and existing no-wrap text. The existing 480px media rule keeps these placements, reduces the column gap to `0.25rem`, and retains existing title wrapping. Long unbroken titles wrap at available character boundaries using existing behavior; the complete title must remain visible. Both labels remain readable and non-overlapping at 320px. No shortened status, hidden action, title truncation, color change or new control is allowed.

## Existing behavior

Status remains plain text derived from `task.completed`: “Complete” or “Incomplete.” Completed-title styling, icon availability, tooltip interaction, accessible action names, keyboard focus, confirmation, task identity/order and persistence are unchanged. Resize/reflow performs no writes or task mutations. See [data-model.md](../data-model.md).

## Acceptance mapping

| Coverage | Verification |
|----------|--------------|
| US1 scenarios 1–2; FR-001–003; SC-001 | Browser: both labels at row's right inner edge, beside title |
| US1 scenario 3; FR-004; SC-002 | Browser: 320px and desktop with wrapping/unbroken long titles; no overlap/clipping |
| US1 scenario 4; FR-005; SC-003 | Browser action placement and existing automated task/action regressions |

Commands, test fixtures and evidence recording are in [quickstart.md](../quickstart.md). DOM order assertions do not prove visual placement.
