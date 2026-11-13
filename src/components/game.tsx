"use client";

import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import { createGame, gameReducer } from "@/lib/game";
import { cn } from "@/lib/utils";

export function Game() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createGame);
  const { board, turn, result, scores } = state;
  const status = result.type === "win"
    ? `${result.winner} wins!`
    : result.type === "draw" ? "It's a draw." : `${turn}'s turn`;

  return (
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
                    onClick={() => { if (!unavailable) dispatch({ type: "play", index }); }}
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
          <div className="monitor-badge" aria-hidden="true"><span className="power-light" /> TTT</div>
          <div className="round-controls">
            <Button type="button" title="Clear the board and keep scores" className="terminal-button" onClick={() => dispatch({ type: "next-round" })}>Next round</Button>
            <Button type="button" title="Clear the board and all scores" variant="outline" className="terminal-button terminal-button-secondary" onClick={() => dispatch({ type: "reset-session" })}>Reset session</Button>
          </div>
        </div>
      </div>
      <div className="monitor-stand" aria-hidden="true" />
    </section>
  );
}
