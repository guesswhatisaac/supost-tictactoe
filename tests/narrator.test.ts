import assert from "node:assert/strict";
import test from "node:test";
import { dialogue } from "../src/lib/dialogue.ts";
import { createSession, sessionReducer, type SessionState } from "../src/lib/session.ts";

function play(moves: number[], initial = createSession()) {
  return moves.reduce((state, index) => sessionReducer(state, { type: "play", index }), initial);
}
const next = (state: SessionState) => sessionReducer(state, { type: "next-round" });

test("initial narration is enabled and deterministic for hydration and reducer replay", () => {
  assert.deepEqual(createSession(), createSession());
  assert.equal(createSession().narrator.caption, dialogue.welcome.polite[0]);
});

for (const [index, category] of [[4, "center"], [0, "corner"], [1, "edge"]] as const) {
  test(`opening ${index} uses ${category} commentary and records the cell`, () => {
    const state = play([index]);
    assert.equal(state.narrator.caption, dialogue[category].polite[0]);
    assert.equal(state.narrator.currentOpening, index);
  });
}

test("ordinary moves and invalid moves do not replace or queue captions", () => {
  const first = play([4]);
  const ordinary = play([0], first);
  assert.strictEqual(ordinary.narrator, first.narrator);
  assert.strictEqual(play([4], ordinary), ordinary);
  assert.equal(ordinary.narrator.caption, first.narrator.caption);
});

test("a block receives commentary", () => {
  assert.equal(play([0, 3, 1, 2]).narrator.caption, dialogue.block.polite[0]);
});

test("win commentary takes priority when the winning cell also blocks the opponent", () => {
  const state = play([3, 0, 5, 8, 4]);
  assert.equal(state.game.result.type, "win");
  assert.equal(state.game.lastEvent.type === "move" && state.game.lastEvent.blockedWin, true);
  assert.equal(state.narrator.caption, dialogue.xWin.polite[0]);
});

test("X wins, O wins and draws have separate result captions; finished boards stay locked", () => {
  for (const [moves, category] of [
    [[0, 3, 1, 4, 2], "xWin"],
    [[0, 3, 1, 4, 8, 5], "oWin"],
    [[0, 1, 2, 4, 3, 5, 7, 6, 8], "draw"],
  ] as const) {
    const state = play([...moves]);
    assert.equal(state.narrator.caption, dialogue[category].polite[0]);
    assert.strictEqual(play([6], state), state);
  }
});

test("repeated openings become quietly exasperated by the third round", () => {
  const first = play([4]);
  const second = play([4], next(first));
  assert.equal(second.narrator.previousOpening, 4);
  assert.equal(second.narrator.caption, "The middle again. You seem comfortable there.");
  const third = play([4], next(second));
  assert.equal(third.narrator.caption, "I'll stop asking the other squares to prepare.");
  const fourth = play([4], next(third));
  assert.notEqual(fourth.narrator.caption, third.narrator.caption);
});

test("empty rounds do not erase the last meaningful opening", () => {
  const state = play([0], next(next(play([0]))));
  assert.equal(state.narrator.previousOpening, 0);
  assert.equal(state.narrator.caption, dialogue.repeat.weary[0]);
});

test("Reset session clears scores and all narrator history with a fresh caption", () => {
    const state = play([4], next(play([4])));
    const reset = sessionReducer(state, { type: "reset-session" });
    assert.equal(reset.narrator.roundIndex, 0);
    assert.equal(reset.narrator.currentOpening, null);
    assert.equal(reset.narrator.previousOpening, null);
    assert.deepEqual(reset.narrator.lastLines, {});
    assert.deepEqual(reset.game.scores, { X: 0, O: 0, draws: 0 });
    assert.equal(reset.narrator.caption, dialogue.reset.polite[0]);
    assert.equal(play([4], reset).narrator.caption, dialogue.center.polite[0]);
});

test("session updates never mutate the previous game or narrator state", () => {
  const state = play([4, 0]);
  const snapshot = structuredClone(state);
  next(state);
  sessionReducer(state, { type: "reset-session" });
  assert.deepEqual(state, snapshot);
});
