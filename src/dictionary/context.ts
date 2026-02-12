import { createContext } from 'react'
import { ukMessages } from './locales/uk'
import type { Locale, Messages } from './types'

export type DictionaryContextValue = {
  locale: Locale
  messages: Messages
}

export const dictionaries: Record<Locale, Messages> = {
  uk: ukMessages,
}

export const DictionaryContext = createContext<DictionaryContextValue | undefined>(undefined)
