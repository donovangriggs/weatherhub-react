import { useCallback } from 'react'
import type { Location } from '../types/weather'
import { useLocalStorage } from './useLocalStorage'

const MAX_FAVORITES = 5

const isSameLocation = (a: Location, b: Location) =>
  a.latitude === b.latitude && a.longitude === b.longitude

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<Location[]>('favorites', [])

  const isFavorite = useCallback(
    (location: Location) => favorites.some((f) => isSameLocation(f, location)),
    [favorites],
  )

  const addFavorite = useCallback(
    (location: Location) => {
      if (favorites.length >= MAX_FAVORITES) return false
      if (favorites.some((f) => isSameLocation(f, location))) return false
      setFavorites([...favorites, location])
      return true
    },
    [favorites, setFavorites],
  )

  const removeFavorite = useCallback(
    (location: Location) => {
      setFavorites(favorites.filter((f) => !isSameLocation(f, location)))
    },
    [favorites, setFavorites],
  )

  const toggleFavorite = useCallback(
    (location: Location) => {
      if (isFavorite(location)) {
        removeFavorite(location)
      } else {
        addFavorite(location)
      }
    },
    [isFavorite, removeFavorite, addFavorite],
  )

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite } as const
}
