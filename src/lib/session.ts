import { createGame, gameReducer, type GameAction, type GameState } from "./game.ts";
import { advanceNarrator, createNarrator, type NarratorState } from "./narrator.ts";

export type SessionState = { game: GameState; narrator: NarratorState };
export type SessionAction = GameAction;

export function createSession(): SessionState {
  return { game: createGame(), narrator: createNarrator() };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  const game = gameReducer(state.game, action);
  if (game === state.game) return state;
  return { game, narrator: advanceNarrator(state.narrator, game) };
}
