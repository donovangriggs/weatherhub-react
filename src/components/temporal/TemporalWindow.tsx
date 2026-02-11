import { motion } from 'motion/react'
import { useWeatherContext } from '../../context/weatherContextValue'
import { DayTile } from './DayTile'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'
import { fadeSlideUp, tileStaggerContainer, tileEntrance } from '../../animation/variants'

export const TemporalWindow = () => {
  const { weatherState, isLoading } = useWeatherContext()

  if (isLoading || !weatherState) {
    return (
      <section className="space-y-6">
        <div className="h-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-[180px]" />
          ))}
        </div>
      </section>
    )
  }

  const { days, todayIndex, selectedDayIndex } = weatherState

  return (
    <section className="space-y-4 sm:space-y-6">
      <motion.div
        variants={fadeSlideUp}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-between"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Temporal Window</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Past performance and upcoming projections</p>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-3 overflow-x-auto pt-3 pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:gap-4 sm:overflow-visible sm:pt-0 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
        variants={tileStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            variants={tileEntrance}
            className="min-w-[130px] sm:min-w-0 snap-start shrink-0 sm:shrink"
          >
            <DayTile
              day={day}
              index={i}
              isToday={i === todayIndex}
              isHistory={i < todayIndex}
              isSelected={i === selectedDayIndex}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
