export type Mark = "X" | "O";
export type Cell = Mark | null;

export type RoundResult =
  | { type: "playing" }
  | { type: "win"; winner: Mark; cells: readonly number[] }
  | { type: "draw" };

type GameEvent =
  | { type: "round-start" }
  | { type: "session-reset" }
  | { type: "move"; index: number; mark: Mark; opening: boolean; blockedWin: boolean };

export type GameState = {
  board: readonly Cell[];
  turn: Mark;
  result: RoundResult;
  scores: { X: number; O: number; draws: number };
  lastEvent: GameEvent;
};

export type GameAction =
  | { type: "play"; index: number }
  | { type: "next-round" }
  | { type: "reset-session" };

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

export function getRoundResult(board: readonly Cell[]): RoundResult {
  for (const cells of winningLines) {
    const [a, b, c] = cells;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { type: "win", winner: mark, cells };
    }
  }
  return board.every((cell) => cell !== null) ? { type: "draw" } : { type: "playing" };
}

export function createGame(): GameState {
  return {
    board: Array<Cell>(9).fill(null),
    turn: "X",
    result: { type: "playing" },
    scores: { X: 0, O: 0, draws: 0 },
    lastEvent: { type: "round-start" },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "reset-session") {
    return { ...createGame(), lastEvent: { type: "session-reset" } };
  }
  if (action.type === "next-round") {
    return { ...createGame(), scores: state.scores };
  }

  const { index } = action;
  if (
    state.result.type !== "playing" ||
    !Number.isInteger(index) || index < 0 || index > 8 ||
    state.board[index] !== null
  ) {
    return state;
  }

  const opponent = state.turn === "X" ? "O" : "X";
  const hypotheticalBoard = [...state.board];
  hypotheticalBoard[index] = opponent;
  const blockedWin = getRoundResult(hypotheticalBoard).type === "win";

  const board = [...state.board];
  board[index] = state.turn;
  const result = getRoundResult(board);
  const scores = { ...state.scores };
  if (result.type === "win") scores[result.winner] += 1;
  if (result.type === "draw") scores.draws += 1;

  return {
    board,
    turn: result.type === "playing" ? opponent : state.turn,
    result,
    scores,
    lastEvent: {
      type: "move",
      index,
      mark: state.turn,
      opening: state.board.every((cell) => cell === null),
      blockedWin,
    },
  };
}
