# Feature Specification: Right-Aligned Task Status

**Feature Branch**: `feat/003-right-align-task-status`

**Created**: 2026-11-13

**Status**: Draft

**Input**: User description: "update complete/incomplete status position align right, not under the task title"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See task status at the right edge (Priority: P1)

As a person scanning my task list, I want each task's existing Complete or Incomplete status aligned at the right side of its row, rather than below the title, so that I can scan status consistently without moving it beneath the title.

**Why this priority**: Status is already shown for every task; predictable right alignment supports quick scanning while keeping the title and action positions unchanged.

**Independent Test**: View incomplete and completed rows with short, wrapping, and long unbroken titles at desktop and narrow supported widths; verify the existing status label stays right-aligned beside the title without overlap, and the full title remains visible using the existing wrapping behavior.

**Acceptance Scenarios**:

1. **Given** an incomplete task is visible, **When** I inspect its row, **Then** its existing “Incomplete” status appears at the right side of that row, not below its title.
2. **Given** a completed task is visible, **When** I inspect its row, **Then** its existing “Complete” status appears at the right side of that row, not below its title.
3. **Given** a task title wraps or the viewport is narrow, **When** I inspect the row, **Then** the status remains aligned at the row's right side and does not move underneath the title.
4. **Given** a task row has action icons to the left of its title, **When** I inspect the row, **Then** the existing actions remain to the left of the title while status remains at the right side.

### Edge Cases

- Long titles, including unbroken titles, may wrap at available character boundaries using the existing wrapping behavior, but must not push the status below the title or obscure it; title content remains fully visible.
- Both completion states retain their existing status words and visual distinction.
- Narrow viewport layout retains the existing 320px minimum width while keeping status at the right edge.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each task row MUST show its existing completion status at the right side of the row.
- **FR-002**: The completion status MUST NOT be positioned underneath the task title.
- **FR-003**: Incomplete and completed tasks MUST retain the existing status labels “Incomplete” and “Complete,” respectively.
- **FR-004**: Status alignment MUST remain at the right side of the row for wrapped titles, including unbroken titles wrapped at available character boundaries using the existing behavior, and at the supported narrow viewport width; the full title MUST remain visible.
- **FR-005**: Changing status placement MUST preserve existing task actions, including their position to the left of the task title, and MUST NOT change task state or persistence behavior.

### Key Entities *(include if feature involves data)*

- **Task**: Existing personal task with title and completion state; this feature changes only the placement of its displayed status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of displayed incomplete and completed task rows, the existing status label is visually aligned with the row's right edge and is not beneath the title.
- **SC-002**: At the 320px minimum viewport, with long titles (including unbroken titles wrapped at available character boundaries), 100% of task rows retain the full title and visible, non-overlapping status at the right side.
- **SC-003**: Existing task action availability, action placement, completion and deletion outcomes remain unchanged in all exercised status-layout scenarios.

## Assumptions

- “Complete/incomplete status” refers to the existing textual “Complete” and “Incomplete” labels, not a new icon or status control.
- “Align right” means align the status to the right edge of its task row at both desktop and narrow supported viewport widths.
- “Not under the task title” means the status must not occupy a line below the title; it remains in a separate right-side area even when titles wrap.
- At narrow widths, including 320px, an unbroken long title may wrap at available character boundaries using the existing wrapping behavior. Do not truncate or hide the title, status, or action buttons.
- Task data, status wording, status colors, action buttons, tooltip behavior, and persistence remain unchanged.
