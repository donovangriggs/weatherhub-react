import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'

interface DawnLoadingScreenProps {
  readonly onComplete?: () => void
}

// Match the main app background gradient
const BG_TOP = '#0a1628'
const BG_MID = '#122a4a'
const BG_BOTTOM = '#1a3a5c'
const GRADIENT = `linear-gradient(180deg, ${BG_TOP}, ${BG_MID}, ${BG_BOTTOM})`

const MIN_DURATION_MS = 1500
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const CloudIcon = () => (
  <svg width="28" height="28" viewBox="0 -960 960 960" fill="white">
    <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z" />
  </svg>
)

export const DawnLoadingScreen = ({ onComplete }: DawnLoadingScreenProps) => {
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )
  const [animationComplete, setAnimationComplete] = useState(false)

  const handleAnimationEnd = useCallback(() => {
    setAnimationComplete(true)
  }, [])

  useEffect(() => {
    if (!animationComplete) return
    onComplete?.()
  }, [animationComplete, onComplete])

  useEffect(() => {
    // Auto-complete after minimum duration
    const timer = setTimeout(() => setAnimationComplete(true), MIN_DURATION_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: GRADIENT }}
    >
      {/* Logo + text */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
        onAnimationComplete={handleAnimationEnd}
      >
        <div className="bg-primary rounded-2xl flex items-center justify-center w-12 h-12">
          <CloudIcon />
        </div>
        <span
          className="text-xl font-bold tracking-tight text-slate-100"
          style={{ fontFamily: 'system-ui' }}
        >
          Weather<span className="text-primary">Hub</span>
        </span>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mt-4" />
      </motion.div>
    </div>
  )
}
