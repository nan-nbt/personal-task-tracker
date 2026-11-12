# Implementation Plan: [FEATURE]

**Branch**: `feat/feature-name or fix/bug-name` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/<branch-path>/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

### Technology Decisions

For each technology choice, label it **Proposed** or **Approved**. Record its rationale and alternatives; do not treat a proposal as approved until the project owner reviews it.

| Area | Choice | Status (Proposed/Approved) | Rationale | Alternatives considered |
|------|--------|----------------------------|-----------|-------------------------|
| [Area] | [Choice] | [Status] | [Rationale] | [Alternatives] |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] **Simple, readable, bounded implementation**: Proposed complexity is necessary for approved requirements; every added complexity has a specific justification.
- [ ] **Requirements and technology choices are separate**: Requirements are implementation-neutral; technology choices and their rationale are documented separately and marked Proposed or Approved after project-owner review.
- [ ] **Validated input**: Each input has documented constraints, rejection behavior, and user feedback for invalid values.
- [ ] **Safe saved data**: Saved data is treated as untrusted; invalid input or failed saves cannot overwrite the last known-good state, and failures are surfaced.
- [ ] **Core flow verification**: Each core user flow has an acceptance scenario and a planned automated test or repeatable manual verification; the results will be run and recorded before completion.
- [ ] **Bounded product scope**: Each proposed feature supports an approved task-tracking requirement; unrelated features are excluded or explicitly approved as a scope change.

Record any violation, its concrete justification, and the simpler alternative considered in Complexity Tracking. Re-check every item after Phase 1 design.

## Project Structure

### Documentation (this feature)

```text
specs/<branch-path>/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
