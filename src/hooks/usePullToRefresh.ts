import { useRef, useState } from 'react'
import type { PointerEvent, RefObject } from 'react'

type UsePullToRefreshOptions = {
  threshold?: number
  maxPullDistance?: number
  dragDamping?: number
  reloadDelayMs?: number
}

type UsePullToRefreshResult = {
  shellRef: RefObject<HTMLElement | null>
  pullDistance: number
  pullThreshold: number
  pullProgress: number
  isRefreshing: boolean
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerUp: () => void
  onPointerCancel: () => void
}

const DEFAULT_THRESHOLD = 56
const DEFAULT_MAX_PULL = 88
const DEFAULT_DRAG_DAMPING = 0.42
const DEFAULT_RELOAD_DELAY = 620
const TOP_TOLERANCE_PX = 4

export const usePullToRefresh = (options: UsePullToRefreshOptions = {}): UsePullToRefreshResult => {
  const pullThreshold = options.threshold ?? DEFAULT_THRESHOLD
  const maxPullDistance = options.maxPullDistance ?? DEFAULT_MAX_PULL
  const dragDamping = options.dragDamping ?? DEFAULT_DRAG_DAMPING
  const reloadDelayMs = options.reloadDelayMs ?? DEFAULT_RELOAD_DELAY

  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const shellRef = useRef<HTMLElement | null>(null)
  const dragStartYRef = useRef(0)
  const pullEligibleRef = useRef(false)

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (isRefreshing || !event.isPrimary) {
      pullEligibleRef.current = false
      return
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      pullEligibleRef.current = false
      return
    }

    const shell = shellRef.current
    if (!shell || shell.scrollTop > TOP_TOLERANCE_PX) {
      pullEligibleRef.current = false
      return
    }

    pullEligibleRef.current = true
    dragStartYRef.current = event.clientY
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!pullEligibleRef.current || isRefreshing) {
      return
    }

    if (event.pointerType === 'mouse' && (event.buttons & 1) !== 1) {
      return
    }

    const delta = event.clientY - dragStartYRef.current
    if (delta <= 0) {
      setPullDistance(0)
      return
    }

    const shell = shellRef.current
    if (shell && shell.scrollTop > TOP_TOLERANCE_PX) {
      setPullDistance(0)
      return
    }

    event.preventDefault()
    setPullDistance(Math.min(maxPullDistance, delta * dragDamping))
  }

  const finishPull = () => {
    if (!pullEligibleRef.current || isRefreshing) {
      return
    }

    pullEligibleRef.current = false

    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true)
      setPullDistance(pullThreshold)
      window.setTimeout(() => {
        window.location.reload()
      }, reloadDelayMs)
      return
    }

    setPullDistance(0)
  }

  return {
    shellRef,
    pullDistance,
    pullThreshold,
    pullProgress: Math.min(1, pullDistance / pullThreshold),
    isRefreshing,
    onPointerDown,
    onPointerMove,
    onPointerUp: finishPull,
    onPointerCancel: finishPull,
  }
}
