import { useCallback, useRef, useState } from 'react'

type SoundType = 'tap' | 'success' | 'celebration'

const NOTE_PRESETS: Record<SoundType, number[]> = {
  tap: [440],
  success: [523.25, 659.25, 783.99],
  celebration: [523.25, 659.25, 783.99, 1046.5],
}

export function useSound() {
  const [enabled, setEnabled] = useState(true)
  const contextRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (contextRef.current) {
      return contextRef.current
    }

    if (typeof window === 'undefined' || !window.AudioContext) {
      return null
    }

    contextRef.current = new window.AudioContext()
    return contextRef.current
  }, [])

  const unlock = useCallback(async () => {
    const context = getContext()
    if (!context) {
      return
    }

    if (context.state === 'suspended') {
      await context.resume()
    }
  }, [getContext])

  const play = useCallback(
    async (type: SoundType) => {
      if (!enabled) {
        return
      }

      const context = getContext()
      if (!context) {
        return
      }

      if (context.state === 'suspended') {
        await context.resume()
      }

      const start = context.currentTime
      NOTE_PRESETS[type].forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const gainNode = context.createGain()
        oscillator.type = type === 'tap' ? 'triangle' : 'sine'
        oscillator.frequency.value = frequency

        const toneStart = start + index * 0.1
        const toneEnd = toneStart + 0.14

        gainNode.gain.setValueAtTime(0.0001, toneStart)
        gainNode.gain.exponentialRampToValueAtTime(0.09, toneStart + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, toneEnd)

        oscillator.connect(gainNode)
        gainNode.connect(context.destination)

        oscillator.start(toneStart)
        oscillator.stop(toneEnd)
      })
    },
    [enabled, getContext],
  )

  return {
    enabled,
    setEnabled,
    unlock,
    play,
  }
}
