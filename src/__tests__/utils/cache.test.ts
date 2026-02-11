import { getCached, setCache, buildCacheKey } from '../../utils/cache'

describe('cache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setCache / getCached', () => {
    it('stores and retrieves data', () => {
      setCache('test-key', { value: 42 })
      const result = getCached<{ value: number }>('test-key')
      expect(result).toEqual({ value: 42 })
    })

    it('returns null for non-existent key', () => {
      expect(getCached('no-key')).toBeNull()
    })

    it('returns null for expired data', () => {
      vi.useFakeTimers()
      setCache('expired', { value: 1 }, 1000)
      vi.advanceTimersByTime(2000)
      const result = getCached('expired')
      expect(result).toBeNull()
      vi.useRealTimers()
    })

    it('handles corrupted data gracefully', () => {
      localStorage.setItem('corrupt', 'not-json{{{')
      expect(getCached('corrupt')).toBeNull()
    })
  })

  describe('buildCacheKey', () => {
    it('creates a key from lat/lon', () => {
      const key = buildCacheKey(37.7749, -122.4194)
      expect(key).toBe('weather_37.77_-122.42')
    })

    it('rounds coordinates to 2 decimal places', () => {
      const key = buildCacheKey(40.123456, -74.987654)
      expect(key).toBe('weather_40.12_-74.99')
    })
  })
})
