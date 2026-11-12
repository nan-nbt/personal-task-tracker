<!--
Sync Impact Report
- Version change: unratified → 1.0.0 (initial ratification).
- Modified principles: none (initial ratification).
- Added principles:
  - I. Simple, Readable, Bounded Implementation
  - II. Requirements and Technology Choices Are Separate
  - III. Validated Input
  - IV. Safe Saved Data
  - V. Core Flow Verification
- Added sections: Additional Constraints; Development Workflow; populated Governance.
- Removed sections: none.
- Templates and guidance:
  - ✅ Updated `.specify/templates/plan-template.md` with a principle-by-principle Constitution Check.
  - ✅ Updated `.specify/templates/spec-template.md` to keep requirements implementation-neutral.
  - ✅ Updated `.specify/templates/tasks-template.md` to require core-flow verification.
  - ✅ Reviewed `.specify/templates/checklist-template.md`; its generic checklist structure remains compatible.
  - ✅ Updated `.specify/templates/constitution-template.md` to match the ratified principles and governance structure.
  - ⚠ `.opencode/commands/speckit.tasks.md` and `.opencode/commands/speckit.constitution.md` were aligned locally, but Git ignores both files; their edits are not included in the tracked change and require follow-up if command-level propagation must be versioned.
  - ✅ Reviewed `.opencode/commands/speckit.plan.md` and `.opencode/commands/speckit.specify.md` for principle alignment; no changes were required.
  - ⚠ `.specify/templates/commands/` does not exist; other command files under `.opencode/commands/` were searched for constitution references but not individually opened.
  - ✅ Reviewed `AGENTS.md`, `docs/index.md`, and `docs/tech-stack.md`; no updates required. Technology selections remain in `docs/tech-stack.md`.
- Removed/deprecated rule IDs: none; this constitution does not introduce rule IDs.
- Deferred: none. This is the initial ratification; the ratification date is 2026-11-12.
- Writeback: technology-specific selections belong in `docs/tech-stack.md` and feature plans, not in this constitution.
-->
# Task Tracker Constitution

## Core Principles

### I. Simple, Readable, Bounded Implementation

Implementations MUST use the simplest readable approach that satisfies approved requirements.
Added complexity MUST be justified by a specific approved requirement. This keeps the
personal task tracker easy to understand and maintain.

### II. Requirements and Technology Choices Are Separate

Specifications MUST express user needs and observable outcomes without requiring a
particular technology. Implementation plans MUST record technology choices separately
from requirements, with rationale and alternatives. This separation keeps product
needs stable when implementation choices change.

### III. Validated Input

Every user-provided value MUST be checked against its documented constraints before it
is accepted or used. Invalid values MUST be rejected without changing valid task data,
and the user MUST receive actionable feedback. This prevents bad input from producing
unreliable task state.

### IV. Safe Saved Data

Saved task data MUST be treated as untrusted when read. Invalid input and failed saves
MUST NOT overwrite the last known-good saved state, and load or save failures MUST be
reported without claiming success. This protects users from silent loss or corruption
of personal task data.

### V. Core Flow Verification

Every core user flow identified in a feature specification MUST have an acceptance
scenario and at least one executable automated test or repeatable manual verification.
Before work is reported complete, each required verification MUST be run and pass, with
its result recorded. This makes delivered behavior demonstrable against user needs.

## Additional Constraints

The product scope is a small personal Task Tracker web app. Features MUST directly
support an approved task-tracking requirement; unrelated product features are out of
scope unless the project owner explicitly approves a scope change.

## Development Workflow

AI MAY propose implementation and technology options. Before implementation begins,
the project owner MUST review and approve proposed technology decisions. Specifications
and plans MUST make requirements, proposed choices, and accepted decisions distinguishable.
Completion reports MUST state which core-flow verifications were run and their results.

## Governance

The constitution is the project authority for enduring principles and supersedes
conflicting guidance. The project owner may amend it by reviewing and approving a
proposed change; amendments MUST update affected templates and guidance in the same
change. Each amendment MUST record its impact in the Sync Impact Report at the top of
this file. Reviewers MUST check proposed work and completion evidence against these
principles; unresolved conflicts MUST be addressed before implementation or completion.

Use semantic versioning for this constitution: increment MAJOR for a backward-
incompatible change to a principle or project-wide policy, MINOR for a new or
materially expanded principle or section, and PATCH for clarifications and other
non-semantic edits. Record the amendment date using ISO format.

**Version**: 1.0.0 | **Ratified**: 2026-11-12 | **Last Amended**: 2026-11-12
