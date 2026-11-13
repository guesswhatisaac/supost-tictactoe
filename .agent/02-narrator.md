# Narrator System

<!-- STATUS: INITIALIZED -->

## Confirmed reference

- Use The Stanley Parable as the narrator reference: meta humor, fourth-wall awareness, and reactions to player agency.
- Write original dialogue.
- Subtitles must not block or slow gameplay.

## User-selected behavior

- **Personality:** politely controlling and quietly exasperated, with dry, understated humor.
- **Presentation:** subtitles only.
- **Triggers:** openings, selected moves, results, and restarts. Not every move needs commentary. Hesitation and suggested-move reactions are outside the selected trigger scope.
- **Memory:** remember earlier rounds within the current page session; reload clears that memory. No cross-visit persistence.
- **Controls:** narration is on by default with a visible toggle.

## Gameplay boundaries

- Narration never gates a move, result, or restart.
- Turning narration off leaves the game fully playable.
- Original dialogue lives in data rather than components.

## Selected move commentary

- Comment on the first move and moves that immediately win or block an immediate win.
- Other moves need no commentary. An immediate block means occupying a cell where the opponent could otherwise win on their next move.
- Use event-specific original dialogue and avoid repeating the previous line when alternatives exist.

## Subtitle behavior

- Keep the latest caption visible until replaced; do not automatically hide it.
- During rapid play, show the latest relevant caption rather than queueing old commentary.
- Result commentary takes priority over move commentary for the same move.
- Keep captions short, as established in MASTER_PROMPT.md. Final wording is reviewed with the user.

## Round memory and toggle

- Track completed round count, X wins, O wins, draws, and the previous round's opening move.
- Retain memory across rounds within the current page session only. Reload clears it.
- Continue tracking rounds silently while narration is disabled.
- When re-enabled, show fresh commentary appropriate to the current state rather than replaying missed captions.
- The toggle affects narration only, never game rules or available moves.
- Turning narration off hides the current caption immediately.
- Next round and Reset session preserve the toggle setting and discard the previous caption. When enabled, show fresh opening commentary; when disabled, leave captions hidden.
- Reset session clears round history and line-repetition memory. Next round preserves them.

## Approval and dialogue review

The behavior spec is approved by the user.
Actual dialogue remains subject to user review; approving this spec does not approve
unwritten lines. Dialogue quantity will be settled when preparing that content.
