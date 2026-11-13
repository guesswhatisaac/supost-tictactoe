# Tic-Tac-Toe

A local two-player Tic-Tac-Toe game with a comedic subtitle narrator. Built with React, Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

Local two-player gameplay sits inside a CSS 3D CRT scene, with session scores, soft winning-cell highlights, and separate controls for starting another round or resetting the session. A subtitle narrator notices missed opportunities, abandoned rounds, repeated strategies, score streaks, and what you do instead of playing.

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
- `src/components/narration.tsx`: narrator captions.
- `src/components/sound-toggle.tsx`: sound control on the CRT bezel.
- `src/lib/game.ts`: pure game rules and game reducer.
- `src/lib/session.ts`: coordinates game and narrator updates in one React reducer.
- `src/lib/narrator.ts` and `src/lib/dialogue.ts`: narrator memory, line selection, and typed dialogue data.
- `src/lib/sound.ts`: quiet, synthesized retro sound effects using browser audio.
- `tests/game.test.ts`: game-rule tests, including all reachable board states.
- `tests/narrator.test.ts`: narration priority, replay variation, and reset tests.
- `tests/sound.test.ts`: valid-move cues, result priority, and silent invalid moves.

The game uses a React reducer without a backend or persistent storage. Reloading clears scores and starts a fresh session. Next round preserves that history; Reset session clears it. Narrator captions are always available, replace one another immediately, and never delay moves.

Incidental prop/speaker asides leave a short reading interval between lines, and results get priority over those asides. Suppressed lines are discarded rather than queued; moves, results, resets, and deliberate spam escalation still respond immediately.

Short sound effects respond to valid moves, results, and resets. The speaker control mutes them without hiding captions or changing gameplay, and resets preserve the sound setting. The narrator may acknowledge the switch. Browser audio starts only after an interaction. There are no audio downloads or added sound dependencies; unavailable audio silently falls back to the playable game.

Click the keyboard, mug, lamp, wall, or tabletop for small reactions and tap sounds. Repeated detours and rapid control presses make the narrator increasingly bored; returning to play gets a callback. Visible props also work with Enter or Space. After an 18-second pause in a focused, visible game, the narrator may comment once, then acknowledge the next move. Nothing forces you to follow its commentary.

After the first click unlocks browser audio, entering different squares plays quiet ticks with different pitches. Keyboard focus uses the same feedback. Hover feedback is throttled, stays silent while a result cue plays, and respects the sound mute control.

The scenery uses HTML/CSS perspective, gradients, and shadows, with no 3D engine or model assets. Mobile layouts simplify the props while keeping the CRT playable. Interaction effects respect reduced-motion preferences. Dialogue is local data, with no runtime API calls.

Barlow Condensed is bundled for the title/captions and IBM Plex Mono for controls, status, and scores using `next/font/local`; no runtime font service is required. Font files and their original Open Font Licenses are in `public/fonts`. Sources: [Barlow Condensed](https://github.com/google/fonts/tree/main/ofl/barlowcondensed) and [IBM Plex Mono](https://github.com/google/fonts/tree/main/ofl/ibmplexmono).
