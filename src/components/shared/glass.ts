import type { CSSProperties } from 'react'

export type GlassStyle = CSSProperties & Record<`--${string}`, string>

type GlassOptions = {
  angleMin?: number
  angleMax?: number
  alphaMin?: number
  alphaMax?: number
  accentAlphaMin?: number
  accentAlphaMax?: number
  blobAlphaMin?: number
  blobAlphaMax?: number
  blob2AlphaMin?: number
  blob2AlphaMax?: number
}

const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}

export const createRandomGlassStyle = (options: GlassOptions = {}): GlassStyle => {
  const {
    angleMin = 145,
    angleMax = 195,
    alphaMin = 0.24,
    alphaMax = 0.4,
    accentAlphaMin = 0.04,
    accentAlphaMax = 0.12,
    blobAlphaMin = 0.03,
    blobAlphaMax = 0.09,
    blob2AlphaMin = 0.02,
    blob2AlphaMax = 0.06,
  } = options

  return {
    '--glass-angle': `${Math.round(randomBetween(angleMin, angleMax))}deg`,
    '--glass-alpha': randomBetween(alphaMin, alphaMax).toFixed(2),
    '--glass-accent-alpha': randomBetween(accentAlphaMin, accentAlphaMax).toFixed(2),
    '--blob-x': `${Math.round(randomBetween(8, 78))}%`,
    '--blob-y': `${Math.round(randomBetween(8, 72))}%`,
    '--blob-size': `${Math.round(randomBetween(180, 300))}px`,
    '--blob-alpha': randomBetween(blobAlphaMin, blobAlphaMax).toFixed(2),
    '--blob2-x': `${Math.round(randomBetween(15, 85))}%`,
    '--blob2-y': `${Math.round(randomBetween(10, 85))}%`,
    '--blob2-size': `${Math.round(randomBetween(150, 260))}px`,
    '--blob2-alpha': randomBetween(blob2AlphaMin, blob2AlphaMax).toFixed(2),
  }
}
