import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { WeatherProvider } from './context/WeatherContext'
import { useWeatherContext } from './context/weatherContextValue'
import { Navbar } from './components/layout/Navbar'
import { HeroSection } from './components/hero/HeroSection'
import { TemporalWindow } from './components/temporal/TemporalWindow'
import { SecondaryInsights } from './components/insights/SecondaryInsights'
import { Footer } from './components/layout/Footer'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { staggerContainer, fadeSlideUp } from './animation/variants'

const LoadingScreen = () => {
  return (
    <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="bg-primary rounded-2xl flex items-center justify-center w-12 h-12">
        <svg width="28" height="28" viewBox="0 -960 960 960" fill="white">
          <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-100" style={{ fontFamily: 'system-ui' }}>
        Weather<span className="text-primary">Hub</span>
      </span>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mt-4" />
    </div>
  )
}

const AppContent = () => {
  const { weatherState } = useWeatherContext()

  if (!weatherState) return <LoadingScreen />

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen">
      <Navbar />
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
            <LoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <WeatherProvider>
              <AppContent />
            </WeatherProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  )
}

export default App
