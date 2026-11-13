import { dialogue, type DialogueCategory } from "./dialogue.ts";
import type { GameState } from "./game.ts";

export type NarratorState = {
  caption: string;
  roundIndex: number;
  currentOpening: number | null;
  previousOpening: number | null;
  lastLines: Partial<Record<DialogueCategory, string>>;
};

function say(state: NarratorState, category: DialogueCategory, opening?: number): NarratorState {
  const tone = state.roundIndex >= 2 ? "weary" : "polite";
  const pool = dialogue[category][tone];
  const line = pool.find((candidate) => candidate !== state.lastLines[category]) ?? pool[0];
  const openingName = opening === 4 ? "middle" : [0, 2, 6, 8].includes(opening ?? -1) ? "same corner" : "same edge";
  return {
    ...state,
    caption: line.replace("{opening}", openingName),
    lastLines: { ...state.lastLines, [category]: line },
  };
}

export function createNarrator(): NarratorState {
  return say({ caption: "", roundIndex: 0, currentOpening: null, previousOpening: null, lastLines: {} }, "welcome");
}

export function advanceNarrator(state: NarratorState, game: GameState): NarratorState {
  const event = game.lastEvent;
  if (event.type === "session-reset") {
    // Choose the reset reaction using the old tone, but discard all session memory.
    const fresh = createNarrator();
    const reaction = say({ ...fresh, roundIndex: state.roundIndex }, "reset");
    return { ...reaction, roundIndex: 0, lastLines: {} };
  }
  if (event.type === "round-start") {
    return say({
      ...state,
      roundIndex: state.roundIndex + 1,
      previousOpening: state.currentOpening ?? state.previousOpening,
      currentOpening: null,
    }, "next");
  }
  if (event.type !== "move") return state;

  const memory = event.opening ? { ...state, currentOpening: event.index } : state;
  if (game.result.type === "win") return say(memory, game.result.winner === "X" ? "xWin" : "oWin");
  if (game.result.type === "draw") return say(memory, "draw");
  if (event.opening) {
    if (event.index === memory.previousOpening) return say(memory, "repeat", event.index);
    return say(memory, event.index === 4 ? "center" : [0, 2, 6, 8].includes(event.index) ? "corner" : "edge");
  }
  return event.blockedWin ? say(memory, "block") : memory;
}
