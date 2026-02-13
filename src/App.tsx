import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import classNames from 'classnames'
import styles from './App.module.scss'
import { quizScenario } from './config/quizScenario'
import BackgroundHearts from './components/BackgroundHearts'
import ConfettiBurst from './components/ConfettiBurst'
import FinalScreen from './components/FinalScreen'
import HomeScreen from './components/HomeScreen'
import ProgressBar from './components/ProgressBar'
import StageScreen from './components/StageScreen'
import { usePullToRefresh } from './hooks/usePullToRefresh'
import { useSound } from './hooks/useSound'

type ViewMode = 'home' | 'stages' | 'final'

const App = () => {
  const [mode, setMode] = useState<ViewMode>('home')
  const [currentStage, setCurrentStage] = useState(0)
  const [collectedHearts, setCollectedHearts] = useState<string[]>([])
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [rewardOpened, setRewardOpened] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { enabled, setEnabled, unlock, play } = useSound()
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
  } = usePullToRefresh()

  const stages = quizScenario.stages
  const activeStage = stages[currentStage]
  const totalStages = stages.length

  const allRewardLabels = useMemo(() => stages.map((stage) => stage.rewardLabel), [stages])

  const triggerConfetti = () => {
    setConfettiTrigger((prev) => prev + 1)
  }

  const startQuizFlow = async () => {
    await unlock()
    setMode('stages')
    setCurrentStage(0)
    setCollectedHearts([])
    setRewardOpened(false)
    setConfettiTrigger(0)
    setIsTransitioning(false)
  }

  const startQuiz = async () => {
    if (quizScenario.home.unlockGate?.enabled) {
      triggerConfetti()
      await play('success')
      setTimeout(() => {
        void startQuizFlow()
      }, quizScenario.home.unlockGate.successDelayMs)
      return
    }

    await play('tap')
    await startQuizFlow()
  }

  const completeStage = async (options?: { skipCelebration?: boolean }) => {
    if (isTransitioning || mode !== 'stages') {
      return
    }

    setIsTransitioning(true)
    const reward = stages[currentStage]?.rewardLabel

    if (reward) {
      setCollectedHearts((prev) => {
        if (prev.includes(reward)) {
          return prev
        }

        return [...prev, reward]
      })
    }

    try {
      if (!options?.skipCelebration) {
        triggerConfetti()
        await play('success')
      } else {
        await play('tap')
      }

      if (currentStage >= totalStages - 1) {
        setMode('final')
        await play('celebration')
        setIsTransitioning(false)
        return
      }

      setTimeout(() => {
        setCurrentStage((prev) => prev + 1)
        setIsTransitioning(false)
      }, quizScenario.ui.stageTransitionDelayMs)
    } catch {
      setIsTransitioning(false)
    }
  }

  const openReward = async () => {
    setRewardOpened(true)
    triggerConfetti()
    await play('celebration')
  }

  const currentProgress = mode === 'stages' ? currentStage : totalStages

  return (
    <main
      ref={shellRef}
      className={classNames(styles.appShell, { [styles.isHome]: mode === 'home' })}
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
        style={{ '--pull-offset': `${pullDistance}px`, '--pull-progress': pullProgress } as CSSProperties}
        aria-hidden
      >
        <span className={styles.pullRefreshIcon}>❤</span>
      </div>

      <BackgroundHearts />
      <ConfettiBurst trigger={confettiTrigger} />

      {mode !== 'home' && (
        <ProgressBar
          current={currentProgress}
          total={totalStages}
          ariaLabel={quizScenario.ui.progress.ariaLabel}
          stageLabel={quizScenario.ui.progress.stageLabel}
        />
      )}

      {mode === 'home' && (
        <HomeScreen
          badge={quizScenario.home.badge}
          unlockGate={quizScenario.home.unlockGate}
          title={quizScenario.home.title}
          subtitle={quizScenario.home.subtitle}
          startButtonLabel={quizScenario.home.startButton}
          startButtonPulse={quizScenario.home.startButtonPulse}
          onRevealInput={() => {
            void play('tap')
          }}
          onStart={startQuiz}
        />
      )}

      {mode === 'stages' && activeStage && (
        <StageScreen
          stage={activeStage}
          onComplete={completeStage}
          onCelebrate={() => {
            triggerConfetti()
            void play('success')
          }}
          soundEnabled={enabled}
          soundEnabledLabel={quizScenario.ui.soundToggle.onLabel}
          soundDisabledLabel={quizScenario.ui.soundToggle.offLabel}
          onToggleSound={() => {
            setEnabled(!enabled)
          }}
          onTap={() => {
            void play('tap')
          }}
          onAudioPlay={() => play('celebration')}
        />
      )}

      {mode === 'final' && (
        <FinalScreen
          badge={quizScenario.final.badge}
          title={quizScenario.final.title}
          message={quizScenario.final.message}
          rewardButtonLabel={quizScenario.final.rewardButton}
          rewardLine1={quizScenario.final.rewardLine1}
          rewardLine2={quizScenario.final.rewardLine2}
          hearts={collectedHearts.length === 0 ? allRewardLabels : collectedHearts}
          onReward={openReward}
          rewardOpened={rewardOpened}
        />
      )}
    </main>
  )
}

export default App
