import { useWeatherContext } from '../../context/weatherContextValue'
import { CurrentWeather } from './CurrentWeather'
import { WeatherIllustration } from './WeatherIllustration'
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

  const { days, selectedDayIndex } = weatherState
  const selectedDay = days[selectedDayIndex]
  if (!selectedDay) return null
  const weatherCode = selectedDay.weatherCode

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 glass border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-8">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-row sm:hidden items-center gap-4 w-full">
        <WeatherIllustration weatherCode={weatherCode} />
        <div className="flex-1 min-w-0">
          <CurrentWeather compact />
        </div>
      </div>

      <div className="hidden sm:block">
        <CurrentWeather />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
        <div className="hidden sm:block">
          <WeatherIllustration weatherCode={weatherCode} />
        </div>
        <QuickStats />
      </div>
    </section>
  )
}
