"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSession, sessionReducer } from "@/lib/session";
import { Narration } from "@/components/narration";
import { SoundToggle } from "@/components/sound-toggle";
import { gameReducer, type GameAction } from "@/lib/game";
import { createSoundPlayer, getSoundCue } from "@/lib/sound";
import { boardKey, type SceneObject } from "@/lib/narrator";
import { cn } from "@/lib/utils";

export function Game() {
  const [state, dispatch] = useReducer(sessionReducer, undefined, createSession);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const player = useRef<ReturnType<typeof createSoundPlayer> | null>(null);
  useEffect(() => () => {
    player.current?.dispose();
    player.current = null;
  }, []);

  useEffect(() => {
    const room = document.querySelector<HTMLElement>(".game-room");
    if (!room) return;
    function interact(object: SceneObject) {
      dispatch({ type: "object-click", object, at: performance.now() });
      if (soundEnabled) {
        player.current ??= createSoundPlayer();
        void player.current.play(object);
      }
    }
    function click(event: MouseEvent) {
      if (!(event.target instanceof Element) || !room) return;
      if (event.target.closest(".game-terminal, button, a") || window.getSelection()?.toString()) return;
      const prop = event.target.closest<HTMLElement>("[data-scene-object]");
      if (prop) {
        interact(prop.dataset.sceneObject as SceneObject);
        return;
      }
      const deskHeight = parseFloat(getComputedStyle(room, "::before").height);
      interact(event.clientY >= room.getBoundingClientRect().bottom - deskHeight ? "desk" : "wall");
    }
    function keydown(event: KeyboardEvent) {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const prop = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-scene-object]") : null;
      if (!prop) return;
      event.preventDefault();
      interact(prop.dataset.sceneObject as SceneObject);
    }
    room.addEventListener("click", click);
    room.addEventListener("keydown", keydown);
    return () => {
      room.removeEventListener("click", click);
      room.removeEventListener("keydown", keydown);
    };
  }, [soundEnabled]);

  useEffect(() => {
    if (state.game.result.type !== "playing" || state.narrator.idleGiven) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function clear() { clearTimeout(timer); }
    function arm() {
      clear();
      if (document.hidden || !document.hasFocus()) return;
      timer = setTimeout(() => dispatch({
        type: "idle", boardKey: boardKey(state.game.board), roundIndex: state.narrator.roundIndex,
      }), 18_000);
    }
    arm();
    document.addEventListener("visibilitychange", arm);
    window.addEventListener("focus", arm);
    window.addEventListener("blur", clear);
    return () => {
      clear();
      document.removeEventListener("visibilitychange", arm);
      window.removeEventListener("focus", arm);
      window.removeEventListener("blur", clear);
    };
  }, [state.game.board, state.game.result.type, state.narrator.roundIndex, state.narrator.idleGiven,
    state.narrator.distractions, state.narrator.soundChanges, state.narrator.occupiedAttempts]);

  function act(action: GameAction) {
    const next = gameReducer(state.game, action);
    dispatch({ ...action, at: performance.now() });
    const cue = getSoundCue(state.game, next, action);
    if (soundEnabled && cue) {
      player.current ??= createSoundPlayer();
      void player.current.play(cue);
    }
  }

  function toggleSound() {
    if (soundEnabled) player.current?.stop();
    dispatch({ type: "sound-change", enabled: !soundEnabled, at: performance.now() });
    setSoundEnabled(!soundEnabled);
  }
  function hover(target: number) {
    if (soundEnabled) player.current?.hover(target);
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
                      onClick={() => act({ type: "play", index })}
                      onPointerEnter={(event) => { if (!unavailable && event.pointerType !== "touch") hover(index); }}
                      onFocus={() => { if (!unavailable) hover(index); }}
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
            <SoundToggle enabled={soundEnabled} onToggle={toggleSound} onHover={() => hover(9)} />
            <div className="round-controls">
              <Button type="button" title="Clear the board and keep scores" className="terminal-button" onPointerEnter={(event) => { if (event.pointerType !== "touch") hover(10); }} onFocus={() => hover(10)} onClick={() => act({ type: "next-round" })}>Next round</Button>
              <Button type="button" title="Clear the board and all scores" variant="outline" className="terminal-button terminal-button-secondary" onPointerEnter={(event) => { if (event.pointerType !== "touch") hover(11); }} onFocus={() => hover(11)} onClick={() => act({ type: "reset-session" })}>Reset session</Button>
            </div>
          </div>
        </div>
        <div className="monitor-stand" aria-hidden="true" />
      </section>
      <Narration caption={state.narrator.caption} />
    </>
  );
}
