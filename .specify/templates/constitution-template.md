# [PROJECT_NAME] Constitution

## Core Principles

### I. Simple, Readable, Bounded Implementation

Implementations MUST use the simplest readable approach that satisfies approved requirements. Added complexity MUST be justified by a specific approved requirement.

### II. Requirements and Technology Choices Are Separate

Specifications MUST express user needs and observable outcomes without requiring a particular technology. Implementation plans MUST record technology choices separately from requirements, with rationale and alternatives.

### III. Validated Input

Every user-provided value MUST be checked against its documented constraints before it is accepted or used. Invalid values MUST be rejected without changing valid task data, and the user MUST receive actionable feedback.

### IV. Safe Saved Data

Saved task data MUST be treated as untrusted when read. Invalid input and failed saves MUST NOT overwrite the last known-good saved state, and load or save failures MUST be reported without claiming success.

### V. Core Flow Verification

Every core user flow identified in a feature specification MUST have an acceptance scenario and at least one executable automated test or repeatable manual verification. Before work is reported complete, each required verification MUST be run and pass, with its result recorded.

## Additional Constraints

The product scope is a small personal Task Tracker web app. Features MUST directly support an approved task-tracking requirement; unrelated product features are out of scope unless the project owner explicitly approves a scope change.

## Development Workflow

AI MAY propose implementation and technology options. Before implementation begins, the project owner MUST review and approve proposed technology decisions. Specifications and plans MUST make requirements, proposed choices, and accepted decisions distinguishable. Completion reports MUST state which core-flow verifications were run and their results.

## Governance

The constitution is the project authority for enduring principles and supersedes conflicting guidance. The project owner may amend it by reviewing and approving a proposed change; amendments MUST update affected templates and guidance in the same change. Each amendment MUST record its impact in the Sync Impact Report at the top of the constitution. Reviewers MUST check proposed work and completion evidence against these principles; unresolved conflicts MUST be addressed before implementation or completion.

Use semantic versioning for this constitution: increment MAJOR for a backward-incompatible change to a principle or project-wide policy, MINOR for a new or materially expanded principle or section, and PATCH for clarifications and other non-semantic edits. Record the amendment date using ISO format.

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
