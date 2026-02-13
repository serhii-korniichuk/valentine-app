import { useMemo, useState } from "react";
import classNames from "classnames";
import type { TicTacToeStage as TicTacToeStageConfig } from "../../types/quiz";
import Button from "../shared/Button";
import stageStyles from "./StageCommon.module.scss";

type TicTacToeStageProps = {
  stage: TicTacToeStageConfig;
  onComplete: () => void;
  onTap: () => void;
};

type Mark = "" | "player" | "bot";
type Result = "playing" | "win" | "lose" | "draw";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkResult = (board: Mark[]): Result => {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a] === "player" ? "win" : "lose";
    }
  }

  if (board.every((cell) => cell !== "")) {
    return "draw";
  }

  return "playing";
};

const scoreBoard = (board: Mark[], depth: number) => {
  const result = checkResult(board);
  if (result === "lose") {
    return 10 - depth;
  }
  if (result === "win") {
    return depth - 10;
  }
  if (result === "draw") {
    return 0;
  }
  return null;
};

const minimax = (board: Mark[], isBotTurn: boolean, depth: number): number => {
  const terminal = scoreBoard(board, depth);
  if (terminal !== null) {
    return terminal;
  }

  const freeIndexes = board
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => cell === "")
    .map(({ index }) => index);

  if (isBotTurn) {
    let best = -Infinity;
    for (const index of freeIndexes) {
      const next = [...board];
      next[index] = "bot";
      best = Math.max(best, minimax(next, false, depth + 1));
    }
    return best;
  }

  let best = Infinity;
  for (const index of freeIndexes) {
    const next = [...board];
    next[index] = "player";
    best = Math.min(best, minimax(next, true, depth + 1));
  }
  return best;
};

const pickBotMove = (board: Mark[], botSkill: number) => {
  const freeIndexes = board
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => cell === "")
    .map(({ index }) => index);

  if (freeIndexes.length === 0) {
    return -1;
  }

  const scoredMoves: Array<{ index: number; score: number }> = [];

  for (const index of freeIndexes) {
    const next = [...board];
    next[index] = "bot";
    const score = minimax(next, false, 0);
    scoredMoves.push({ index, score });
  }

  scoredMoves.sort((a, b) => b.score - a.score);
  const bestScore = scoredMoves[0]?.score ?? -Infinity;
  const bestMoves = scoredMoves
    .filter((move) => move.score === bestScore)
    .map((move) => move.index);

  const normalizedSkill = Math.min(1, Math.max(0, botSkill));
  if (Math.random() < normalizedSkill) {
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  const fallbackMoves = scoredMoves
    .filter((move) => move.score < bestScore)
    .map((move) => move.index);
  if (fallbackMoves.length > 0) {
    return fallbackMoves[Math.floor(Math.random() * fallbackMoves.length)];
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

const TicTacToeStage = ({ stage, onComplete, onTap }: TicTacToeStageProps) => {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(""));
  const [isBotTurn, setIsBotTurn] = useState(false);
  const [result, setResult] = useState<Result>("playing");

  const statusText = useMemo(() => {
    if (result === "win") {
      return stage.rules.winMessage;
    }

    if (result === "lose") {
      return stage.rules.loseMessage;
    }

    if (result === "draw") {
      return stage.rules.drawMessage;
    }

    return "";
  }, [result, stage.rules.drawMessage, stage.rules.loseMessage, stage.rules.winMessage]);

  const restart = () => {
    onTap();
    setBoard(Array(9).fill(""));
    setIsBotTurn(false);
    setResult("playing");
  };

  const playBotTurn = (nextBoard: Mark[]) => {
    setIsBotTurn(true);
    window.setTimeout(() => {
      const botMove = pickBotMove(nextBoard, stage.rules.botSkill);
      if (botMove < 0) {
        setResult("draw");
        setIsBotTurn(false);
        return;
      }

      const boardAfterBot = [...nextBoard];
      boardAfterBot[botMove] = "bot";
      setBoard(boardAfterBot);

      const nextResult = checkResult(boardAfterBot);
      setResult(nextResult);
      setIsBotTurn(false);
    }, 260);
  };

  const handleCell = (index: number) => {
    if (isBotTurn || result !== "playing" || board[index] !== "") {
      return;
    }

    onTap();
    const nextBoard = [...board];
    nextBoard[index] = "player";
    setBoard(nextBoard);

    const nextResult = checkResult(nextBoard);
    setResult(nextResult);

    if (nextResult === "playing") {
      playBotTurn(nextBoard);
    }
  };

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>

      <div className={stageStyles.ticTacToeGrid}>
        {board.map((cell, index) => (
          <button
            key={index}
            className={classNames(stageStyles.ticTacToeCell, {
              [stageStyles.ticTacToePlayer]: cell === "player",
              [stageStyles.ticTacToeBot]: cell === "bot",
            })}
            type="button"
            disabled={cell !== "" || result !== "playing" || isBotTurn}
            onClick={() => handleCell(index)}
          >
            {cell === "player"
              ? stage.rules.playerSymbol
              : cell === "bot"
                ? stage.rules.botSymbol
                : ""}
          </button>
        ))}
      </div>

      {result === "win" && (
        <div className={stageStyles.catchActions}>
          <Button variant="outline" type="button" onClick={restart}>
            {stage.rules.retryButtonLabel}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => {
              onTap();
              onComplete();
            }}
          >
            {stage.rules.continueButtonLabel}
          </Button>
        </div>
      )}

      {(result === "lose" || result === "draw") && (
        <Button variant="primary" type="button" onClick={restart}>
          {stage.rules.retryButtonLabel}
        </Button>
      )}

      {statusText && <p className={stageStyles.helperText}>{statusText}</p>}
    </div>
  );
};

export default TicTacToeStage;
