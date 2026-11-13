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
    <section aria-labelledby="game-title" className="mx-auto w-full max-w-lg">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Local two-player</p>
        <h1 id="game-title" className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Tic-Tac-Toe</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Take turns on this device. Get three in a row to win.
        </p>
      </header>

      <dl aria-label="Session scores" className="mt-8 grid grid-cols-3 divide-x divide-border border border-border bg-card py-4 text-center">
        {([
          ["X wins", scores.X], ["Draws", scores.draws], ["O wins", scores.O],
        ] as const).map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <p id="game-status" role="status" aria-live="polite" aria-atomic="true" className="my-6 text-center text-xl font-semibold">
        {status}
      </p>

      <div role="group" aria-label="Tic-Tac-Toe board" aria-describedby="game-status" className="grid grid-cols-3 gap-2">
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
              className={cn(
                "flex aspect-square min-h-16 items-center justify-center rounded-sm border border-border bg-card text-5xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:text-6xl",
                !unavailable && "cursor-pointer hover:bg-secondary/40",
                unavailable && "cursor-default",
                mark === "X" ? "text-primary" : "text-foreground",
                winning && "border-primary bg-primary/15",
              )}
            >
              <span aria-hidden="true">{mark}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" className="flex-1" onClick={() => dispatch({ type: "next-round" })}>Next round</Button>
        <Button type="button" variant="outline" className="flex-1" onClick={() => dispatch({ type: "reset-session" })}>Reset session</Button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Next round clears the board and keeps scores. Reset session clears both. Reloading starts a fresh session.
      </p>
    </section>
  );
}
