import { useState, useEffect } from 'react'
import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from '../ui/MaterialIcon'
import { getTimeAgo } from '../../utils/dateFormatting'

const useTimeAgo = (isoString: string | undefined) => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!isoString) return
    const timer = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(timer)
  }, [isoString])

  if (!isoString) return 'N/A'
  // tick is used to trigger re-computation
  void tick
  return getTimeAgo(new Date(isoString))
}

export const Footer = () => {
  const { weatherState } = useWeatherContext()
  const lastUpdated = useTimeAgo(weatherState?.lastUpdated)

  return (
    <footer aria-label="Site information" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs sm:text-sm border-t border-white/5 gap-4 sm:gap-6">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
          Live Data API
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span>Last Updated: {lastUpdated}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Powered by</span>
        <div className="flex items-center gap-1 font-bold text-slate-300">
          <MaterialIcon name="cloud_done" className="text-primary text-sm" />
          Open-Meteo
        </div>
      </div>
    </footer>
  )
}
