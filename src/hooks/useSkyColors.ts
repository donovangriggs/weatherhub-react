import { useState, useEffect, useCallback, useRef } from 'react'
import type { SkyColors, TimeOfDay } from '../utils/skyPalette'
import { getTimeOfDay, SKY_PALETTES, interpolateColors } from '../utils/skyPalette'

const TIME_STATES: readonly TimeOfDay[] = [
  'dawn', 'morning', 'day', 'goldenHour', 'dusk', 'night', 'midnight',
] as const

interface UseSkyColorsOptions {
  readonly timezone: string
  readonly sunrise: string
  readonly sunset: string
}

const getNextTimeState = (current: TimeOfDay): TimeOfDay => {
  const idx = TIME_STATES.indexOf(current)
  return TIME_STATES[(idx + 1) % TIME_STATES.length]
}

const getCurrentTimeInTimezone = (timezone: string): Date => {
  try {
    const formatted = new Date().toLocaleString('en-US', { timeZone: timezone })
    return new Date(formatted)
  } catch {
    return new Date()
  }
}

const getDefaultSunTimes = (now: Date): { sunrise: string; sunset: string } => {
  const sunrise = new Date(now)
  sunrise.setHours(6, 0, 0, 0)
  const sunset = new Date(now)
  sunset.setHours(18, 0, 0, 0)
  return { sunrise: sunrise.toISOString(), sunset: sunset.toISOString() }
}

const computeInterpolationFactor = (
  now: Date,
  sunrise: string,
  sunset: string,
  timezone: string,
  current: TimeOfDay,
): number => {
  const next = getNextTimeState(current)
  const currentColors = SKY_PALETTES[current]
  const nextColors = SKY_PALETTES[next]
  if (currentColors === nextColors) return 0

  const minuteInMs = 60_000
  const step = 5 * minuteInMs
  let transitionPoint = now.getTime()

  for (let offset = step; offset <= 3_600_000 * 4; offset += step) {
    const futureDate = new Date(now.getTime() + offset)
    const futureState = getTimeOfDay(futureDate, sunrise, sunset, timezone)
    if (futureState !== current) {
      transitionPoint = now.getTime() + offset
      break
    }
  }

  const remaining = transitionPoint - now.getTime()
  const transitionWindow = 30 * minuteInMs
  if (remaining > transitionWindow) return 0
  return 1 - remaining / transitionWindow
}

const computeTimeLapseColors = (progress: number): { colors: SkyColors; state: TimeOfDay } => {
  const totalStates = TIME_STATES.length
  const scaledProgress = Math.max(0, Math.min(1, progress)) * totalStates
  const stateIndex = Math.min(Math.floor(scaledProgress), totalStates - 1)
  const nextIndex = (stateIndex + 1) % totalStates
  const factor = scaledProgress - stateIndex

  const currentState = TIME_STATES[stateIndex]
  const nextState = TIME_STATES[nextIndex]

  return {
    colors: interpolateColors(SKY_PALETTES[currentState], SKY_PALETTES[nextState], factor),
    state: currentState,
  }
}

export const useSkyColors = (options: UseSkyColorsOptions) => {
  const { timezone, sunrise, sunset } = options
  const [skyColors, setSkyColors] = useState<SkyColors>(SKY_PALETTES.day)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day')
  const timeLapseRef = useRef<number | null>(null)

  const setTimeLapseProgress = useCallback((progress: number | null) => {
    timeLapseRef.current = progress
    if (progress !== null) {
      const result = computeTimeLapseColors(progress)
      setSkyColors(result.colors)
      setTimeOfDay(result.state)
    }
  }, [])

  const update = useCallback(() => {
    if (timeLapseRef.current !== null) return

    const now = getCurrentTimeInTimezone(timezone)
    const safeSunrise = sunrise || getDefaultSunTimes(now).sunrise
    const safeSunset = sunset || getDefaultSunTimes(now).sunset
    const current = getTimeOfDay(now, safeSunrise, safeSunset, timezone)
    const factor = computeInterpolationFactor(now, safeSunrise, safeSunset, timezone, current)
    const next = getNextTimeState(current)

    setTimeOfDay(current)
    setSkyColors(interpolateColors(SKY_PALETTES[current], SKY_PALETTES[next], factor))
  }, [timezone, sunrise, sunset])

  useEffect(() => {
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [update])

  // When time-lapse ends, immediately recalculate real sky
  const prevTimeLapseRef = useRef<number | null>(null)
  useEffect(() => {
    if (prevTimeLapseRef.current !== null && timeLapseRef.current === null) {
      update()
    }
    prevTimeLapseRef.current = timeLapseRef.current
  })

  return { skyColors, timeOfDay, setTimeLapseProgress } as const
}
