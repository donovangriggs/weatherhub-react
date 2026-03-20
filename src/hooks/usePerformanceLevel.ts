import { useState, useEffect } from 'react'

type PerformanceLevel = 0 | 1 | 2

export const sampleFrameRate = (onResult: (level: PerformanceLevel) => void): void => {
  let frameCount = 0
  let startTime = 0
  let rafId = 0

  const tick = (timestamp: number) => {
    if (frameCount === 0) {
      startTime = timestamp
    }
    frameCount++

    if (frameCount >= 60) {
      const elapsed = timestamp - startTime
      const avgFps = (60 / elapsed) * 1000
      onResult(avgFps < 30 ? 1 : 2)
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  // Safety cleanup after 5 seconds in case frames never complete
  setTimeout(() => {
    if (frameCount < 60) {
      cancelAnimationFrame(rafId)
      onResult(1)
    }
  }, 5000)
}

export const usePerformanceLevel = (): { level: PerformanceLevel } => {
  const [level, setLevel] = useState<PerformanceLevel>(() => {
    if (typeof window === 'undefined') return 2
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2
  })

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (e: MediaQueryListEvent) => {
      setLevel(e.matches ? 0 : 2)
    }

    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return { level }
}
