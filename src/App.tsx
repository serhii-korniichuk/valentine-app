import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import classNames from "classnames";
import styles from "./App.module.scss";
import { heartSymbols } from "./config/heartSymbols";
import { quizScenario } from "./config/quizScenario";
import BackgroundHearts from "./components/BackgroundHearts";
import ConfettiBurst from "./components/ConfettiBurst";
import FinalScreen from "./components/FinalScreen";
import HomeScreen from "./components/HomeScreen";
import ProgressBar from "./components/ProgressBar";
import StageScreen from "./components/StageScreen";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { useSound } from "./hooks/useSound";

type ViewMode = "home" | "stages" | "final";

const App = () => {
  const [mode, setMode] = useState<ViewMode>("home");
  const [currentStage, setCurrentStage] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [rewardOpened, setRewardOpened] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLandscapeBlocked, setIsLandscapeBlocked] = useState(false);

  const { enabled, setEnabled, unlock, play } = useSound();
  const {
    shellRef,
    pullDistance,
    pullThreshold,
    pullProgress,
    isRefreshing,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = usePullToRefresh();

  const stages = quizScenario.stages;
  const activeStage = stages[currentStage];
  const totalStages = stages.length;

  useEffect(() => {
    const tryLockPortrait = async () => {
      try {
        if (typeof screen !== "undefined" && "orientation" in screen) {
          const orientation = screen.orientation as ScreenOrientation & {
            lock?: (orientation: string) => Promise<void>;
          };

          if (orientation.lock) {
            await orientation.lock("portrait");
          }
        }
      } catch {
        // Some browsers (notably iOS Safari) ignore orientation lock.
      }
    };

    void tryLockPortrait();
    window.addEventListener("orientationchange", tryLockPortrait);
    document.addEventListener("visibilitychange", tryLockPortrait);

    return () => {
      window.removeEventListener("orientationchange", tryLockPortrait);
      document.removeEventListener("visibilitychange", tryLockPortrait);
    };
  }, []);

  useEffect(() => {
    const evaluateLandscapeBlock = () => {
      const isMobileLike =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 1024px)").matches;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      setIsLandscapeBlocked(isMobileLike && isLandscape);
    };

    evaluateLandscapeBlock();
    window.addEventListener("resize", evaluateLandscapeBlock);
    window.addEventListener("orientationchange", evaluateLandscapeBlock);

    return () => {
      window.removeEventListener("resize", evaluateLandscapeBlock);
      window.removeEventListener("orientationchange", evaluateLandscapeBlock);
    };
  }, []);

  const triggerConfetti = () => {
    setConfettiTrigger((prev) => prev + 1);
  };

  const safePlay = async (
    type: "tap" | "success" | "celebration",
  ): Promise<void> => {
    try {
      await Promise.race([
        play(type),
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, 320);
        }),
      ]);
    } catch {
      // Do not block stage flow when mobile audio playback fails.
    }
  };

  const startQuizFlow = async () => {
    await unlock();
    setMode("stages");
    setCurrentStage(0);
    setRewardOpened(false);
    setConfettiTrigger(0);
    setIsTransitioning(false);
  };

  const startQuiz = async () => {
    if (quizScenario.home.unlockGate?.enabled) {
      triggerConfetti();
      await safePlay("success");
      setTimeout(() => {
        void startQuizFlow();
      }, quizScenario.home.unlockGate.successDelayMs);
      return;
    }

    await safePlay("tap");
    await startQuizFlow();
  };

  const completeStage = async (options?: { skipCelebration?: boolean }) => {
    if (isTransitioning || mode !== "stages") {
      return;
    }

    setIsTransitioning(true);
    try {
      if (!options?.skipCelebration) {
        triggerConfetti();
        await safePlay("success");
      } else {
        await safePlay("tap");
      }

      if (currentStage >= totalStages - 1) {
        setMode("final");
        await safePlay("celebration");
        setIsTransitioning(false);
        return;
      }

      setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
        setIsTransitioning(false);
      }, quizScenario.ui.stageTransitionDelayMs);
    } catch {
      setIsTransitioning(false);
    }
  };

  const openReward = async () => {
    setRewardOpened(true);
    triggerConfetti();
    await safePlay("celebration");
  };

  const restartFromProgress = async () => {
    await safePlay("tap");
    setMode("home");
    setCurrentStage(0);
    setRewardOpened(false);
    setConfettiTrigger(0);
    setIsTransitioning(false);
  };

  const currentProgress = mode === "stages" ? currentStage : totalStages;
  const activeHeartSymbol = rewardOpened
    ? heartSymbols.special
    : heartSymbols.primary;

  return (
    <main
      ref={shellRef}
      className={classNames(styles.appShell, {
        [styles.isHome]: mode === "home",
        [styles.appShellBlocked]: isLandscapeBlocked,
      })}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        className={classNames(styles.pullRefresh, {
          [styles.pullRefreshReady]: pullDistance >= pullThreshold,
          [styles.pullRefreshLoading]: isRefreshing,
        })}
        style={
          {
            "--pull-offset": `${pullDistance}px`,
            "--pull-progress": pullProgress,
          } as CSSProperties
        }
        aria-hidden
      >
        <span className={styles.pullRefreshIcon}>{activeHeartSymbol}</span>
      </div>

      <BackgroundHearts symbol={activeHeartSymbol} />
      <ConfettiBurst trigger={confettiTrigger} />

      {mode !== "home" && (
        <ProgressBar
          current={currentProgress}
          total={totalStages}
          ariaLabel={quizScenario.ui.progress.ariaLabel}
          stageLabel={quizScenario.ui.progress.stageLabel}
          restartLabel={quizScenario.ui.progress.restartLabel}
          onRestart={
            mode === "final" && rewardOpened ? restartFromProgress : undefined
          }
        />
      )}

      {mode === "home" && (
        <HomeScreen
          badge={quizScenario.home.badge}
          unlockGate={quizScenario.home.unlockGate}
          title={quizScenario.home.title}
          subtitle={quizScenario.home.subtitle}
          startButtonLabel={quizScenario.home.startButton}
          startButtonPulse={quizScenario.home.startButtonPulse}
          onRevealInput={() => {
            void play("tap");
          }}
          onStart={startQuiz}
        />
      )}

      {mode === "stages" && activeStage && (
        <StageScreen
          stage={activeStage}
          onComplete={completeStage}
          onCelebrate={() => {
            triggerConfetti();
            void play("success");
          }}
          soundEnabled={enabled}
          soundEnabledLabel={quizScenario.ui.soundToggle.onLabel}
          soundDisabledLabel={quizScenario.ui.soundToggle.offLabel}
          onToggleSound={() => {
            setEnabled(!enabled);
          }}
          onTap={() => {
            void play("tap");
          }}
        />
      )}

      {mode === "final" && (
        <FinalScreen
          badge={quizScenario.final.badge}
          title={quizScenario.final.title}
          message={quizScenario.final.message}
          rewardButtonLabel={quizScenario.final.rewardButton}
          rewardLine1={quizScenario.final.rewardLine1}
          rewardLine2={quizScenario.final.rewardLine2}
          onReward={openReward}
          rewardOpened={rewardOpened}
        />
      )}

      <a
        className={styles.watermark}
        href={quizScenario.ui.watermark.repositoryUrl}
        target="_blank"
        rel="noreferrer"
      >
        {quizScenario.ui.watermark.label}
      </a>

      {isLandscapeBlocked && (
        <div
          className={styles.orientationOverlay}
          role="alert"
          aria-live="polite"
        >
          <p className={styles.orientationOverlayText}>
            {quizScenario.ui.orientationOverlay.message}
          </p>
        </div>
      )}
    </main>
  );
};

export default App;
