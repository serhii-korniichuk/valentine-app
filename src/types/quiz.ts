export type StageKind =
  | 'choice'
  | 'truth'
  | 'catch'
  | 'preference'
  | 'date'
  | 'puzzle'
  | 'audio'

export interface StageBase {
  id: number
  kind: StageKind
  title: string
  prompt: string
  rewardLabel: string
}

export interface ChoiceStage extends StageBase {
  kind: 'choice'
  options: string[]
}

export interface TruthStage extends StageBase {
  kind: 'truth'
  statement: string
}

export interface CatchStage extends StageBase {
  kind: 'catch'
  target: number
}

export interface PreferenceStage extends StageBase {
  kind: 'preference'
  options: string[]
  helper: string
}

export interface DateStage extends StageBase {
  kind: 'date'
  hint: string
}

export interface PuzzleStage extends StageBase {
  kind: 'puzzle'
  words: string[]
  targetPhrase: string
}

export interface AudioStage extends StageBase {
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
