import { useMemo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useTemperatureUnit } from '../hooks/useTemperatureUnit'
import { useFavorites } from '../hooks/useFavorites'
import { useRecents } from '../hooks/useRecents'
import { WeatherContext } from './weatherContextValue'

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const { weatherState, isLoading, error, selectDay, changeLocation, refresh } = useWeather()
  const { unit, setUnit, toggle: toggleUnit } = useTemperatureUnit()
  const { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite } = useFavorites()
  const { recents, addRecent } = useRecents()

  // Track successful location views in recents
  const prevLocationRef = useRef<string | null>(null)
  useEffect(() => {
    if (!weatherState || isLoading) return
    const key = `${weatherState.location.latitude},${weatherState.location.longitude}`
    if (key === prevLocationRef.current) return
    prevLocationRef.current = key
    addRecent(weatherState.location)
  }, [weatherState, isLoading, addRecent])

  const value = useMemo(
    () => ({
      weatherState, isLoading, error, unit, setUnit, toggleUnit, selectDay, changeLocation, refresh,
      favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, recents,
    }),
    [
      weatherState, isLoading, error, unit, setUnit, toggleUnit, selectDay, changeLocation, refresh,
      favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, recents,
    ],
  )

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  )
}
