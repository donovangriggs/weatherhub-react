import { motion, AnimatePresence } from 'motion/react'
import { getWeatherInfo } from '../../utils/weatherCodeMap'
import { floatingAnimation } from '../../animation/variants'

interface Props {
  weatherCode: number
}

export const WeatherIllustration = ({ weatherCode }: Props) => {
  const { icon } = getWeatherInfo(weatherCode)

  return (
    <motion.div
      animate={floatingAnimation}
      className="w-28 h-28 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-primary/10 flex items-center justify-center drop-shadow-[0_0_30px_rgba(43,140,238,0.4)]"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={icon}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
          className="material-symbols-outlined text-primary/80"
          style={{ fontSize: 'clamp(72px, 10vw, 140px)', lineHeight: 1 }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}
