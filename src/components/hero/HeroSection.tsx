import { useWeatherContext } from '../../context/weatherContextValue'
import { CurrentWeather } from './CurrentWeather'
import { QuickStats } from './QuickStats'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'

export const HeroSection = () => {
  const { weatherState, isLoading } = useWeatherContext()

  if (isLoading || !weatherState) {
    return (
      <section className="relative overflow-hidden rounded-3xl p-8 lg:p-12 glass">
        <LoadingSkeleton className="h-64 w-full" />
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 glass border-white/10">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

      {/* Mobile layout */}
      <div className="relative z-10 sm:hidden">
        <CurrentWeather compact />
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex justify-between items-center gap-8">
        <CurrentWeather />
        <QuickStats />
      </div>

      {/* Mobile stats below */}
      <div className="relative z-10 sm:hidden mt-4">
        <QuickStats />
      </div>
    </section>
  )
}
