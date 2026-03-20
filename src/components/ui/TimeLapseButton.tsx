import { useState, useRef, useCallback, useEffect } from 'react'

const DURATION_MS = 10_000
const CIRCLE_CIRCUMFERENCE = 283 // 2 * PI * 45 (radius)

interface TimeLapseButtonProps {
  onProgressChange: (progress: number | null) => void
  disabled?: boolean
}

export const TimeLapseButton = ({ onProgressChange, disabled = false }: TimeLapseButtonProps) => {
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startTimeRef.current = null
    setPlaying(false)
    setProgress(0)
    onProgressChange(null)
  }, [onProgressChange])

  const tick = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }
    const elapsed = timestamp - startTimeRef.current
    const currentProgress = Math.min(elapsed / DURATION_MS, 1)

    setProgress(currentProgress)
    onProgressChange(currentProgress)

    if (currentProgress < 1) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      stopAnimation()
    }
  }, [onProgressChange, stopAnimation])

  const handleClick = useCallback(() => {
    if (disabled) return
    if (playing) {
      stopAnimation()
    } else {
      setPlaying(true)
      setProgress(0)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [disabled, playing, stopAnimation, tick])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  if (prefersReducedMotion) return null

  const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress)

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={playing ? 'Pause time-lapse' : 'Play 24-hour time-lapse'}
      className={`fixed bottom-6 right-6 z-20 flex items-center justify-center
        rounded-full glass cursor-pointer
        w-11 h-11 sm:w-12 sm:h-12
        transition-colors hover:bg-white/8
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {playing && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2b8cee"
            strokeWidth="2"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className="material-symbols-outlined text-xl text-white/80">
        {playing ? 'pause' : 'timelapse'}
      </span>
    </button>
  )
}
