import type { TemperatureUnit } from '../types/weather'

export const fahrenheitToCelsius = (f: number): number => {
  return Math.round(((f - 32) * 5) / 9)
}

export const celsiusToFahrenheit = (c: number): number => {
  return Math.round((c * 9) / 5 + 32)
}

export const mphToKmh = (mph: number): number => {
  return Math.round(mph * 1.60934)
}

export const inchesToMm = (inches: number): number => {
  return Math.round(inches * 25.4 * 10) / 10
}

export const formatTemperature = (f: number, unit: TemperatureUnit): string => {
  const val = unit === 'celsius' ? fahrenheitToCelsius(f) : Math.round(f)
  return `${val}°`
}
