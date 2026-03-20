import { renderHook, act } from '@testing-library/react'
import { useRecents } from '../../hooks/useRecents'
import type { Location } from '../../types/weather'

const makeLocation = (name: string, lat: number, lon: number): Location => ({
  name,
  region: '',
  country: 'Test',
  latitude: lat,
  longitude: lon,
})

describe('useRecents', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty list', () => {
    const { result } = renderHook(() => useRecents())
    expect(result.current.recents).toEqual([])
  })

  it('adds a recent location to the front', () => {
    const { result } = renderHook(() => useRecents())
    act(() => {
      result.current.addRecent(makeLocation('London', 51.5, -0.12))
    })
    act(() => {
      result.current.addRecent(makeLocation('Tokyo', 35.68, 139.69))
    })
    expect(result.current.recents[0].name).toBe('Tokyo')
    expect(result.current.recents[1].name).toBe('London')
  })

  it('deduplicates by moving re-selected location to top', () => {
    const { result } = renderHook(() => useRecents())
    act(() => {
      result.current.addRecent(makeLocation('London', 51.5, -0.12))
    })
    act(() => {
      result.current.addRecent(makeLocation('Tokyo', 35.68, 139.69))
    })
    act(() => {
      result.current.addRecent(makeLocation('London', 51.5, -0.12))
    })
    expect(result.current.recents).toHaveLength(2)
    expect(result.current.recents[0].name).toBe('London')
    expect(result.current.recents[1].name).toBe('Tokyo')
  })

  it('enforces max 5 limit', () => {
    const { result } = renderHook(() => useRecents())
    for (let i = 0; i < 7; i++) {
      act(() => {
        result.current.addRecent(makeLocation(`City${i}`, i, i))
      })
    }
    expect(result.current.recents).toHaveLength(5)
    expect(result.current.recents[0].name).toBe('City6')
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useRecents())
    act(() => {
      result.current.addRecent(makeLocation('London', 51.5, -0.12))
    })
    const stored = JSON.parse(localStorage.getItem('recents')!)
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('London')
  })

  it('restores from localStorage on mount', () => {
    const loc = makeLocation('London', 51.5, -0.12)
    localStorage.setItem('recents', JSON.stringify([loc]))
    const { result } = renderHook(() => useRecents())
    expect(result.current.recents).toHaveLength(1)
    expect(result.current.recents[0].name).toBe('London')
  })
})
