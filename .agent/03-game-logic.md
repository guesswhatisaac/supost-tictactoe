# Game Logic

<!-- STATUS: INITIALIZED -->

## User-selected rules

- Local two-player mode on one device. No computer opponent.
- Standard 3x3 board. X starts every round; X and O alternate valid moves.
- Occupied cells cannot be played. Invalid attempts do not change the turn.
- Three matching marks in any row, column, or diagonal win.
- A full board without a winner is a draw. Check for a win before declaring a draw.
- No moves are accepted after a win or draw.
- Show the current turn during play and the result when the round ends.
- No move history or undo.

## Session scoreboard

- Display X wins, O wins, and draws.
- Count each completed round once, when its result is established.
- Scores last for the current page session; reload clears them, consistent with narrator memory.
- Narration being disabled does not affect scoring.

## Reset controls

- **Next round:** clears the board and result, with X to start. Preserves scores and narrator memory.
- **Reset session:** clears the board, result, scores, and narrator memory, with X to start.
- Both controls preserve the sound-effects enabled/disabled setting. Narrator captions are always on following the user's removal of the narrator toggle.
- Either reset replaces the old caption with fresh restart commentary.
- Starting another round does not count an unfinished board as a completed round, win, or draw.

## State responsibilities

- Maintain nine cells, the current turn, round result, and session scores.
- Derive winning cells and available moves from the board and result.
- Game rules and results remain independent of narrator presentation.
- Publish game events for narration without allowing narration to change move validity or scoring.

Approved by the user. Component and state implementation choices
belong to 05-tech-and-architecture.md.
