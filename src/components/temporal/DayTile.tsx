import { motion } from 'motion/react'
import type { DayWeather } from '../../types/weather'
import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from '../ui/MaterialIcon'
import { getWeatherInfo } from '../../utils/weatherCodeMap'
import { formatDayLabel } from '../../utils/dateFormatting'
import { formatTemperature } from '../../utils/temperatureConversion'

interface Props {
  day: DayWeather
  index: number
  isToday: boolean
  isHistory: boolean
  isSelected: boolean
}

export const DayTile = ({ day, index, isToday, isHistory, isSelected }: Props) => {
  const { selectDay, unit } = useWeatherContext()
  const { icon } = getWeatherInfo(day.weatherCode)

  const tileClasses = isSelected
    ? 'glass-active'
    : `glass ${isHistory ? 'opacity-60 hover:opacity-100' : 'hover:bg-white/10'}`

  return (
    <motion.button
      onClick={() => selectDay(index)}
      aria-pressed={isSelected}
      aria-label={`${formatDayLabel(day.date)}, high ${formatTemperature(day.temperatureMax, unit)}, low ${formatTemperature(day.temperatureMin, unit)}`}
      className={`${tileClasses} p-4 sm:p-5 rounded-2xl text-center transition-colors duration-300 flex flex-col items-center justify-between min-h-[160px] sm:min-h-[180px] relative cursor-pointer w-full`}
      animate={{ scale: isSelected ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileTap={{ scale: 0.97 }}
    >
      {isToday && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
          Current
        </div>
      )}

      <span
        className={`text-xs font-bold uppercase tracking-widest ${
          isSelected ? 'text-primary mt-1' : isHistory ? 'text-slate-400' : 'text-slate-300'
        }`}
      >
        {formatDayLabel(day.date)}
      </span>

      <div className="my-4">
        <MaterialIcon
          name={icon}
          className={`${isSelected ? 'text-4xl text-primary' : 'text-3xl'} ${
            !isSelected && (isHistory ? 'text-slate-400' : 'text-primary')
          }`}
        />
      </div>

      <div>
        <div className={`font-bold ${isSelected ? 'text-2xl font-black text-white' : 'text-xl'}`}>
          {formatTemperature(day.temperatureMax, unit)}
        </div>
        <div className={`text-[10px] font-medium ${isSelected ? 'text-slate-200' : 'text-slate-300'}`}>
          L: {formatTemperature(day.temperatureMin, unit)}
        </div>
      </div>
    </motion.button>
  )
}
