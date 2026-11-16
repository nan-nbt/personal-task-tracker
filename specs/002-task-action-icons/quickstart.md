# Quickstart and Validation Guide: Task Action Icons

## Prerequisites and scope

This feature extends the existing standalone React/TypeScript/Vite personal task app. Use the existing Node.js 22.12+ and npm prerequisite from the project plan, a current browser, and a separate test profile/origin for manual validation. No new dependency, storage format, or app setup is introduced.

The changed feature is presentation and interaction only: small icon buttons and explanatory tips, to the left of each task title. Existing localStorage (`task-tracker.tasks`), one-way completion, native deletion confirmation, save failure behavior, and task state are unchanged. See [data-model.md](data-model.md) and [contracts/task-actions.md](contracts/task-actions.md).

## Automated checks (run after implementation)

From repository root:

```bash
npm test
npm run build
```

Do not install packages for this feature. Use the existing Vitest and Testing Library setup.

| Coverage | Automated scenario | Expected result |
|----------|--------------------|-----------------|
| Incomplete actions; FR-001/002/007 | Render incomplete and completed rows; query buttons by task-specific accessible names | Incomplete row exposes completion and delete; completed row exposes delete only |
| SC-001 recognition | In a moderated check, show five participants three incomplete task rows one at a time; ask each participant to identify (not activate) completion and deletion after viewing the icon and hover tip | All five identify both actions for every row with zero accidental activations; record participant count and outcomes without collecting personal data |
| Icon-only semantics; FR-005 | Inspect accessible names, buttons, and SVG accessibility attributes | Native buttons are named per action/task; SVGs are decorative and not separately announced |
| Hover/focus tips; FR-003/004 | `userEvent.hover`, `unhover`, keyboard `tab`, and `tab` away | Correct tip becomes available on hover/focus and hides when neither remains active |
| Tooltip association and focus | Inspect `aria-describedby` and unique IDs on simultaneous task actions | Each available tip describes its own button; ID relationships are unique and valid |
| Escape and hover transfer | Hover then press Escape; focus then press Escape; move pointer between button and tip; exit region | Escape hides without invoking action and stays dismissed until region exit; no dead-gap close |
| Keyboard operation | Tab to an action and activate using Enter/Space | Existing completion/delete handler runs only once; normal browser button behavior retained |
| Left-of-title relationship; FR-006 | Assert action container precedes title in accessible row DOM; verify completed and incomplete variants | Actions precede and remain associated with the correct task; completed action omission is respected |
| Existing task-state safety; FR-008 | Keep regression checks for failed completion/delete save, native confirm cancel/confirm, duplicate titles and remount | No false state change; saved bytes and list retained on failure/cancel; correct ID only is changed |

jsdom can test DOM structure, accessible roles/names/descriptions, event/state-driven tooltip visibility and task outcomes. It does **not** render or prove CSS grid placement, pointer hit testing, focus outline visibility, title wrapping, tooltip positioning, clipping, color contrast, or icon recognizability. Do not treat DOM-only test results as visual/browser evidence.

## Repeatable browser checks (run after implementation)

Use the existing installed dependencies. For a fresh checkout without dependencies, follow the locked `npm ci` setup in [the base quickstart](../001-personal-task-tracker/quickstart.md); this feature requires no additional packages. Start the existing dev script from the repository root:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173` in a fresh isolated browser profile. Keep the same origin during the run; the strict port prevents silently selecting a different storage origin.

1. With an incomplete task visible, verify its completion and delete icons are recognizable and completed tasks have delete only. Record icon recognition and action availability here; verify the icons' position relative to titles only in scenario 8 and task T011 after the layout work.
2. Hover each icon. Verify its short tip identifies the correct task action, is readable, is not clipped, and does not block the button.
3. Move the pointer from a button onto its tip. Verify the tip remains available without a gap. Move out of the action region and verify it closes.
4. Tab to each available icon. Verify visible keyboard focus and the matching tip. Move pointer away while focused; verify tip remains. Blur while pointer remains over the action; verify it remains.
5. With pointer hover and then with keyboard focus, press Escape. Verify tip hides and no action occurs; verify it does not reopen until both pointer and focus leave the action region.
6. Activate completion by keyboard. Verify only the selected task becomes complete, remains visible, and has no completion button. Refresh the same origin and verify the completed state remains.
7. Activate delete by keyboard on a task; cancel native confirmation, and verify no task changes. Repeat and confirm; verify only that task disappears. Include a completed task deletion check.
8. At 320px viewport width, test a very long title and mixed complete/incomplete rows. Verify actions stay to the left of their title, labels wrap without overlap or horizontal clipping, tooltips remain readable, and action controls stay reachable.
9. Use browser accessibility inspection or assistive technology as available to verify each action is named by action plus title, the icon art is ignored, and tips are related without duplicated/contradictory announcements.
10. For failed-save acceptance, run the automated UI cases that seed a valid snapshot and mock `Storage.prototype.setItem` to throw without writing for completion and confirmed deletion. Verify unchanged displayed state and raw saved bytes, plus the visible error. No real-browser storage corruption is needed.

Use browser developer tools to inspect visual positioning, not to clear or overwrite a user's storage. Confirm deletion/cancel and save-failure regression behavior using the automated suite as well.

## Evidence to record

At implementation completion record the actual commands and outcomes, browser and viewport, observed hover/focus/Escape and transfer results, the 320px/wrapping result, and accessible-name/description checks. Mark browser checks unrun rather than infer success from jsdom.

| Check | Result | Evidence |
|-------|--------|----------|
| Baseline `npm test` | PASS, 62 tests | `npm test`, before implementation changes. |
| Baseline `npm run build` | PASS | `tsc -b && vite build`, before implementation changes. |
| Feature focused UI tests | PASS, 17 tests | `npm test -- src/App.test.tsx`, after implementation changes. |
| Feature full test suite | PASS, 64 tests | User reported `npm test` succeeded after the final implementation/CSS adjustment; output not captured in this session. |
| Feature production build | PASS | User reported `npm run build` succeeded after the final implementation/CSS adjustment; output not captured in this session. |
| Browser interaction and 320px layout | Not run; no browser binary or automation setup available in this environment | Run scenarios 1–9 manually in a browser and record browser/version and viewport outcomes. |
| SC-001 five-participant recognition check | Not run | Conduct the moderated check and record aggregate outcomes only; collect no personal data. |
