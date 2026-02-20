import { useState, useEffect, useRef } from 'react'
import type { GeocodingResult } from '../types/geocoding'
import { searchCities } from '../api/geocodingApi'
import { dispatchToast } from '../utils/toastEvents'

export const useGeocoding = (query: string, debounceMs = 350) => {
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)

    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const data = await searchCities(query, controller.signal)
        if (!controller.signal.aborted) {
          setResults(data)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (!controller.signal.aborted) {
          setResults([])
          dispatchToast('City search failed — please try again', 'error')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
      setIsLoading(false)
    }
  }, [query, debounceMs])

  return { results, isLoading }
}
