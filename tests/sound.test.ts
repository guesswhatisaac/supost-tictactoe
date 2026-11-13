import assert from "node:assert/strict";
import test from "node:test";
import { createGame, gameReducer, type GameAction } from "../src/lib/game.ts";
import { getSoundCue } from "../src/lib/sound.ts";

const play = (moves: number[]) => moves.reduce((state, index) => gameReducer(state, { type: "play", index }), createGame());

test("X and O valid moves receive distinct sound cues", () => {
  const initial = createGame();
  const action: GameAction = { type: "play", index: 4 };
  const first = gameReducer(initial, action);
  assert.equal(getSoundCue(initial, first, action), "move-x");
  const reply: GameAction = { type: "play", index: 0 };
  assert.equal(getSoundCue(first, gameReducer(first, reply), reply), "move-o");
});

test("invalid and post-result moves are silent", () => {
  for (const [state, index] of [[play([4]), 4], [play([4]), -1], [play([0, 3, 1, 4, 2]), 8]] as const) {
    const action: GameAction = { type: "play", index };
    assert.equal(getSoundCue(state, gameReducer(state, action), action), null);
  }
});

test("round-ending sounds take priority over ordinary move sounds", () => {
  for (const [moves, index, expected] of [
    [[0, 3, 1, 4], 2, "win"],
    [[0, 1, 2, 4, 3, 5, 7, 6], 8, "draw"],
  ] as const) {
    const state = play([...moves]);
    const action: GameAction = { type: "play", index };
    assert.equal(getSoundCue(state, gameReducer(state, action), action), expected);
  }
});

test("round reset and session reset have distinct cues", () => {
  const state = play([4]);
  for (const type of ["next-round", "reset-session"] as const) {
    const action = { type };
    assert.equal(getSoundCue(state, gameReducer(state, action), action), type);
  }
});
