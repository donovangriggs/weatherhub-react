import { useRef, useEffect, useCallback } from 'react'
import { ParticleEngine } from './ParticleEngine'
import type { ParticleConfig, ParticleType } from './ParticleEngine'
import { sampleFrameRate } from '../../hooks/usePerformanceLevel'

interface CanvasWeatherEffectProps {
  readonly sceneType: string
  readonly intensity: string
  readonly particleCount: number
  readonly onFallback: () => void
}

const WIND_BY_INTENSITY: Record<string, number> = {
  light: 0.3,
  moderate: 0.8,
  heavy: 1.2,
}

const buildParticleConfig = (
  sceneType: string,
  intensity: string,
  particleCount: number,
): ParticleConfig => {
  const wind = WIND_BY_INTENSITY[intensity] ?? 0.8

  const SCENE_CONFIGS: Record<string, Omit<ParticleConfig, 'count'>> = {
    rain: { type: 'rain' as ParticleType, gravity: 0.3, windSpeed: wind, opacity: [0.3, 0.7], size: [1, 3], speed: [4, 8] },
    showers: { type: 'rain' as ParticleType, gravity: 0.3, windSpeed: wind, opacity: [0.3, 0.7], size: [1, 3], speed: [4, 8] },
    snow: { type: 'snow' as ParticleType, gravity: 0.1, windSpeed: 0.3, opacity: [0.4, 0.8], size: [2, 4], speed: [1, 3] },
    freezingRain: { type: 'snow' as ParticleType, gravity: 0.1, windSpeed: 0.3, opacity: [0.3, 0.6], size: [1, 3], speed: [2, 4] },
    snowGrains: { type: 'snow' as ParticleType, gravity: 0.15, windSpeed: 0.4, opacity: [0.3, 0.6], size: [1, 2], speed: [1, 3] },
    thunderstorm: { type: 'rain' as ParticleType, gravity: 0.4, windSpeed: 1.5, opacity: [0.4, 0.8], size: [1, 3], speed: [6, 10] },
    hail: { type: 'hail' as ParticleType, gravity: 0.5, windSpeed: 0.2, opacity: [0.5, 0.9], size: [3, 5], speed: [5, 9] },
  }

  const config = SCENE_CONFIGS[sceneType] ?? SCENE_CONFIGS.rain
  return { ...config, count: particleCount }
}

export const CanvasWeatherEffect = ({
  sceneType,
  intensity,
  particleCount,
  onFallback,
}: CanvasWeatherEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)

  const handleError = useCallback(() => {
    onFallback()
  }, [onFallback])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let engine: ParticleEngine
    try {
      const config = buildParticleConfig(sceneType, intensity, particleCount)
      engine = new ParticleEngine(canvas, config)
      engine.onError = handleError
      engineRef.current = engine
    } catch {
      onFallback()
      return
    }

    const resizeCanvas = () => {
      engine.resize(window.innerWidth, window.innerHeight)
    }

    resizeCanvas()
    engine.start()

    // Verify Canvas performance
    sampleFrameRate((level) => {
      if (level < 2) {
        engine.stop()
        onFallback()
      }
    })

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(document.documentElement)

    // Handle visibility change
    const handleVisibility = () => {
      if (document.hidden) {
        engine.pause()
      } else {
        engine.resume()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      engine.stop()
      engineRef.current = null
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [sceneType, intensity, particleCount, onFallback, handleError])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 z-[1]"
      style={{ pointerEvents: 'none' }}
    />
  )
}
