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

## Approved tone and implementation

The user selected a politely controlling baseline, with quiet exasperation emerging
across replays, and explicitly authorized implementation. This supersedes the earlier
dialogue draft. The live, editable source is src/lib/dialogue.ts: 48 original lines,
with polite and weary alternatives for each approved category.

Examples:
- Initial center opening: "Yes, the middle. We'll proceed from there."
- Same center opening next round: "The middle again. You seem comfortable there."
- Repeating it in the third round: "I'll stop asking the other squares to prepare."
- Early block: "I would have preferred you leave that open."
- Later block: "We were one move from being finished."
- Early draw: "Nothing settled, then."
- Later draw: "Nine moves. I was here for all of them."

## Runtime behavior

- A deterministic pure session reducer coordinates independent game and narrator logic. No narration effects, timers, network calls, or external state library.
- First and second rounds use the polite pool; the third round onward uses the weary pool. Starting another round advances this progression even when abandoning a board.
- Repeated openings compare the same cell against the previous meaningful round opening. Empty rounds do not erase that reference.
- Alternate lines within a category and tone avoid the most recently used line for that category. No random initialization or hydration mismatch.
- Win/draw commentary takes precedence over move commentary. Ordinary moves preserve the current caption; invalid moves change nothing.
- Scores and completed-round totals remain in shared game state, avoiding duplicate narrator counters. Narrator memory separately stores round progression, opening cells, and used lines.
- Muting clears the caption immediately while game state and opening memory continue updating. Resume shows a fresh neutral line, never a queue of missed captions.
- Both reset controls preserve the toggle. Reset session clears opening, round, and repetition memory, with a fresh reset caption when enabled.
- On desktop, captions are left-aligned on the right wall in darker printed-looking ink, with the visible toggle beneath. Narrow/short screens retain a dedicated scene footer. Both placements avoid the board and controls and reserve space while muted to prevent layout shifts.
- Caption updates use a polite live region, separate from authoritative turn/result announcements.
- Uses system font fallbacks until exact bundled fonts are reviewed.

## Verification

Pure-rule tests cover priority, openings, replay progression, alternate lines, silent
tracking, resume, and resets. Browser checks cover actual interactions, reload
behavior, and every caption fitting at nine viewport sizes without overlap or scrolling.
