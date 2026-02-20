import { useState, useEffect, useCallback, useRef } from 'react'
import type { WeatherState, DayWeather } from '../types/weather'
import { fetchWeather, PAST_DAYS } from '../api/weatherApi'
import { reverseGeocode } from '../api/geocodingApi'
import { getCached, setCache, buildCacheKey } from '../utils/cache'
import { dispatchToast } from '../utils/toastEvents'
import { FALLBACK_LOCATION, getSavedLocation, saveLocation, getBrowserLocation } from '../utils/location'

const DEFAULT_DAY_INDEX = PAST_DAYS

export const useWeather = () => {
  const [weatherState, setWeatherState] = useState<WeatherState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState(getSavedLocation)
  const initRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const loadWeather = useCallback(async (loc: typeof FALLBACK_LOCATION) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    saveLocation(loc)
    const cacheKey = buildCacheKey(loc.latitude, loc.longitude)
    const cached = getCached<WeatherState>(cacheKey)
    if (cached) {
      setWeatherState(cached)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const raw = await fetchWeather(loc.latitude, loc.longitude, controller.signal)

      const days: DayWeather[] = raw.daily.time.map((date, i) => ({
        date,
        weatherCode: raw.daily.weather_code[i],
        temperatureMax: raw.daily.temperature_2m_max[i],
        temperatureMin: raw.daily.temperature_2m_min[i],
        sunrise: raw.daily.sunrise[i],
        sunset: raw.daily.sunset[i],
        precipitationSum: raw.daily.precipitation_sum[i],
        windSpeedMax: raw.daily.wind_speed_10m_max[i],
        uvIndexMax: raw.daily.uv_index_max[i],
      }))

      const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: raw.timezone })
      const todayIndex = days.findIndex((d) => d.date === todayStr)

      const state: WeatherState = {
        location: loc,
        current: raw.current,
        days,
        todayIndex: todayIndex >= 0 ? todayIndex : DEFAULT_DAY_INDEX,
        selectedDayIndex: todayIndex >= 0 ? todayIndex : DEFAULT_DAY_INDEX,
        timezone: raw.timezone,
        lastUpdated: new Date().toISOString(),
      }

      setWeatherState(state)
      setCache(cacheKey, state)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message = err instanceof Error ? err.message : 'Failed to load weather data'
      setError(message)
      dispatchToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Init: resolve location, then load weather
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    if (location) {
      void loadWeather(location)
      return
    }

    // No saved location — try browser geolocation, fall back to Cape Town
    void (async () => {
      try {
        const browserLoc = await getBrowserLocation()
        try {
          const named = await reverseGeocode(browserLoc.latitude, browserLoc.longitude)
          setLocation(named)
        } catch {
          setLocation(browserLoc)
        }
      } catch {
        setLocation(FALLBACK_LOCATION)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load weather when location changes after init
  useEffect(() => {
    if (!initRef.current || !location) return
    void loadWeather(location)
  }, [location, loadWeather])

  const selectDay = useCallback((index: number) => {
    setWeatherState((prev) => (prev ? { ...prev, selectedDayIndex: index } : prev))
  }, [])

  const changeLocation = useCallback((loc: typeof FALLBACK_LOCATION) => {
    setLocation(loc)
  }, [])

  const refresh = useCallback(() => {
    if (!location) return
    const cacheKey = buildCacheKey(location.latitude, location.longitude)
    localStorage.removeItem(cacheKey)
    void loadWeather(location)
  }, [location, loadWeather])

  return { weatherState, isLoading, error, selectDay, changeLocation, refresh }
}
