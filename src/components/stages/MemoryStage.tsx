import { useMemo, useState } from "react";
import classNames from "classnames";
import { heartSymbols } from "../../config/heartSymbols";
import type { MemoryStage as MemoryStageConfig } from "../../types/quiz";
import Button from "../shared/Button";
import stageStyles from "./StageCommon.module.scss";

type MemoryStageProps = {
  stage: MemoryStageConfig;
  onComplete: () => void;
  onTap: () => void;
};

type MemoryCard = {
  uid: string;
  pairId: string;
  label: string;
};

const shuffle = <T,>(items: T[]) => {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
};

const createDeck = (stage: MemoryStageConfig): MemoryCard[] => {
  const doubled = stage.rules.cards.flatMap((card) => [
    { uid: `${card.id}-a`, pairId: card.id, label: card.label },
    { uid: `${card.id}-b`, pairId: card.id, label: card.label },
  ]);

  return shuffle(doubled);
};

const MemoryStage = ({ stage, onComplete, onTap }: MemoryStageProps) => {
  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck(stage));
  const [opened, setOpened] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState(stage.rules.idleHint ?? "");

  const totalPairs = stage.rules.cards.length;
  const matchedCount = matchedPairs.length;

  const revealCard = (index: number) => {
    if (isLocked || isCompleted) {
      return;
    }

    const card = deck[index];
    if (!card || opened.includes(index) || matchedPairs.includes(card.pairId)) {
      return;
    }

    onTap();
    const nextOpened = [...opened, index];
    setOpened(nextOpened);

    if (nextOpened.length < 2) {
      return;
    }

    const [firstIndex, secondIndex] = nextOpened;
    const firstCard = deck[firstIndex];
    const secondCard = deck[secondIndex];

    if (firstCard.pairId === secondCard.pairId) {
      const nextMatched = [...matchedPairs, firstCard.pairId];
      setMatchedPairs(nextMatched);
      setOpened([]);

      if (nextMatched.length >= totalPairs) {
        setIsCompleted(true);
        setMessage(stage.rules.successMessage);
      }

      return;
    }

    setIsLocked(true);
    window.setTimeout(() => {
      setOpened([]);
      setIsLocked(false);
    }, stage.rules.flipBackDelayMs);
  };

  const restart = () => {
    onTap();
    setDeck(createDeck(stage));
    setOpened([]);
    setMatchedPairs([]);
    setIsLocked(false);
    setIsCompleted(false);
    setMessage(stage.rules.idleHint ?? "");
  };

  const deckView = useMemo(() => deck, [deck]);

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>
        {stage.rules.matchedLabel}: {matchedCount}/{totalPairs}
      </p>

      <div className={stageStyles.memoryGrid}>
        {deckView.map((card, index) => {
          const isOpen = opened.includes(index);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <button
              key={card.uid}
              className={classNames(stageStyles.memoryCard, {
                [stageStyles.memoryCardOpen]: isOpen || isMatched,
                [stageStyles.memoryCardMatched]: isMatched,
              })}
              type="button"
              onClick={() => revealCard(index)}
              disabled={isMatched}
            >
              <span className={stageStyles.memoryCardInner}>
                {isOpen || isMatched ? card.label : heartSymbols.primary}
              </span>
            </button>
          );
        })}
      </div>

      {isCompleted && (
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

      {message && <p className={stageStyles.helperText}>{message}</p>}
    </div>
  );
};

export default MemoryStage;
