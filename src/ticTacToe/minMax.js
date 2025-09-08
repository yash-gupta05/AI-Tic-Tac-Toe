import { HUMAN_PLAYER_SYMBOL, AI_PLAYER_SYMBOL } from "../App";

export function minimax(newBoard, player, depth, alpha = -Infinity, beta = Infinity) {
  const availSpots = emptyIndexies(newBoard);

  // Terminal states
  if (winning(newBoard, HUMAN_PLAYER_SYMBOL)) return { score: -10 };
  if (winning(newBoard, AI_PLAYER_SYMBOL)) return { score: 10 };
  if (availSpots.length === 0 || depth === 0) return { score: 0 };

  const moves = [];
  let bestMoveIndex;

  for (let i = 0; i < availSpots.length; i++) {
    const move = { index: newBoard[availSpots[i]] };

    // Set spot to current player
    newBoard[availSpots[i]] = player;

    // Recurse for opponent
    const opponent = player === AI_PLAYER_SYMBOL ? HUMAN_PLAYER_SYMBOL : AI_PLAYER_SYMBOL;
    const result = minimax(newBoard, opponent, depth - 1, alpha, beta);
    move.score = result.score;

    // Reset spot
    newBoard[availSpots[i]] = move.index;
    moves.push(move);

    // Determine best move and apply alpha-beta pruning
    if (player === AI_PLAYER_SYMBOL) {
      if (bestMoveIndex === undefined || move.score > moves[bestMoveIndex].score) bestMoveIndex = i;
      alpha = Math.max(alpha, move.score);
    } else {
      if (bestMoveIndex === undefined || move.score < moves[bestMoveIndex].score) bestMoveIndex = i;
      beta = Math.min(beta, move.score);
    }

    if (beta <= alpha) break;
  }

  return moves[bestMoveIndex];
}

// Returns available spots on the board
export function emptyIndexies(board) {
  return board.filter((s) => s !== "O" && s !== "X");
}

// Check for a winning combination
export function winning(board, player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winCombos.some((combo) => combo.every((index) => board[index] === player));
}
