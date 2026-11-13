import assert from "node:assert/strict";
import test from "node:test";
import { createGame, gameReducer, getRoundResult } from "../src/lib/game.ts";
import type { Cell, GameState, Mark } from "../src/lib/game.ts";

function play(moves: number[], initial = createGame()) {
  return moves.reduce((state, index) => gameReducer(state, { type: "play", index }), initial);
}

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

for (const mark of ["X", "O"] as const) {
  for (const line of lines) {
    test(`${mark} wins on cells ${line.join(", ")}`, () => {
      const board = Array<Cell>(9).fill(null);
      for (const index of line) board[index] = mark;
      assert.deepEqual(getRoundResult(board), { type: "win", winner: mark, cells: line });
    });
  }
}

test("X starts, valid moves alternate, and previous state is unchanged", () => {
  const initial = createGame();
  const afterX = play([4], initial);
  assert.equal(initial.turn, "X");
  assert.deepEqual(initial.board, Array(9).fill(null));
  assert.equal(afterX.board[4], "X");
  assert.equal(afterX.turn, "O");
  assert.equal(play([0], afterX).board[0], "O");
  assert.deepEqual(afterX.scores, { X: 0, O: 0, draws: 0 });
});

test("occupied and invalid indices do not change state, turn, or event", () => {
  const state = play([4]);
  for (const index of [4, -1, 9, 1.5, NaN, Infinity]) {
    assert.strictEqual(gameReducer(state, { type: "play", index }), state);
  }
});

for (const [winner, moves] of [
  ["X", [0, 3, 1, 4, 2]],
  ["O", [0, 3, 1, 4, 8, 5]],
] as const) {
  test(`${winner} win scores once and locks the board`, () => {
    const state = play([...moves]);
    assert.equal(state.result.type, "win");
    assert.equal(state.scores[winner], 1);
    for (let index = 0; index < 9; index++) {
      assert.strictEqual(gameReducer(state, { type: "play", index }), state);
    }
  });
}

test("a full board draws and scores only once", () => {
  const state = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
  assert.deepEqual(state.result, { type: "draw" });
  assert.deepEqual(state.scores, { X: 0, O: 0, draws: 1 });
  assert.strictEqual(gameReducer(state, { type: "play", index: 8 }), state);
});

test("a win on the ninth move takes precedence over a draw", () => {
  const state = play([0, 1, 2, 3, 4, 5, 7, 6, 8]);
  assert.deepEqual(state.result, { type: "win", winner: "X", cells: [0, 4, 8] });
  assert.deepEqual(state.scores, { X: 1, O: 0, draws: 0 });
});

test("Next round preserves cumulative scores and starts an empty X board", () => {
  const first = play([0, 3, 1, 4, 2]);
  const next = gameReducer(first, { type: "next-round" });
  assert.deepEqual(next.board, Array(9).fill(null));
  assert.equal(next.turn, "X");
  assert.deepEqual(next.result, { type: "playing" });
  assert.deepEqual(next.scores, { X: 1, O: 0, draws: 0 });
  const second = play([0, 3, 1, 4, 8, 5], next);
  assert.deepEqual(second.scores, { X: 1, O: 1, draws: 0 });
  const third = play([0, 1, 2, 4, 3, 5, 7, 6, 8], gameReducer(second, { type: "next-round" }));
  assert.deepEqual(third.scores, { X: 1, O: 1, draws: 1 });
});

test("abandoning a round does not score, and Reset session clears all scores", () => {
  const won = play([0, 3, 1, 4, 2]);
  const partial = play([4, 0], gameReducer(won, { type: "next-round" }));
  assert.deepEqual(gameReducer(partial, { type: "next-round" }).scores, won.scores);
  const reset = gameReducer(partial, { type: "reset-session" });
  assert.deepEqual(reset, { ...createGame(), lastEvent: { type: "session-reset" } });
  assert.deepEqual(won.scores, { X: 1, O: 0, draws: 0 });
});

test("game events distinguish openings, blocks, and new rounds for future narration", () => {
  assert.deepEqual(play([4]).lastEvent, { type: "move", index: 4, mark: "X", opening: true, blockedWin: false });
  assert.deepEqual(play([0, 3, 1, 2]).lastEvent, { type: "move", index: 2, mark: "O", opening: false, blockedWin: true });
  assert.deepEqual(play([0, 4]).lastEvent, { type: "move", index: 4, mark: "O", opening: false, blockedWin: false });
  assert.deepEqual(gameReducer(play([0]), { type: "next-round" }).lastEvent, { type: "round-start" });
});

test("every reachable board agrees with an independent result check and scores correctly", () => {
  const seen = new Set<string>();
  function visit(state: GameState) {
    const key = state.board.map((cell) => cell ?? "-").join("");
    if (seen.has(key)) return;
    seen.add(key);

    // Check geometric rows/columns/diagonals independently of the rule implementation.
    const triples = [
      ...[0, 1, 2].map((row) => [row * 3, row * 3 + 1, row * 3 + 2]),
      ...[0, 1, 2].map((col) => [col, col + 3, col + 6]),
      [0, 4, 8], [2, 4, 6],
    ];
    const winner = (["X", "O"] as Mark[]).find((mark) => triples.some((cells) => cells.every((cell) => state.board[cell] === mark)));
    const terminal = winner !== undefined || state.board.every((cell) => cell !== null);
    assert.equal(state.result.type, winner ? "win" : terminal ? "draw" : "playing");
    assert.deepEqual(state.scores, { X: Number(winner === "X"), O: Number(winner === "O"), draws: Number(terminal && !winner) });

    if (terminal) {
      for (let index = 0; index < 9; index++) assert.strictEqual(gameReducer(state, { type: "play", index }), state);
      return;
    }
    for (let index = 0; index < 9; index++) {
      if (state.board[index] === null) visit(gameReducer(state, { type: "play", index }));
    }
  }
  visit(createGame());
  assert.equal(seen.size, 5478);
});
