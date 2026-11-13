# Tic-Tac-Toe

A local two-player Tic-Tac-Toe game with a comedic subtitle narrator. Built with React, Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

Local two-player gameplay sits inside a CSS 3D CRT scene, with session scores, soft winning-cell highlights, and separate controls for starting another round or resetting the session. A subtitle narrator reacts to openings, blocks, and results, growing quietly exasperated across replays.

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
- `src/components/desk-scene.tsx`: decorative desk, lamp, and keyboard.
- `src/components/narration.tsx`: subtitles and the narration toggle.
- `src/lib/game.ts`: pure game rules and game reducer.
- `src/lib/session.ts`: coordinates game and narrator updates in one React reducer.
- `src/lib/narrator.ts` and `src/lib/dialogue.ts`: narrator memory, line selection, and typed dialogue data.
- `tests/game.test.ts`: game-rule tests, including all reachable board states.
- `tests/narrator.test.ts`: narration priority, replay variation, mute/resume, and reset tests.

The game uses a React reducer without a backend or persistent storage. Reloading clears scores and starts a fresh session. Muting narration hides captions while scores and opening memory continue updating. Next round preserves that history; Reset session clears it and keeps the narration toggle setting. Captions replace one another immediately and never delay moves.

The scenery uses HTML/CSS perspective, gradients, and shadows, with no 3D engine or model assets. Mobile layouts simplify the props while keeping the CRT playable. Interaction effects respect reduced-motion preferences. Dialogue is local data, with no runtime API calls. Final bundled fonts remain pending review; current typography uses system fallbacks.
