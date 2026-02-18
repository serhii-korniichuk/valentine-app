import { useEffect, useState } from "react";
import { heartSymbols } from "../../config/heartSymbols";
import type { CatchStage as CatchStageConfig } from "../../types/quiz";
import Button from "../shared/Button";
import stageStyles from "./StageCommon.module.scss";

type CatchStageProps = {
  stage: CatchStageConfig;
  onComplete: (options?: { skipCelebration?: boolean }) => void;
  onCelebrate: () => void;
  onTap: () => void;
};

const nextPosition = (
  stage: CatchStageConfig,
  previous?: { x: number; y: number },
) => {
  const { minSpawnDistancePercent, spawnArea } = stage.rules;
  const maxAttempts = 20;
  let candidate = {
    x: spawnArea.minX + Math.random() * (spawnArea.maxX - spawnArea.minX),
    y: spawnArea.minY + Math.random() * (spawnArea.maxY - spawnArea.minY),
  };

  if (!previous) {
    return candidate;
  }

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const distance = Math.hypot(
      candidate.x - previous.x,
      candidate.y - previous.y,
    );
    if (distance >= minSpawnDistancePercent) {
      return candidate;
    }

    candidate = {
      x: spawnArea.minX + Math.random() * (spawnArea.maxX - spawnArea.minX),
      y: spawnArea.minY + Math.random() * (spawnArea.maxY - spawnArea.minY),
    };
  }

  return candidate;
};

const CatchStage = ({
  stage,
  onComplete,
  onCelebrate,
  onTap,
}: CatchStageProps) => {
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(stage.rules.durationSec);
  const [deadlineAt, setDeadlineAt] = useState(
    () => Date.now() + stage.rules.durationSec * 1000,
  );
  const [position, setPosition] = useState(() => nextPosition(stage));
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted || score >= stage.rules.target) {
      return;
    }

    const interval = window.setInterval(() => {
      const nextSeconds = Math.max(
        0,
        Math.ceil((deadlineAt - Date.now()) / 1000),
      );
      setSeconds((prev) => (prev === nextSeconds ? prev : nextSeconds));

      if (nextSeconds <= 0) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [deadlineAt, isCompleted, score, stage.rules.target]);

  const clickHeart = () => {
    if (seconds <= 0 || isCompleted) {
      return;
    }

    onTap();
    const nextScore = Math.min(stage.rules.target, score + 1);
    setScore(nextScore);

    if (nextScore >= stage.rules.target) {
      setIsCompleted(true);
      onCelebrate();
      return;
    }

    setPosition((prev) => nextPosition(stage, prev));
  };

  const canRetry =
    !isCompleted &&
    seconds === 0 &&
    score < stage.rules.target &&
    stage.rules.allowRetryAfterTimeout;
  const floatingMessage = isCompleted
    ? stage.rules.successText
    : canRetry
      ? stage.rules.timeoutPraiseText
      : "";

  const retryRound = () => {
    setScore(0);
    setIsCompleted(false);
    setSeconds(stage.rules.durationSec);
    setPosition(nextPosition(stage));
    setDeadlineAt(Date.now() + stage.rules.durationSec * 1000);
  };

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>
        {stage.scoreLabel}: {score}/{stage.rules.target} • {stage.timeLabel}:{" "}
        {seconds}
        {stage.secondsSuffix}
      </p>
      <div className={stageStyles.catchAreaWrap}>
        {floatingMessage && (
          <p
            className={
              isCompleted
                ? stageStyles.catchFloatingMessageSuccess
                : stageStyles.catchFloatingMessageFail
            }
          >
            {floatingMessage}
          </p>
        )}
        <div className={stageStyles.catchArea}>
          {!isCompleted && seconds > 0 && (
            <button
              aria-label={stage.heartAriaLabel}
              className={stageStyles.catchHeart}
              style={{
                left: `${Math.round(position.x)}%`,
                top: `${Math.round(position.y)}%`,
              }}
              type="button"
              onClick={clickHeart}
            >
              {heartSymbols.primary}
            </button>
          )}
        </div>
      </div>
      {isCompleted && (
        <div className={stageStyles.catchActions}>
          <Button variant="outline" type="button" onClick={retryRound}>
            {stage.rules.retryAfterSuccessButtonLabel}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => onComplete({ skipCelebration: true })}
          >
            {stage.rules.continueButtonLabel}
          </Button>
        </div>
      )}
      {canRetry && (
        <Button variant="primary" type="button" onClick={retryRound}>
          {stage.rules.retryButtonLabel}
        </Button>
      )}
    </div>
  );
};

export default CatchStage;
