import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useTemperatureUnit } from '../hooks/useTemperatureUnit'
import { WeatherContext } from './weatherContextValue'

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const { weatherState, isLoading, error, selectDay, changeLocation, refresh } = useWeather()
  const { unit, setUnit, toggle: toggleUnit } = useTemperatureUnit()

  const value = useMemo(
    () => ({ weatherState, isLoading, error, unit, setUnit, toggleUnit, selectDay, changeLocation, refresh }),
    [weatherState, isLoading, error, unit, setUnit, toggleUnit, selectDay, changeLocation, refresh],
  )

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  )
}
