import { useMemo, useState } from 'react'
import classNames from 'classnames'
import styles from './App.module.scss'
import BackgroundHearts from './components/BackgroundHearts'
import ConfettiBurst from './components/ConfettiBurst'
import FinalScreen from './components/FinalScreen'
import HomeScreen from './components/HomeScreen'
import ProgressBar from './components/ProgressBar'
import StageScreen from './components/StageScreen'
import { useSound } from './hooks/useSound'
import { useDictionary } from './dictionary'

type ViewMode = 'home' | 'stages' | 'final'

const App = () => {
  const [mode, setMode] = useState<ViewMode>('home')
  const [currentStage, setCurrentStage] = useState(0)
  const [collectedHearts, setCollectedHearts] = useState<string[]>([])
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [rewardOpened, setRewardOpened] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { messages } = useDictionary()
  const { enabled, setEnabled, unlock, play } = useSound()

  const stages = messages.quiz.stages
  const activeStage = stages[currentStage]
  const totalStages = stages.length

  const allRewardLabels = useMemo(() => stages.map((stage) => stage.rewardLabel), [stages])

  const triggerConfetti = () => {
    setConfettiTrigger((prev) => prev + 1)
  }

  const startQuiz = async () => {
    await unlock()
    await play('tap')
    setMode('stages')
    setCurrentStage(0)
    setCollectedHearts([])
    setRewardOpened(false)
    setConfettiTrigger(0)
    setIsTransitioning(false)
  }

  const completeStage = async () => {
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
      triggerConfetti()
      await play('success')

      if (currentStage >= totalStages - 1) {
        setMode('final')
        await play('celebration')
        setIsTransitioning(false)
        return
      }

      setTimeout(() => {
        setCurrentStage((prev) => prev + 1)
        setIsTransitioning(false)
      }, 320)
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
    <main className={classNames(styles.appShell, { [styles.isHome]: mode === 'home' })}>
      <BackgroundHearts />
      <ConfettiBurst trigger={confettiTrigger} />

      {mode !== 'home' && <ProgressBar current={currentProgress} total={totalStages} />}

      {mode === 'home' && <HomeScreen onStart={startQuiz} />}

      {mode === 'stages' && activeStage && (
        <StageScreen
          stage={activeStage}
          onComplete={completeStage}
          soundEnabled={enabled}
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
          hearts={collectedHearts.length === 0 ? allRewardLabels : collectedHearts}
          onReward={openReward}
          rewardOpened={rewardOpened}
        />
      )}
    </main>
  )
}

export default App
