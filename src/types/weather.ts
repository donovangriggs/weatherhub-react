export interface OpenMeteoForecastResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: CurrentUnits
  current: CurrentWeather
  daily_units: DailyUnits
  daily: DailyWeather
}

export interface CurrentUnits {
  time: string
  interval: string
  temperature_2m: string
  weather_code: string
  wind_speed_10m: string
  relative_humidity_2m: string
  apparent_temperature: string
  uv_index: string
}

export interface CurrentWeather {
  time: string
  interval: number
  temperature_2m: number
  weather_code: number
  wind_speed_10m: number
  relative_humidity_2m: number
  apparent_temperature: number
  uv_index: number
}

export interface DailyUnits {
  time: string
  temperature_2m_max: string
  temperature_2m_min: string
  weather_code: string
  sunrise: string
  sunset: string
  precipitation_sum: string
  wind_speed_10m_max: string
  uv_index_max: string
}

export interface DailyWeather {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weather_code: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
  uv_index_max: number[]
}

export interface DayWeather {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  sunrise: string
  sunset: string
  precipitationSum: number
  windSpeedMax: number
  uvIndexMax: number
}

export type TemperatureUnit = 'fahrenheit' | 'celsius'

export interface Location {
  name: string
  region: string
  country: string
  latitude: number
  longitude: number
}

export interface WeatherState {
  location: Location
  current: CurrentWeather
  days: DayWeather[]
  todayIndex: number
  selectedDayIndex: number
  timezone: string
  lastUpdated: string
}
