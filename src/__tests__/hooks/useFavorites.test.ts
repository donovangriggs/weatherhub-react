import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../../hooks/useFavorites'
import type { Location } from '../../types/weather'

const makeLocation = (name: string, lat: number, lon: number): Location => ({
  name,
  region: '',
  country: 'Test',
  latitude: lat,
  longitude: lon,
})

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty list', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('adds a favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite(makeLocation('London', 51.5, -0.12))
    })
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].name).toBe('London')
  })

  it('removes a favorite by lat/lon', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite(makeLocation('London', 51.5, -0.12))
      result.current.addFavorite(makeLocation('Tokyo', 35.68, 139.69))
    })
    act(() => {
      result.current.removeFavorite(makeLocation('London', 51.5, -0.12))
    })
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].name).toBe('Tokyo')
  })

  it('enforces max 5 limit', () => {
    const { result } = renderHook(() => useFavorites())
    for (let i = 0; i < 6; i++) {
      act(() => {
        result.current.addFavorite(makeLocation(`City${i}`, i, i))
      })
    }
    expect(result.current.favorites).toHaveLength(5)
  })

  it('returns false when adding beyond max', () => {
    const { result } = renderHook(() => useFavorites())
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.addFavorite(makeLocation(`City${i}`, i, i))
      })
    }
    let added = false
    act(() => {
      added = result.current.addFavorite(makeLocation('City5', 5, 5))
    })
    expect(added).toBe(false)
  })

  it('prevents duplicate locations', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite(makeLocation('London', 51.5, -0.12))
    })
    let added = false
    act(() => {
      added = result.current.addFavorite(makeLocation('London', 51.5, -0.12))
    })
    expect(added).toBe(false)
    expect(result.current.favorites).toHaveLength(1)
  })

  it('reports isFavorite correctly', () => {
    const { result } = renderHook(() => useFavorites())
    const loc = makeLocation('London', 51.5, -0.12)
    expect(result.current.isFavorite(loc)).toBe(false)
    act(() => {
      result.current.addFavorite(loc)
    })
    expect(result.current.isFavorite(loc)).toBe(true)
  })

  it('toggleFavorite adds then removes', () => {
    const { result } = renderHook(() => useFavorites())
    const loc = makeLocation('London', 51.5, -0.12)
    act(() => {
      result.current.toggleFavorite(loc)
    })
    expect(result.current.isFavorite(loc)).toBe(true)
    act(() => {
      result.current.toggleFavorite(loc)
    })
    expect(result.current.isFavorite(loc)).toBe(false)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite(makeLocation('London', 51.5, -0.12))
    })
    const stored = JSON.parse(localStorage.getItem('favorites')!)
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('London')
  })

  it('restores from localStorage on mount', () => {
    const loc = makeLocation('London', 51.5, -0.12)
    localStorage.setItem('favorites', JSON.stringify([loc]))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].name).toBe('London')
  })
})
