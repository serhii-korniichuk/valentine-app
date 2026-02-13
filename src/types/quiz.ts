export type StageKind =
  | 'choice'
  | 'truth'
  | 'catch'
  | 'puzzle'
  | 'hold'
  | 'reaction'
  | 'memory'
  | 'tic_tac_toe'

export type StageOption = {
  id: string
  label: string
}

export type ChoiceRules =
  | {
      type: 'any'
    }
  | {
      type: 'correct_option'
      correctOptionId: string
      incorrectMessage: string
    }

export type TruthRules =
  | {
      type: 'any'
    }
  | {
      type: 'correct_answer'
      correctAnswer: 'truth' | 'false'
      incorrectMessage: string
    }

export type PuzzleRules = {
  acceptedPhrases: string[]
  normalize: 'trim_lower' | 'exact'
  incorrectMessage: string
  continueButtonLabel: string
  retryButtonLabel: string
}

export type CatchRules = {
  target: number
  durationSec: number
  allowRetryAfterTimeout: boolean
  timeoutPraiseText: string
  retryButtonLabel: string
  successText: string
  continueButtonLabel: string
  retryAfterSuccessButtonLabel: string
  minSpawnDistancePercent: number
  spawnArea: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

export type HoldRules = {
  holdDurationMs: number
  progressLabel: string
  idleHint?: string
  resetHint: string
  successMessage: string
  buttonIdleLabel: string
  buttonHoldingLabel: string
  buttonSuccessLabel: string
}

export type ReactionRules = {
  cycleDurationMs: number
  sweetSpotStart: number
  sweetSpotEnd: number
  successDelayMs: number
  meterLabel: string
  actionButtonLabel: string
  idleMessage: string
  failMessage: string
  successMessage: string
}

export type MemoryRules = {
  cards: StageOption[]
  flipBackDelayMs: number
  matchedLabel: string
  idleHint?: string
  successMessage: string
  continueButtonLabel: string
  retryButtonLabel: string
}

export type TicTacToeRules = {
  playerSymbol: string
  botSymbol: string
  botSkill: number
  winMessage: string
  loseMessage: string
  drawMessage: string
  retryButtonLabel: string
  continueButtonLabel: string
}

export type StageBase = {
  id: number
  kind: StageKind
  title: string
  prompt: string
  rewardLabel: string
}

export type ChoiceStage = StageBase & {
  kind: 'choice'
  options: StageOption[]
  rules: ChoiceRules
}

export type TruthStage = StageBase & {
  kind: 'truth'
  statement: string
  trueButtonLabel: string
  falseButtonLabel: string
  rules: TruthRules
}

export type CatchStage = StageBase & {
  kind: 'catch'
  rules: CatchRules
  scoreLabel: string
  timeLabel: string
  secondsSuffix: string
  heartAriaLabel: string
}

export type PuzzleStage = StageBase & {
  kind: 'puzzle'
  words: string[]
  previewPlaceholder: string
  rules: PuzzleRules
}

export type HoldStage = StageBase & {
  kind: 'hold'
  rules: HoldRules
}

export type ReactionStage = StageBase & {
  kind: 'reaction'
  rules: ReactionRules
}

export type MemoryStage = StageBase & {
  kind: 'memory'
  rules: MemoryRules
}

export type TicTacToeStage = StageBase & {
  kind: 'tic_tac_toe'
  rules: TicTacToeRules
}

export type QuizStage =
  | ChoiceStage
  | TruthStage
  | CatchStage
  | PuzzleStage
  | HoldStage
  | ReactionStage
  | MemoryStage
  | TicTacToeStage

export type QuizScenarioConfig = {
  ui: {
    soundToggle: {
      onLabel: string
      offLabel: string
    }
    orientationOverlay: {
      message: string
    }
    stageTransitionDelayMs: number
    progress: {
      ariaLabel: string
      stageLabel: string
    }
  }
  home: {
    badge: string
    unlockGate?: {
      enabled: boolean
      code: string
      codeLength: number
      tagLabel: string
      codeInputLabel: string
      codeInputPlaceholder: string
      successMessage: string
      successDelayMs: number
    }
    title: string
    subtitle: string
    startButton: string
    startButtonPulse: boolean
  }
  final: {
    badge: string
    title: string
    message: string
    rewardButton: string
    rewardLine1: string
    rewardLine2: string
  }
  stages: QuizStage[]
}
