import { dialogue, type DialogueCategory } from "./dialogue.ts";
import { getRoundResult, type Cell, type GameState, type Mark } from "./game.ts";

export type SceneObject = "keyboard" | "mug" | "lamp" | "wall" | "desk";
type ButtonKind = "next-round" | "reset-session" | "sound-change";

export type NarratorObservation = (
  | { type: "idle"; boardKey: string; roundIndex: number }
  | { type: "sound-change"; enabled: boolean }
  | { type: "invalid-move"; index: number }
  | { type: "object-click"; object: SceneObject }
) & { at?: number };

export type NarratorState = {
  caption: string;
  roundIndex: number;
  currentOpening: number | null;
  previousOpening: number | null;
  lastLines: Partial<Record<DialogueCategory, string>>;
  category: DialogueCategory;
  moves: readonly number[];
  previousMoves: readonly number[];
  abandonStreak: number;
  lastWinner: Mark | null;
  winStreak: number;
  drawStreak: number;
  missedWins: Record<Mark, number>;
  occupiedAttempts: number;
  finishedAttempts: number;
  idleGiven: boolean;
  idlePending: boolean;
  soundChanges: number;
  flags: Partial<Record<DialogueCategory, true>>;
  distractions: number;
  objectClicks: Partial<Record<SceneObject, number>>;
  buttonBurst: { key: ButtonKind | null; lastAt: number; count: number };
};

function say(state: NarratorState, category: DialogueCategory, values: Record<string, string | number> = {}): NarratorState {
  const tone = state.roundIndex >= 2 ? "weary" : "polite";
  const pool = dialogue[category][tone];
  const line = pool.find((candidate) => candidate !== state.lastLines[category]) ?? pool[0];
  return {
    ...state,
    caption: line.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(values[key] ?? placeholder)),
    category,
    lastLines: { ...state.lastLines, [category]: line },
  };
}

function once(state: NarratorState, category: DialogueCategory, values?: Record<string, string | number>): NarratorState {
  if (state.flags[category]) return state;
  return say({ ...state, flags: { ...state.flags, [category]: true } }, category, values);
}

export function boardKey(board: readonly Cell[]) {
  return board.map(cell => cell ?? "-").join("");
}

export function winningMoves(board: readonly Cell[], mark: Mark): number[] {
  if (getRoundResult(board).type !== "playing") return [];
  return board.flatMap((cell, index) => {
    if (cell !== null) return [];
    const candidate = [...board];
    candidate[index] = mark;
    const result = getRoundResult(candidate);
    return result.type === "win" && result.winner === mark ? [index] : [];
  });
}

function clearRound(state: NarratorState): NarratorState {
  return {
    ...state, moves: [], currentOpening: null, missedWins: { X: 0, O: 0 },
    occupiedAttempts: 0, finishedAttempts: 0, idleGiven: false, idlePending: false, flags: {},
    distractions: 0, objectClicks: {},
  };
}

export function createNarrator(): NarratorState {
  return say({
    caption: "", category: "welcome", roundIndex: 0, currentOpening: null, previousOpening: null,
    lastLines: {}, moves: [], previousMoves: [], abandonStreak: 0, lastWinner: null,
    winStreak: 0, drawStreak: 0, missedWins: { X: 0, O: 0 }, occupiedAttempts: 0,
    finishedAttempts: 0, idleGiven: false, idlePending: false, soundChanges: 0, flags: {},
    distractions: 0, objectClicks: {}, buttonBurst: { key: null, lastAt: 0, count: 0 },
  }, "welcome");
}

export function advanceNarrator(state: NarratorState, game: GameState, previous: GameState): NarratorState {
  const event = game.lastEvent;
  if (event.type === "session-reset") {
    // Choose the reset reaction using the old tone, but discard all session memory.
    const fresh = createNarrator();
    const leader = previous.scores.X > previous.scores.O ? "X" : "O";
    const empty = previous.board.every(cell => cell === null) && Object.values(previous.scores).every(score => score === 0);
    const category = empty ? "resetEmpty" : previous.scores.X !== previous.scores.O ? "resetLeader" : previous.scores.draws > 0 ? "resetDraws" : "reset";
    const reaction = say({ ...fresh, roundIndex: state.roundIndex }, category, { leader });
    return { ...reaction, roundIndex: 0, lastLines: {} };
  }
  if (event.type === "round-start") {
    const abandoned = previous.result.type === "playing" && state.moves.length > 0;
    const memory = {
      ...clearRound(state),
      roundIndex: state.roundIndex + 1,
      previousOpening: state.currentOpening ?? state.previousOpening,
      previousMoves: state.moves.length ? state.moves : state.previousMoves,
      abandonStreak: abandoned ? state.abandonStreak + 1 : previous.result.type !== "playing" ? 0 : state.abandonStreak,
    };
    if (previous.result.type !== "playing") return say(memory, "next");
    if (state.moves.length === 0) return say(memory, "emptyRestart");
    if (memory.abandonStreak >= 2) return say(memory, "abandonRepeat");
    if (winningMoves(previous.board, "X").length || winningMoves(previous.board, "O").length) return say(memory, "abandonThreat");
    return say(memory, state.moves.length === 1 ? "abandonEarly" : "abandon");
  }
  if (event.type !== "move") return state;

  let memory: NarratorState = {
    ...state, moves: [...state.moves, event.index], idlePending: false, distractions: 0,
    buttonBurst: { key: null, lastAt: 0, count: 0 },
  };
  if (event.opening) memory = { ...memory, currentOpening: event.index };
  if (game.result.type === "win") {
    const winner = game.result.winner;
    const opponent = winner === "X" ? "O" : "X";
    const streak = state.lastWinner === winner ? state.winStreak + 1 : 1;
    memory = { ...memory, lastWinner: winner, winStreak: streak, drawStreak: 0, abandonStreak: 0 };
    const values = { winner, streak };
    if (state.missedWins[winner] > 0) return say(memory, "recoveredWin", values);
    if (game.board.every(cell => cell !== null)) return say(memory, "fullBoardWin", values);
    if (previous.scores[winner] < previous.scores[opponent] && game.scores[winner] === game.scores[opponent]) return say(memory, "comeback", values);
    if (previous.scores[winner] === 0 && previous.scores[opponent] > 0) return say(memory, "firstPoint", values);
    return say(memory, streak >= 2 ? "winnerStreak" : winner === "X" ? "xWin" : "oWin", values);
  }
  if (game.result.type === "draw") {
    memory = { ...memory, lastWinner: null, winStreak: 0, drawStreak: state.drawStreak + 1, abandonStreak: 0 };
    return say(memory, state.winStreak >= 2 ? "drawAfterStreak" : memory.drawStreak >= 2 ? "repeatedDraw" : "draw", { draws: memory.drawStreak });
  }
  const ownWins = winningMoves(previous.board, event.mark);
  if (ownWins.length) memory = { ...memory, missedWins: { ...memory.missedWins, [event.mark]: memory.missedWins[event.mark] + 1 } };
  if (state.idlePending) return once(memory, "idleReturn");
  if (state.distractions >= 6) return once(memory, "backFromObjects");
  if (event.opening) {
    const opening = event.index === 4 ? "middle" : [0, 2, 6, 8].includes(event.index) ? "same corner" : "same edge";
    if (event.index === memory.previousOpening) return say(memory, "repeat", { opening });
    if (state.abandonStreak >= 2) return once(memory, "returnToPlay");
    return say(memory, event.index === 4 ? "center" : [0, 2, 6, 8].includes(event.index) ? "corner" : "edge");
  }
  if (ownWins.length && !memory.flags.missedWin) return once(memory, "missedWin");
  const opponent = event.mark === "X" ? "O" : "X";
  if (winningMoves(game.board, opponent).length && !event.blockedWin && !memory.flags.missedBlock) return once(memory, "missedBlock");
  if (winningMoves(game.board, event.mark).length >= 2 && !memory.flags.fork) return once(memory, "fork");
  if (memory.moves.length === 3 && memory.previousMoves.length >= 3 && memory.moves.slice(0, 2).every((cell, index) => cell === memory.previousMoves[index])) {
    return once(memory, memory.moves[2] === memory.previousMoves[2] ? "repeatMoves" : "breakPattern");
  }
  if (memory.moves.length === 2) {
    const first = memory.moves[0];
    if (first !== 4 && event.index === 4) return once(memory, "centerTaken");
    if ([0, 2, 6, 8].includes(first) && event.index === 8 - first) return once(memory, "oppositeCorner");
  }
  return event.blockedWin ? say(memory, "block") : memory;
}

export function observeNarrator(state: NarratorState, game: GameState, event: NarratorObservation): NarratorState {
  if (event.type === "object-click") {
    const count = (state.objectClicks[event.object] ?? 0) + 1;
    const memory = { ...state, distractions: state.distractions + 1, objectClicks: { ...state.objectClicks, [event.object]: count } };
    if (memory.distractions >= 10) return once(memory, "distractionResigned");
    if (memory.distractions >= 6) return once(memory, "distractionBored");
    if (count >= 3) return once(memory, "objectAgain", { object: event.object });
    return say(memory, event.object);
  }
  if (event.type === "idle") {
    if (state.idleGiven || game.result.type !== "playing" || event.boardKey !== boardKey(game.board) || event.roundIndex !== state.roundIndex) return state;
    const category = state.moves.length === 0 ? "idleStart" : winningMoves(game.board, game.turn).length ? "idleThreat" : "idle";
    return say({ ...state, idleGiven: true, idlePending: true }, category);
  }
  if (event.type === "sound-change") {
    const memory = { ...state, soundChanges: state.soundChanges + 1 };
    if (memory.soundChanges > 4) return memory;
    return say(memory, memory.soundChanges === 4 ? "soundFidget" : event.enabled ? "soundRestored" : "soundMuted");
  }
  if (!Number.isInteger(event.index) || event.index < 0 || event.index > 8) return state;
  if (game.result.type !== "playing") {
    const memory = { ...state, finishedAttempts: state.finishedAttempts + 1 };
    return memory.finishedAttempts >= 5 ? once(memory, "finishedAgain") : memory.finishedAttempts >= 2 ? once(memory, "finished") : memory;
  }
  if (game.board[event.index] === null) return state;
  const memory = { ...state, occupiedAttempts: state.occupiedAttempts + 1 };
  return memory.occupiedAttempts >= 5 ? once(memory, "occupiedAgain") : memory.occupiedAttempts >= 2 ? once(memory, "occupied", { mark: game.board[event.index]! }) : memory;
}

export function observeButton(previous: NarratorState, next: NarratorState, key: ButtonKind, at?: number): NarratorState {
  if (at === undefined || !Number.isFinite(at)) return next;
  const elapsed = at - previous.buttonBurst.lastAt;
  const count = previous.buttonBurst.key !== null && elapsed >= 0 && elapsed <= 850 ? previous.buttonBurst.count + 1 : 1;
  const memory = { ...next, buttonBurst: { key, lastAt: at, count } };
  if (count === 4) return say(memory, "buttonSpam");
  if (count === 8) return say(memory, "buttonSpamAgain");
  if (count > 4 && (previous.category === "buttonSpam" || previous.category === "buttonSpamAgain")) {
    return { ...memory, caption: previous.caption, category: previous.category };
  }
  return memory;
}
