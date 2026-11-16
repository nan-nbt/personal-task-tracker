# Feature Specification: Task Action Icons

**Feature Branch**: `feat/002-task-action-icons`

**Created**: 2026-11-13

**Status**: Draft

**Input**: User description: "update to implement set mark as complete and delete buttons using icons with tips (hover) and set the actions button in the leftside from title."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognize task actions (Priority: P1)

As a person managing my task list, I want compact icon buttons for completing and deleting tasks, with hover tips that explain each action, so that I can identify available actions without oversized text buttons.

**Why this priority**: Completing and deleting tasks are existing primary list actions; making their purpose clear while keeping the list compact directly supports those flows.

**Independent Test**: View an incomplete task and verify that its completion and deletion actions appear as recognizable icons with explanatory tips on hover.

**Acceptance Scenarios**:

1. **Given** an incomplete task is visible, **When** I hover over its completion icon, **Then** a tip explains that it marks that task complete.
2. **Given** a task is visible, **When** I hover over its delete icon, **Then** a tip explains that it deletes that task.
3. **Given** I use assistive technology or keyboard navigation, **When** I focus either icon button, **Then** its action has an accessible name and the action is operable without a pointer.
4. **Given** a completed task is visible, **When** I inspect its actions, **Then** no completion action is offered and its delete action remains available.
5. **Given** either icon button has keyboard focus, **When** I inspect it, **Then** its explanatory tip and visible focus indication are shown.
6. **Given** an incomplete task is visible, **When** I activate its completion icon and the change is saved successfully, **Then** only that task becomes complete and remains visible after refresh.
7. **Given** an incomplete or completed task is visible, **When** I activate its delete icon, **Then** confirmation is required; confirming removes only that task and cancelling leaves it unchanged.
8. **Given** a task change cannot be saved, **When** I activate an icon action and authorize any required confirmation, **Then** the failure is reported without claiming success or changing the last known-good saved tasks.

---

### User Story 2 - Find actions beside the task title (Priority: P1)

As a person scanning my task list, I want each task's action buttons positioned to the left of its title, so that actions are consistently located and quick to reach.

**Why this priority**: A predictable location makes the actions easier to find during routine task management.

**Independent Test**: View tasks of different completion states and verify the action area appears on the left side of each title at supported screen sizes.

**Acceptance Scenarios**:

1. **Given** one or more tasks are visible, **When** I scan a task row, **Then** its action buttons are positioned to the left of its title.
2. **Given** a task title wraps onto multiple lines or the screen is narrow, **When** I view the row, **Then** the action buttons remain visually associated with that task and precede its title.

### Edge Cases

- Tips remain available when a button receives keyboard focus, not only pointer hover.
- Icon-only buttons expose meaningful accessible names and visible keyboard focus.
- Completed tasks do not display a completion action, consistent with one-way completion.
- Long or wrapping task titles do not obscure or detach their actions.
- Existing completion and confirmed-deletion behavior remains unchanged when invoked through the new icon buttons.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each incomplete task MUST provide an icon button that marks that task complete using the existing one-way completion behavior.
- **FR-002**: Each task MUST provide an icon button that requests deletion using the existing deletion confirmation behavior.
- **FR-003**: The completion icon button MUST provide a concise explanatory tip on hover and keyboard focus.
- **FR-004**: The delete icon button MUST provide a concise explanatory tip on hover and keyboard focus.
- **FR-005**: Each icon-only action MUST expose an accessible name that identifies the action and the affected task, and MUST be operable by keyboard.
- **FR-006**: The completion and delete action buttons MUST be positioned to the left of their task title.
- **FR-007**: A completed task MUST NOT offer a completion action, but MUST continue to offer deletion.
- **FR-008**: Changing action presentation or placement MUST preserve existing task state, save-failure reporting, and delete-confirm/cancel behavior.

### Key Entities *(include if feature involves data)*

- **Task**: Existing personal task with a title and completion state; this feature changes how its available actions are presented, not its data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a moderated usability check with five participants, all five identify both the completion and delete action for each of three displayed incomplete tasks after viewing its icon and hover tip, without accidentally activating either action.
- **SC-002**: In 100% of displayed task rows, the available action buttons appear to the left of the corresponding task title.
- **SC-003**: Every icon-only action is reachable and operable by keyboard and has an accessible name identifying its action and task.
- **SC-004**: Existing task completion and deletion outcomes remain unchanged in all exercised scenarios, including cancelled deletion and failed save.

## Assumptions

- “Tips (hover)” means short tooltips shown on pointer hover and keyboard focus; exact wording and icon artwork may follow the existing visual style.
- The requested position is interpreted per task row: the actions appear immediately to the left of that task's title, not in a separate page-level sidebar.
- Existing one-way completion, delete confirmation, persistence, error handling, and task-list behavior remain in scope and are not redesigned.
