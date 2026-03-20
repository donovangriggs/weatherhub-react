import { createContext, useContext } from 'react'
import type { WeatherState, Location, TemperatureUnit } from '../types/weather'

export interface WeatherContextValue {
  weatherState: WeatherState | null
  isLoading: boolean
  error: string | null
  unit: TemperatureUnit
  setUnit: (u: TemperatureUnit) => void
  toggleUnit: () => void
  selectDay: (index: number) => void
  changeLocation: (loc: Location) => void
  refresh: () => void
  favorites: Location[]
  addFavorite: (loc: Location) => boolean
  removeFavorite: (loc: Location) => void
  isFavorite: (loc: Location) => boolean
  toggleFavorite: (loc: Location) => void
  recents: Location[]
}

export const WeatherContext = createContext<WeatherContextValue | null>(null)

export const useWeatherContext = (): WeatherContextValue => {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider')
  return ctx
}
