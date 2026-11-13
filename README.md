# Tic-Tac-Toe

A local two-player Tic-Tac-Toe game with a comedic subtitle narrator. Built with React, Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

Local two-player gameplay is implemented, with session scores, winning-cell highlights, and separate controls for starting another round or resetting the session. The CRT scene and narrator are still to come.

## Run locally

Use Node.js 22.6 or newer and npm. Tests use Node's built-in TypeScript stripping, without a separate test dependency.

```sh
npm install
npm run dev
```

Open http://localhost:3000. On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

## Project structure

- `src/app`: App Router page, root layout, and global styles.
- `src/components/ui`: shared shadcn/ui controls.
- `src/components/game.tsx`: interactive game board, scores, and controls.
- `src/lib/game.ts`: pure game rules and session reducer.
- `tests/game.test.ts`: game-rule tests, including all reachable board states.

The game uses a React reducer without a backend or persistent storage. Reloading clears scores and starts a fresh session. Narration will use local dialogue data; scenery will use CSS perspective and depth effects. Final fonts and narrator dialogue are pending review.
