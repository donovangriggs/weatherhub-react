import type { TemperatureUnit } from '../types/weather'
import { useLocalStorage } from './useLocalStorage'

export const useTemperatureUnit = () => {
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('tempUnit', 'celsius')
  const toggle = () => setUnit(unit === 'fahrenheit' ? 'celsius' : 'fahrenheit')
  return { unit, setUnit, toggle } as const
}
