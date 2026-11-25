# Personal Task Tracker

A small client-side web application for managing personal tasks. Add tasks, mark them complete, and delete them. Tasks are stored in the browser's local storage; no backend or account is required.

## Features

- Create tasks with non-empty titles.
- Mark incomplete tasks as complete.
- Delete tasks after confirmation.
- Keep task data between visits using browser local storage.
- Show task status alongside the title, including on narrow screens.
- Validate saved task data and report storage errors without silently overwriting invalid data.

## Requirements

- Node.js 22.12.0 or newer (see the `engines` field in `package.json`).
- npm.

## Getting Started

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm test` | Run the test suite once with Vitest. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for preview. |

To build and preview the app:

```sh
npm run build
npm run preview
```

## Data Storage

The app stores tasks in the browser's `localStorage` under `task-tracker.tasks`. The stored snapshot uses version `1` and contains each task's ID, title, and completion state. Data is local to the browser profile and is not synchronized across browsers or devices. Clearing site data in the browser removes saved tasks.

## Technology

- React 19 and TypeScript
- Vite 8
- Vitest, Testing Library, and jsdom for tests

## Project Structure

- `src/App.tsx` — application interface and task interactions
- `src/tasks.ts` — task validation and state transitions
- `src/taskStorage.ts` — local storage loading and saving
- `src/styles.css` — responsive application styling
- `docs/` — project planning and development reference documents
