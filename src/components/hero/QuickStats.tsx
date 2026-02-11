import { motion, AnimatePresence } from 'motion/react'
import { MaterialIcon } from '../ui/MaterialIcon'
import { useWeatherContext } from '../../context/weatherContextValue'
import { mphToKmh, inchesToMm } from '../../utils/temperatureConversion'
import { contentSwapTransition } from '../../animation/variants'

export const QuickStats = () => {
  const { weatherState, unit } = useWeatherContext()
  if (!weatherState) return null

  const { days, selectedDayIndex } = weatherState
  const selectedDay = days[selectedDayIndex]
  const isMetric = unit === 'celsius'

  const windRaw = selectedDay.windSpeedMax
  const wind = windRaw != null && !isNaN(windRaw)
    ? isMetric ? mphToKmh(windRaw) : Math.round(windRaw)
    : null

  const precipRaw = selectedDay.precipitationSum
  const precip = precipRaw != null && !isNaN(precipRaw)
    ? isMetric ? inchesToMm(precipRaw) : precipRaw
    : null

  const uvIndex = selectedDay.uvIndexMax != null && !isNaN(selectedDay.uvIndexMax)
    ? selectedDay.uvIndexMax
    : null
  const uvLabel = uvIndex != null ? (uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Mod' : 'High') : ''

  const stats = [
    {
      icon: 'rainy',
      label: 'Precip',
      value: precip != null ? `${precip} ${isMetric ? 'mm' : 'in'}` : '--',
    },
    {
      icon: 'air',
      label: 'Wind',
      value: wind != null ? `${wind} ${isMetric ? 'km/h' : 'mph'}` : '--',
    },
    {
      icon: 'wb_sunny',
      label: 'UV Index',
      value: uvIndex != null ? `${uvLabel} ${uvIndex}` : '--',
    },
  ]

  return (
    <div className="grid grid-cols-3 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 w-[320px] max-w-full gap-1">
      {stats.map((s) => (
        <div key={s.label} className="text-center min-w-0 px-1">
          <MaterialIcon name={s.icon} className="text-primary mb-1" />
          <p className="text-[10px] uppercase text-slate-400 tracking-wider">{s.label}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${selectedDayIndex}-${s.value}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={contentSwapTransition}
              className="font-bold tabular-nums text-xs sm:text-base whitespace-nowrap"
            >
              {s.value}
            </motion.p>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
