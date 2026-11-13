import assert from "node:assert/strict";
import test from "node:test";
import { dialogue } from "../src/lib/dialogue.ts";
import { createSession, sessionReducer, type SessionState } from "../src/lib/session.ts";
import { boardKey } from "../src/lib/narrator.ts";

function play(moves: number[], initial = createSession()) {
  return moves.reduce((state, index) => sessionReducer(state, { type: "play", index }), initial);
}
const next = (state: SessionState) => sessionReducer(state, { type: "next-round" });

test("initial narration is deterministic for hydration and reducer replay", () => {
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
  assert.deepEqual(ordinary.narrator.moves, [4, 0]);
  assert.strictEqual(play([4], ordinary).game, ordinary.game);
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
    assert.strictEqual(play([6], state).game, state.game);
  }
});

test("abandonment distinguishes an empty start, a single move, and an imminent conclusion", () => {
  assert.equal(next(createSession()).narrator.category, "emptyRestart");
  assert.equal(next(play([4])).narrator.category, "abandonEarly");
  assert.equal(next(play([0, 3, 1])).narrator.category, "abandonThreat");
  const repeated = next(play([0], next(play([4]))));
  assert.equal(repeated.narrator.category, "abandonRepeat");
  assert.equal(play([4], repeated).narrator.category, "returnToPlay");
  assert.deepEqual(repeated.game.scores, { X: 0, O: 0, draws: 0 });
});

test("the narrator recognizes a repeated sequence and a deliberate third-move departure", () => {
  const previous = next(play([4, 0, 8]));
  assert.equal(play([4, 0, 8], previous).narrator.category, "repeatMoves");
  assert.equal(play([4, 0, 6], previous).narrator.category, "breakPattern");
});

test("tactical pathways notice missed wins, exposed wins, forks, and later recovery", () => {
  assert.equal(play([0, 3, 1, 4, 8]).narrator.category, "missedWin");
  assert.equal(play([0, 3, 1, 4]).narrator.category, "missedBlock");
  assert.equal(play([0, 1, 4, 8, 6]).narrator.category, "fork");
  const recovered = play([0, 3, 1, 4, 8, 6, 2]);
  assert.equal(recovered.narrator.category, "recoveredWin");
  assert.equal(recovered.game.result.type, "win");
});

test("reply pathways recognize a claimed center and opposite corners", () => {
  assert.equal(play([0, 4]).narrator.category, "centerTaken");
  assert.equal(play([0, 8]).narrator.category, "oppositeCorner");
});

test("result pathways remember winning streaks, first points, equalizers, and repeated draws", () => {
  const xMoves = [0, 3, 1, 4, 2];
  const oMoves = [0, 3, 1, 4, 8, 5];
  const drawMoves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  const first = play(xMoves);
  const streak = play(xMoves, next(first));
  assert.equal(streak.narrator.category, "winnerStreak");
  assert.ok(streak.narrator.caption.includes("2"));
  assert.equal(play(oMoves, next(first)).narrator.category, "comeback");
  assert.equal(play(oMoves, next(streak)).narrator.category, "firstPoint");
  assert.equal(play(drawMoves, next(streak)).narrator.category, "drawAfterStreak");
  assert.equal(play(drawMoves, next(play(drawMoves))).narrator.category, "repeatedDraw");
  assert.equal(play([0, 1, 5, 2, 7, 3, 6, 4, 8]).narrator.category, "fullBoardWin");
});

test("resets acknowledge the actual old scoreboard, then forget it completely", () => {
  const reset = (state: SessionState) => sessionReducer(state, { type: "reset-session" });
  assert.equal(reset(createSession()).narrator.category, "resetEmpty");
  const erased = reset(play([0, 3, 1, 4, 2]));
  assert.equal(erased.narrator.category, "resetLeader");
  assert.ok(erased.narrator.caption.includes("X"));
  assert.deepEqual(erased.game.scores, { X: 0, O: 0, draws: 0 });
  assert.equal(erased.narrator.winStreak, 0);
  assert.deepEqual(erased.narrator.previousMoves, []);
  assert.equal(reset(play([0, 1, 2, 4, 3, 5, 7, 6, 8])).narrator.category, "resetDraws");
});

test("occupied and completed-board persistence changes commentary, never moves or score", () => {
  const first = play([4]);
  const repeated = play([4, 4], first);
  assert.equal(repeated.narrator.category, "occupied");
  assert.strictEqual(repeated.game, first.game);
  const spammed = play([4, 4, 4], repeated);
  assert.equal(spammed.narrator.category, "occupiedAgain");
  assert.equal(play([4, 4], spammed).narrator.caption, spammed.narrator.caption);
  const finished = play([0, 3, 1, 4, 2]);
  const attempts = play([6, 6], finished);
  assert.equal(attempts.narrator.category, "finished");
  assert.strictEqual(attempts.game, finished.game);
});

test("idle is once per round, ignores stale/finished boards, and connects to the returning move", () => {
  const idle = (state: SessionState) => sessionReducer(state, { type: "idle", boardKey: boardKey(state.game.board), roundIndex: state.narrator.roundIndex });
  const initial = idle(createSession());
  assert.equal(initial.narrator.category, "idleStart");
  assert.strictEqual(idle(initial), initial);
  assert.equal(play([4], initial).narrator.category, "idleReturn");
  const thinking = play([0, 3, 1, 4]);
  assert.equal(idle(thinking).narrator.category, "idleThreat");
  const stale = sessionReducer(thinking, { type: "idle", boardKey: "---------", roundIndex: 0 });
  assert.strictEqual(stale, thinking);
  const newRound = next(createSession());
  assert.strictEqual(sessionReducer(newRound, { type: "idle", boardKey: "---------", roundIndex: 0 }), newRound);
  const ended = play([0, 3, 1, 4, 2]);
  assert.strictEqual(idle(ended), ended);
  assert.equal(play([2], idle(thinking)).narrator.category, "xWin");
});

test("sound-control asides are bounded and do not change the game", () => {
  const initial = createSession();
  let state = sessionReducer(initial, { type: "sound-change", enabled: false });
  assert.equal(state.narrator.category, "soundMuted");
  state = sessionReducer(state, { type: "sound-change", enabled: true });
  assert.equal(state.narrator.category, "soundRestored");
  state = sessionReducer(state, { type: "sound-change", enabled: false });
  state = sessionReducer(state, { type: "sound-change", enabled: true });
  assert.equal(state.narrator.category, "soundFidget");
  assert.strictEqual(state.game, initial.game);
  assert.equal(sessionReducer(state, { type: "sound-change", enabled: false }).narrator.caption, state.narrator.caption);
});

test("each scenery object has its own reaction without changing the game", () => {
  for (const object of ["keyboard", "mug", "lamp", "wall", "desk"] as const) {
    const initial = createSession();
    const state = sessionReducer(initial, { type: "object-click", object });
    assert.equal(state.narrator.category, object);
    assert.strictEqual(state.game, initial.game);
    assert.equal(state.narrator.objectClicks[object], 1);
  }
});

test("object detours progress from curiosity to boredom, resignation, then a return callback", () => {
  let state = createSession();
  for (let click = 1; click <= 10; click++) {
    state = sessionReducer(state, { type: "object-click", object: "mug" });
    if (click === 3) assert.equal(state.narrator.category, "objectAgain");
    if (click === 6) assert.equal(state.narrator.category, "distractionBored");
  }
  assert.equal(state.narrator.category, "distractionResigned");
  assert.equal(state.narrator.moves.length, 0);
  const playing = play([4], state);
  assert.equal(playing.narrator.category, "backFromObjects");
  assert.equal(playing.narrator.distractions, 0);
  assert.equal(playing.game.board[4], "X");
});

test("rapid button presses escalate across targets and reset sessions without preserving game history", () => {
  let state = play([4]);
  for (let click = 1; click <= 8; click++) {
    state = sessionReducer(state, { type: click % 2 ? "next-round" : "reset-session", at: click * 100 });
    if (click === 4) assert.equal(state.narrator.category, "buttonSpam");
  }
  assert.equal(state.narrator.category, "buttonSpamAgain");
  assert.equal(state.narrator.buttonBurst.count, 8);
  assert.deepEqual(state.game.scores, { X: 0, O: 0, draws: 0 });
  assert.deepEqual(state.narrator.previousMoves, []);
  const afterPause = sessionReducer(state, { type: "next-round", at: 3000 });
  assert.equal(afterPause.narrator.buttonBurst.count, 1);
  assert.notEqual(afterPause.narrator.category, "buttonSpamAgain");
  assert.equal(play([4], state).narrator.buttonBurst.count, 0);
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
