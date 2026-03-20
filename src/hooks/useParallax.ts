import { useEffect, useRef, useCallback } from 'react'

const MOBILE_BREAKPOINT = 768

const shouldDisable = (): boolean =>
  window.innerWidth < MOBILE_BREAKPOINT ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useParallax = (): { parallaxRef: React.RefObject<HTMLDivElement | null> } => {
  const parallaxRef = useRef<HTMLDivElement | null>(null)
  const rafId = useRef(0)
  const isDisabled = useRef(shouldDisable())

  const applyParallax = useCallback(() => {
    const el = parallaxRef.current
    if (!el || isDisabled.current) return

    const scrollY = window.scrollY
    el.style.setProperty('--parallax-sky', `${scrollY * 0.3}px`)
    el.style.setProperty('--parallax-scene', `${scrollY * 0.6}px`)
  }, [])

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(applyParallax)
  }, [applyParallax])

  const handleResize = useCallback(() => {
    const disabled = shouldDisable()
    isDisabled.current = disabled

    if (disabled) {
      const el = parallaxRef.current
      if (el) {
        el.style.removeProperty('--parallax-sky')
        el.style.removeProperty('--parallax-scene')
      }
    }
  }, [])

  useEffect(() => {
    const el = parallaxRef.current
    if (el) {
      el.style.willChange = 'transform'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId.current)
      if (el) {
        el.style.willChange = ''
        el.style.removeProperty('--parallax-sky')
        el.style.removeProperty('--parallax-scene')
      }
    }
  }, [handleScroll, handleResize])

  return { parallaxRef }
}
