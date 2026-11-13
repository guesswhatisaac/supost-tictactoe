# Tic-Tac-Toe

A local two-player Tic-Tac-Toe game with a comedic subtitle narrator. Built with React, Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

The project is currently scaffolded. Gameplay, the CRT scene, and narration are still to come.

## Run locally

Use Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Checks

```sh
npm run typecheck
npm run build
```

## Project structure

- `src/app`: App Router page, root layout, and global styles.
- `src/components/ui`: shared shadcn/ui controls.
- `src/lib`: shared utilities.

The game will use a React reducer and local dialogue data, without a backend. Scenery will use CSS perspective and depth effects. Final fonts and narrator dialogue are pending review.
