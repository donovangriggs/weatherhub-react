import { motion } from 'motion/react'
import { useWeatherContext } from '../../context/weatherContextValue'

export const UnitToggle = () => {
  const { unit, setUnit } = useWeatherContext()

  return (
    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 relative" role="group" aria-label="Temperature unit">
      <button
        className={`px-3 py-1 rounded text-xs font-medium transition-colors relative z-10 ${
          unit === 'fahrenheit' ? 'text-white' : 'hover:bg-white/5'
        }`}
        onClick={() => setUnit('fahrenheit')}
        aria-pressed={unit === 'fahrenheit'}
      >
        °F
        {unit === 'fahrenheit' && (
          <motion.div
            layoutId="unit-indicator"
            className="absolute inset-0 bg-primary rounded"
            style={{ zIndex: -1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
      <button
        className={`px-3 py-1 rounded text-xs font-medium transition-colors relative z-10 ${
          unit === 'celsius' ? 'text-white' : 'hover:bg-white/5'
        }`}
        onClick={() => setUnit('celsius')}
        aria-pressed={unit === 'celsius'}
      >
        °C
        {unit === 'celsius' && (
          <motion.div
            layoutId="unit-indicator"
            className="absolute inset-0 bg-primary rounded"
            style={{ zIndex: -1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
    </div>
  )
}
