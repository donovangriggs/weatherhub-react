import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePerformanceLevel } from '../../hooks/usePerformanceLevel'

describe('usePerformanceLevel', () => {
  let changeListener: ((e: MediaQueryListEvent) => void) | null = null

  const mockMatchMedia = (matches: boolean) => {
    changeListener = null
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches,
      addEventListener: vi.fn((_event: string, cb: (e: MediaQueryListEvent) => void) => {
        changeListener = cb
      }),
      removeEventListener: vi.fn(),
    })))
  }

  beforeEach(() => {
    changeListener = null
  })

  it('returns level 0 when prefers-reduced-motion matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => usePerformanceLevel())
    expect(result.current.level).toBe(0)
  })

  it('returns level 2 when prefers-reduced-motion does not match', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => usePerformanceLevel())
    expect(result.current.level).toBe(2)
  })

  it('updates level when media query changes', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => usePerformanceLevel())
    expect(result.current.level).toBe(2)

    // Simulate the media query changing to prefer reduced motion
    act(() => {
      if (changeListener) {
        changeListener({ matches: true } as MediaQueryListEvent)
      }
    })
    expect(result.current.level).toBe(0)

    // Simulate changing back
    act(() => {
      if (changeListener) {
        changeListener({ matches: false } as MediaQueryListEvent)
      }
    })
    expect(result.current.level).toBe(2)
  })
})
