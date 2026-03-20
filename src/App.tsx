import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { WeatherProvider } from './context/WeatherContext'
import { ToastProvider } from './context/ToastContext'
import { useWeatherContext } from './context/weatherContextValue'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { useSkyColors } from './hooks/useSkyColors'
import { usePerformanceLevel } from './hooks/usePerformanceLevel'
import { useParallax } from './hooks/useParallax'
import { SkyGradient } from './components/atmosphere/SkyGradient'
import { WeatherScene } from './components/atmosphere/WeatherScene'
import { DawnLoadingScreen } from './components/atmosphere/DawnLoadingScreen'
import { Navbar } from './components/layout/Navbar'
import { QuickSwitcher } from './components/ui/QuickSwitcher'
import { TimeLapseButton } from './components/ui/TimeLapseButton'
import { DebugOverlay } from './components/ui/DebugOverlay'
import { HeroSection } from './components/hero/HeroSection'
import { TemporalWindow } from './components/temporal/TemporalWindow'
import { SecondaryInsights } from './components/insights/SecondaryInsights'
import { Footer } from './components/layout/Footer'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { OfflineFallback } from './components/ui/OfflineFallback'
import { getScene } from './utils/weatherSceneMap'
import { staggerContainer, fadeSlideUp } from './animation/variants'

const AppContent = () => {
  const { weatherState, isLoading } = useWeatherContext()
  const isOnline = useOnlineStatus()
  const { level: performanceLevel } = usePerformanceLevel()
  const { parallaxRef } = useParallax()

  const today = weatherState
    ? weatherState.days[weatherState.todayIndex]
    : undefined

  const { skyColors, timeOfDay, setTimeLapseProgress } = useSkyColors({
    timezone: weatherState?.timezone ?? '',
    sunrise: today?.sunrise ?? '',
    sunset: today?.sunset ?? '',
  })

  const sceneConfig = weatherState
    ? getScene(weatherState.current.weather_code, performanceLevel)
    : null

  // Set CSS custom properties for sky tinting on wrapper
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.style.setProperty('--sky-top', skyColors.top)
    el.style.setProperty('--sky-mid', skyColors.mid)
    el.style.setProperty('--sky-bottom', skyColors.bottom)
    el.style.setProperty('--sky-tint', skyColors.tint)
  }, [skyColors])

  if (!isOnline && !weatherState) return <OfflineFallback />

  if (!weatherState || isLoading) {
    return <DawnLoadingScreen />
  }

  return (
    <div ref={wrapperRef} className="font-display text-slate-100 min-h-screen relative">
      {/* Atmosphere layers */}
      <div ref={parallaxRef}>
        <SkyGradient skyColors={skyColors} />
        {sceneConfig && sceneConfig.tier !== 'none' && (
          <WeatherScene
            weatherCode={weatherState.current.weather_code}
            performanceLevel={performanceLevel}
          />
        )}
      </div>

      {/* UI Content */}
      <div className="relative z-10">
        <Navbar />
        <QuickSwitcher />
        <motion.main
          className="max-w-7xl mx-auto px-4 py-4 sm:p-6 space-y-6 sm:space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeSlideUp}>
            <HeroSection />
          </motion.div>
          <motion.div variants={fadeSlideUp}>
            <TemporalWindow />
          </motion.div>
          <motion.div variants={fadeSlideUp}>
            <SecondaryInsights />
          </motion.div>
        </motion.main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Footer />
        </motion.div>
      </div>

      {/* Floating controls */}
      <TimeLapseButton onProgressChange={setTimeLapseProgress} disabled={isLoading} />
      <DebugOverlay
        skyTimeOfDay={timeOfDay}
        skyColors={skyColors}
        performanceLevel={performanceLevel}
        sceneType={sceneConfig?.type ?? 'clear'}
        sceneTier={sceneConfig?.tier ?? 'none'}
      />
    </div>
  )
}

const App = () => {
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    const waitForFonts = async () => {
      try {
        await document.fonts.load('24px "Material Symbols Outlined"')
        await document.fonts.load('400 16px "Space Grotesk"')
      } catch {
        // Font loading failed, proceed anyway
      }
      setFontsReady(true)
    }
    void waitForFonts()
    const timer = setTimeout(() => setFontsReady(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {!fontsReady ? (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DawnLoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ToastProvider>
              <WeatherProvider>
                <AppContent />
              </WeatherProvider>
            </ToastProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  )
}

export default App
