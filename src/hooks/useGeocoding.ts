import { useState, useEffect, useRef } from 'react'
import type { GeocodingResult } from '../types/geocoding'
import { searchCities } from '../api/geocodingApi'

export const useGeocoding = (query: string, debounceMs = 350) => {
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const currentRequestId = ++requestIdRef.current

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query)
        if (currentRequestId === requestIdRef.current) {
          setResults(data)
        }
      } catch {
        if (currentRequestId === requestIdRef.current) {
          setResults([])
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
      setIsLoading(false)
    }
  }, [query, debounceMs])

  return { results, isLoading }
}
