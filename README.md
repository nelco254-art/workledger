# WorkLedger

WorkLedger is a local-first React workspace for organizing client relationships, tasks, deadlines, and payments. It requires no external services or private credentials.

## Features

- Overview with live client, task, and payment metrics
- Chronologically ordered upcoming deadlines
- Searchable, filterable, and sortable client directory
- Task board grouped by To do, In progress, and Done
- Task search and priority filtering
- Task completion and reopening controls
- Persistent task-status updates
- Received, outstanding, and overdue payment summaries
- Payment status filtering
- Comfortable and compact layouts
- Persistent layout preference
- URL navigation with browser Back and Forward support
- Keyboard-accessible controls and live announcements
- Automated component, hook, navigation, and persistence tests

## Technology

- React
- TypeScript
- Vite
- Oxlint
- Vitest
- Testing Library
- jsdom
- npm with one `package-lock.json`

## Requirements

WorkLedger requires Node.js 20 and npm 10 or a compatible npm release.

Check versions with `node --version` and `npm --version`.

## Installation

Install the exact dependency versions recorded in the lockfile with `npm ci`.

## Development

Start the application with `npm run dev`, then open the local URL shown by Vite, normally `http://localhost:5173/`.

## Commands

- `npm run dev` starts the development server.
- `npm run build` performs TypeScript and production builds.
- `npm run lint` checks the source with Oxlint.
- `npm test` runs the complete test suite once.
- `npm run test:watch` runs Vitest in watch mode.
- `npm run check` runs lint, the production build, and the complete test suite.

## Data and persistence

Initial fictional records are defined in `src/data.ts`. WorkLedger does not call an external API.

The browser stores only:

- `workledger:compact-mode`
- `workledger:tasks`

Clearing the browser’s site data restores the original tasks and comfortable layout.

## Project structure

- `src/components/` contains workspace sections and component tests.
- `src/hooks/` contains navigation and persistence hooks with tests.
- `src/test/` contains shared Vitest setup.
- `src/App.tsx` coordinates the application shell and sections.
- `src/App.css` contains presentation and responsive styles.
- `src/data.ts` contains fictional workspace records.
- `src/types.ts` contains shared domain types.
- `src/main.tsx` is the React entry point.

## Testing

The suite covers overview metrics, deadline ordering, navigation, client filtering and sorting, task filtering and updates, payment totals, layout controls, and local persistence.

Run all tests with `npm test`.

## Accessibility

WorkLedger uses semantic navigation, headings, buttons, form labels, tables, skip navigation, visible keyboard focus, status text, and live announcements.