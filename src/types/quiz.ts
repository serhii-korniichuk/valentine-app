export type StageKind =
  | 'choice'
  | 'truth'
  | 'catch'
  | 'preference'
  | 'date'
  | 'puzzle'
  | 'audio'

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

export type DateRules = {
  acceptedAnswers: string[]
  normalize: 'trim_lower' | 'exact'
  incorrectMessage: string
}

export type PuzzleRules = {
  acceptedPhrases: string[]
  normalize: 'trim_lower' | 'exact'
  incorrectMessage: string
}

export type CatchRules = {
  target: number
  durationSec: number
  allowRetryAfterTimeout: boolean
  timeoutPraiseText: string
  retryButtonLabel: string
}

export type AudioRules = {
  requirePlayBeforeContinue: boolean
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

export type PreferenceStage = StageBase & {
  kind: 'preference'
  options: StageOption[]
  helper: string
  rules: ChoiceRules
}

export type DateStage = StageBase & {
  kind: 'date'
  hint: string
  placeholder: string
  submitButtonLabel: string
  rules: DateRules
}

export type PuzzleStage = StageBase & {
  kind: 'puzzle'
  words: string[]
  previewPlaceholder: string
  rules: PuzzleRules
}

export type AudioStage = StageBase & {
  kind: 'audio'
  caption: string
  playButtonLabel: string
  continueButtonLabel: string
  rules: AudioRules
}

export type QuizStage =
  | ChoiceStage
  | TruthStage
  | CatchStage
  | PreferenceStage
  | DateStage
  | PuzzleStage
  | AudioStage

export type QuizScenarioConfig = {
  ui: {
    soundToggle: {
      onLabel: string
      offLabel: string
    }
    stageTransitionDelayMs: number
    progress: {
      ariaLabel: string
      stageLabel: string
    }
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
  stages: QuizStage[]
}
