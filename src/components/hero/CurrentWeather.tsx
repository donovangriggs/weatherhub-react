import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from '../ui/MaterialIcon'
import { getWeatherInfo } from '../../utils/weatherCodeMap'
import { formatFullDate, formatTime } from '../../utils/dateFormatting'
import { formatTemperature, fahrenheitToCelsius } from '../../utils/temperatureConversion'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'

const AnimatedTemp = ({ value, className }: { value: number; className?: string }) => {
  const display = useAnimatedNumber(value)
  return <span className={className}>{display}°</span>
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
  const { description } = getWeatherInfo(selectedDay.weatherCode)

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
        </div>
        <h1 className="text-5xl font-bold tracking-tighter">
          <AnimatedTemp value={displayValue} />
        </h1>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
        <p className="text-xs text-slate-500 mt-0.5">
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
      </div>
      <h1 className="text-7xl lg:text-9xl font-bold tracking-tighter mb-4">
        <AnimatedTemp value={displayValue} />
      </h1>
      <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
        <span className="text-2xl font-medium text-slate-400">{description}</span>
        <span className="w-2 h-2 rounded-full bg-slate-600" />
        <span className="text-xl">
          H: {formatTemperature(selectedDay.temperatureMax, unit)} L: {formatTemperature(selectedDay.temperatureMin, unit)}
        </span>
      </div>
      <p className="mt-4 text-slate-400 font-medium">{dateStr}</p>
    </div>
  )
}
