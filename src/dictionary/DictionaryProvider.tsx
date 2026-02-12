import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { DictionaryContext, dictionaries } from './context'
import type { DictionaryContextValue } from './context'
import type { Locale } from './types'

type DictionaryProviderProps = {
  children: ReactNode
  locale?: Locale
}

export const DictionaryProvider = ({ children, locale = 'uk' }: DictionaryProviderProps) => {
  const messages = dictionaries[locale]

  const value = useMemo<DictionaryContextValue>(
    () => ({
      locale,
      messages,
    }),
    [locale, messages],
  )

  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>
}
