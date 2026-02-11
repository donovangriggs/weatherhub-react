import type { OpenMeteoForecastResponse } from '../types/weather'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export const PAST_DAYS = 3
const FORECAST_DAYS = 4

export const fetchWeather = async (
  latitude: number,
  longitude: number,
): Promise<OpenMeteoForecastResponse> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'weather_code',
      'wind_speed_10m',
      'relative_humidity_2m',
      'apparent_temperature',
      'uv_index',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'wind_speed_10m_max',
      'uv_index_max',
    ].join(','),
    past_days: String(PAST_DAYS),
    forecast_days: String(FORECAST_DAYS),
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
  })

  const response = await fetch(`${BASE_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<OpenMeteoForecastResponse>
}
