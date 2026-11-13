"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSession, sessionReducer } from "@/lib/session";
import { Narration } from "@/components/narration";
import { SoundToggle } from "@/components/sound-toggle";
import { gameReducer, type GameAction } from "@/lib/game";
import { createSoundPlayer, getSoundCue } from "@/lib/sound";
import { cn } from "@/lib/utils";

export function Game() {
  const [state, dispatch] = useReducer(sessionReducer, undefined, createSession);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const player = useRef<ReturnType<typeof createSoundPlayer> | null>(null);
  useEffect(() => () => {
    player.current?.dispose();
    player.current = null;
  }, []);

  function act(action: GameAction) {
    const next = gameReducer(state.game, action);
    dispatch(action);
    const cue = getSoundCue(state.game, next, action);
    if (soundEnabled && cue) {
      player.current ??= createSoundPlayer();
      void player.current.play(cue);
    }
  }

  function toggleSound() {
    if (soundEnabled) player.current?.stop();
    setSoundEnabled(!soundEnabled);
  }
  const { board, turn, result, scores } = state.game;
  const status = result.type === "win"
    ? `${result.winner} wins!`
    : result.type === "draw" ? "It's a draw." : `${turn}'s turn`;

  return (
    <>
    <section aria-labelledby="game-title" className="game-terminal">
      <div className="crt-casing">
        <div className="screen-bezel">
          <div className="monitor-screen">
            <p id="game-status" role="status" aria-live="polite" aria-atomic="true" className="game-status" data-result={result.type}>
              {status}
            </p>

            <div role="group" aria-label="Tic-Tac-Toe board" aria-describedby="game-status" className="game-board">
              {board.map((mark, index) => {
                const unavailable = mark !== null || result.type !== "playing";
                const winning = result.type === "win" && result.cells.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${mark ?? "empty"}${winning ? ", winning cell" : ""}`}
                    aria-disabled={unavailable}
                    onClick={() => { if (!unavailable) act({ type: "play", index }); }}
                    className={cn("board-cell", mark === "X" && "mark-x", mark === "O" && "mark-o", winning && "winning-cell")}
                  >
                    <span aria-hidden="true">{mark}</span>
                  </button>
                );
              })}
            </div>

            <dl aria-label="Session scores" className="game-scores">
              {([
                ["X wins", scores.X], ["Draws", scores.draws], ["O wins", scores.O],
              ] as const).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{String(value).padStart(2, "0")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="monitor-controls">
          <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
          <div className="round-controls">
            <Button type="button" title="Clear the board and keep scores" className="terminal-button" onClick={() => act({ type: "next-round" })}>Next round</Button>
            <Button type="button" title="Clear the board and all scores" variant="outline" className="terminal-button terminal-button-secondary" onClick={() => act({ type: "reset-session" })}>Reset session</Button>
          </div>
        </div>
      </div>
      <div className="monitor-stand" aria-hidden="true" />
    </section>
    <Narration caption={state.narrator.caption} />
    </>
  );
}
