import { motion, AnimatePresence } from 'motion/react'
import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from '../ui/MaterialIcon'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeader } from '../ui/SectionHeader'
import { formatTime } from '../../utils/dateFormatting'
import { contentSwapTransition } from '../../animation/variants'

const AnimatedTime = ({ value, dayIndex }: { value: string; dayIndex: number }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={`${dayIndex}-${value}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={contentSwapTransition}
      className="font-bold tracking-tight"
    >
      {value}
    </motion.span>
  </AnimatePresence>
)

export const DaylightSchedule = () => {
  const { weatherState } = useWeatherContext()
  if (!weatherState) return null

  const { days, selectedDayIndex } = weatherState
  const selectedDay = days[selectedDayIndex]
  if (!selectedDay) return null

  return (
    <GlassCard className="space-y-4">
      <SectionHeader icon="wb_twilight">Daylight Schedule</SectionHeader>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <MaterialIcon name="sunny" className="text-orange-400" />
            <span className="text-sm font-medium">Sunrise</span>
          </div>
          <AnimatedTime value={formatTime(selectedDay.sunrise)} dayIndex={selectedDayIndex} />
        </div>
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <MaterialIcon name="sunny" className="text-primary" />
            <span className="text-sm font-medium">Sunset</span>
          </div>
          <AnimatedTime value={formatTime(selectedDay.sunset)} dayIndex={selectedDayIndex} />
        </div>
      </div>
    </GlassCard>
  )
}
