import { createGame, gameReducer, type GameAction, type GameState } from "./game.ts";
import { advanceNarrator, createNarrator, observeNarrator, observeButton, type NarratorObservation, type NarratorState } from "./narrator.ts";

export type SessionState = { game: GameState; narrator: NarratorState };
export type SessionAction = (GameAction & { at?: number }) | Exclude<NarratorObservation, { type: "invalid-move" }>;

export function createSession(): SessionState {
  return { game: createGame(), narrator: createNarrator() };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (action.type === "idle" || action.type === "sound-change" || action.type === "object-click") {
    const reaction = observeNarrator(state.narrator, state.game, action);
    const narrator = action.type === "sound-change" ? observeButton(state.narrator, reaction, action.type, action.at) : reaction;
    return narrator === state.narrator ? state : { ...state, narrator };
  }
  const game = gameReducer(state.game, action);
  if (game === state.game) {
    if (action.type !== "play") return state;
    const narrator = observeNarrator(state.narrator, game, { type: "invalid-move", index: action.index });
    return narrator === state.narrator ? state : { ...state, narrator };
  }
  const reaction = advanceNarrator(state.narrator, game, state.game);
  const narrator = action.type === "play" ? reaction : observeButton(state.narrator, reaction, action.type, action.at);
  return { game, narrator };
}
