export type StageKind =
  | 'choice'
  | 'truth'
  | 'catch'
  | 'preference'
  | 'date'
  | 'puzzle'
  | 'audio'

export type StageBase = {
  id: number
  kind: StageKind
  title: string
  prompt: string
  rewardLabel: string
}

export type ChoiceStage = StageBase & {
  kind: 'choice'
  options: string[]
}

export type TruthStage = StageBase & {
  kind: 'truth'
  statement: string
}

export type CatchStage = StageBase & {
  kind: 'catch'
  target: number
}

export type PreferenceStage = StageBase & {
  kind: 'preference'
  options: string[]
  helper: string
}

export type DateStage = StageBase & {
  kind: 'date'
  hint: string
}

export type PuzzleStage = StageBase & {
  kind: 'puzzle'
  words: string[]
  targetPhrase: string
}

export type AudioStage = StageBase & {
  kind: 'audio'
  caption: string
}

export type QuizStage =
  | ChoiceStage
  | TruthStage
  | CatchStage
  | PreferenceStage
  | DateStage
  | PuzzleStage
  | AudioStage
