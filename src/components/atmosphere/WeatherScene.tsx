import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getScene } from '../../utils/weatherSceneMap'
import { CssWeatherEffect } from './CssWeatherEffect'
import { CanvasWeatherEffect } from './CanvasWeatherEffect'

interface WeatherSceneProps {
  readonly weatherCode: number
  readonly performanceLevel: 0 | 1 | 2
}

export const WeatherScene = ({ weatherCode, performanceLevel }: WeatherSceneProps) => {
  const [forceCss, setForceCss] = useState(false)

  const scene = getScene(weatherCode, performanceLevel)
  const effectiveTier = forceCss && scene.tier === 'canvas' ? 'css' : scene.tier

  if (effectiveTier === 'none') return null

  const handleFallback = () => {
    setForceCss(true)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${weatherCode}-${effectiveTier}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {effectiveTier === 'css' ? (
          <CssWeatherEffect sceneType={scene.type} intensity={scene.intensity} />
        ) : (
          <CanvasWeatherEffect
            sceneType={scene.type}
            intensity={scene.intensity}
            particleCount={scene.particleCount}
            onFallback={handleFallback}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
