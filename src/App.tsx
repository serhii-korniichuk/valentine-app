import { useEffect, useMemo, useState } from 'react'
import ConfettiBurst from './components/ConfettiBurst'
import BackgroundHearts from './components/BackgroundHearts'
import FinalScreen from './components/FinalScreen'
import HomeScreen from './components/HomeScreen'
import ProgressBar from './components/ProgressBar'
import SoundToggle from './components/SoundToggle'
import StageScreen from './components/StageScreen'
import { stages } from './data/stages'
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

  const activeStage = stages[currentStage]
  const totalStages = stages.length

  const allRewardLabels = useMemo(() => stages.map((stage) => stage.rewardLabel), [])

  useEffect(() => {
    setIsTransitioning(false)
  }, [currentStage, mode])

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

    triggerConfetti()
    await play('success')

    if (currentStage >= totalStages - 1) {
      setMode('final')
      await play('celebration')
      return
    }

    setTimeout(() => {
      setCurrentStage((prev) => prev + 1)
    }, 320)
  }

  const openReward = async () => {
    setRewardOpened(true)
    triggerConfetti()
    await play('celebration')
  }

  const currentProgress = mode === 'stages' ? currentStage : totalStages

  return (
    <main className="app-shell">
      <BackgroundHearts />
      <ConfettiBurst trigger={confettiTrigger} />

      <div className="top-controls">
        <SoundToggle
          enabled={enabled}
          onToggle={() => {
            setEnabled(!enabled)
          }}
        />
      </div>

      {mode !== 'home' && <ProgressBar current={currentProgress} total={totalStages} />}

      {mode === 'home' && <HomeScreen onStart={startQuiz} />}

      {mode === 'stages' && activeStage && (
        <StageScreen
          stage={activeStage}
          onComplete={completeStage}
          onTap={() => {
            void play('tap')
          }}
          onAudioPlay={() => play('celebration')}
        />
      )}

      {mode === 'final' && (
        <FinalScreen hearts={collectedHearts.length === 0 ? allRewardLabels : collectedHearts} onReward={openReward} rewardOpened={rewardOpened} />
      )}
    </main>
  )
}

export default App
