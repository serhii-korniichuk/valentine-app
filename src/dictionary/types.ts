import type { QuizStage } from '../types/quiz'

export type Locale = 'uk'

export type Messages = {
  soundToggle: {
    onLabel: string
    offLabel: string
  }
  progress: {
    ariaLabel: string
    stageLabel: string
  }
  home: {
    badge: string
    title: string
    subtitle: string
    startButton: string
  }
  final: {
    badge: string
    title: string
    message: string
    rewardButton: string
    rewardLine1: string
    rewardLine2: string
  }
  stageUi: {
    truth: {
      trueButton: string
      falseButton: string
    }
    catch: {
      caughtLabel: string
      timeLabel: string
      secondsSuffix: string
      heartAriaLabel: string
      continueButton: string
    }
    date: {
      placeholder: string
      submitButton: string
    }
    puzzle: {
      previewPlaceholder: string
      helperAfterAttempt: string
    }
    audio: {
      playButton: string
      continueButton: string
    }
  }
  quiz: {
    stages: QuizStage[]
  }
}
