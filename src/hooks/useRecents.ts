import { useCallback } from 'react'
import type { Location } from '../types/weather'
import { useLocalStorage } from './useLocalStorage'

const MAX_RECENTS = 5

const isSameLocation = (a: Location, b: Location) =>
  a.latitude === b.latitude && a.longitude === b.longitude

export const useRecents = () => {
  const [recents, setRecents] = useLocalStorage<Location[]>('recents', [])

  const addRecent = useCallback(
    (location: Location) => {
      const filtered = recents.filter((r) => !isSameLocation(r, location))
      setRecents([location, ...filtered].slice(0, MAX_RECENTS))
    },
    [recents, setRecents],
  )

  return { recents, addRecent } as const
}
