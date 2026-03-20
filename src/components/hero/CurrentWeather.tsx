import { useMemo } from 'react'
import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from '../ui/MaterialIcon'
import { FavoriteButton } from '../ui/FavoriteButton'
import { getWeatherInfo } from '../../utils/weatherCodeMap'
import { formatFullDate, formatTime } from '../../utils/dateFormatting'
import { formatTemperature, fahrenheitToCelsius } from '../../utils/temperatureConversion'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'

const getTempWeight = (fahrenheit: number): number => {
  if (fahrenheit < 0) return 300
  if (fahrenheit < 40) return 300 + ((fahrenheit / 40) * 100)
  if (fahrenheit < 70) return 400 + (((fahrenheit - 40) / 30) * 100)
  if (fahrenheit < 90) return 500 + (((fahrenheit - 70) / 20) * 100)
  return 700
}

const getTempTint = (fahrenheit: number): string | undefined => {
  if (fahrenheit < 0) return '#93c5fd'
  if (fahrenheit > 90) return '#fbbf24'
  return undefined
}

const AnimatedTemp = ({ value, className, fahrenheit }: { value: number; className?: string; fahrenheit: number }) => {
  const display = useAnimatedNumber(value)
  const weight = useMemo(() => Math.round(getTempWeight(fahrenheit)), [fahrenheit])
  const tint = useMemo(() => getTempTint(fahrenheit), [fahrenheit])
  return (
    <span
      className={className}
      style={{ fontWeight: weight, color: tint, fontVariantNumeric: 'tabular-nums', transition: 'font-weight 0.4s ease, color 0.4s ease' }}
    >
      {display}°
    </span>
  )
}

export const CurrentWeather = ({ compact = false }: { compact?: boolean }) => {
  const { weatherState, unit } = useWeatherContext()
  if (!weatherState) return null

  const { location, current, days, selectedDayIndex, todayIndex } = weatherState
  const selectedDay = days[selectedDayIndex]
  if (!selectedDay) return null
  const isCurrentDay = selectedDayIndex === todayIndex

  const mainTemp = isCurrentDay ? current.temperature_2m : selectedDay.temperatureMax
  const displayValue = unit === 'celsius' ? fahrenheitToCelsius(mainTemp) : Math.round(mainTemp)
  const { description, icon } = getWeatherInfo(selectedDay.weatherCode)

  const dateStr = isCurrentDay
    ? `${formatFullDate(selectedDay.date)} • ${formatTime(current.time)}`
    : formatFullDate(selectedDay.date)

  if (compact) {
    return (
      <div className="relative z-10">
        <div className="flex items-center gap-1 text-primary mb-1 font-medium">
          <MaterialIcon name="location_on" className="text-xs" />
          <span className="uppercase tracking-widest text-[10px] truncate">
            {location.name}
            {location.region ? `, ${location.region}` : ''}
          </span>
          <FavoriteButton location={location} size="sm" />
        </div>
        <h1 className="text-5xl tracking-tighter">
          <AnimatedTemp value={displayValue} fahrenheit={mainTemp} />
        </h1>
        <p className="text-sm text-slate-200 mt-1">{description}</p>
        <p className="text-xs text-slate-300 mt-0.5">
          H: {formatTemperature(selectedDay.temperatureMax, unit)} L: {formatTemperature(selectedDay.temperatureMin, unit)}
        </p>
      </div>
    )
  }

  return (
    <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
      <div className="flex items-center gap-2 text-primary mb-2 font-medium">
        <MaterialIcon name="location_on" className="text-sm" />
        <span className="uppercase tracking-widest text-xs">
          {location.name}
          {location.region ? `, ${location.region}` : ''}
        </span>
        <FavoriteButton location={location} />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-8xl lg:text-9xl tracking-tighter">
          <AnimatedTemp value={displayValue} fahrenheit={mainTemp} />
        </h1>
        <span className="material-symbols-outlined text-slate-300/60" style={{ fontSize: '32px' }} aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
        <span className="text-2xl font-medium text-slate-200">{description}</span>
        <span className="w-2 h-2 rounded-full bg-slate-600" />
        <span className="text-xl">
          H: {formatTemperature(selectedDay.temperatureMax, unit)} L: {formatTemperature(selectedDay.temperatureMin, unit)}
        </span>
      </div>
      <p className="mt-4 text-slate-300 font-medium">{dateStr}</p>
    </div>
  )
}
