interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  version?: number
}

const DEFAULT_TTL = 15 * 60 * 1000 // 15 minutes
const CACHE_VERSION = 2

export const getCached = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (entry.version !== CACHE_VERSION || Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export const setCache = <T>(key: string, data: T, ttl: number = DEFAULT_TTL): void => {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl, version: CACHE_VERSION }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // localStorage full or unavailable
  }
}

export const buildCacheKey = (lat: number, lon: number): string => {
  return `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`
}
