export type SceneType =
  | 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain'
  | 'freezingRain' | 'snow' | 'snowGrains' | 'showers' | 'thunderstorm'

export type SceneIntensity = 'light' | 'moderate' | 'heavy'
export type RenderTier = 'css' | 'canvas' | 'none'

export type SceneConfig = {
  readonly type: SceneType
  readonly intensity: SceneIntensity
  readonly tier: RenderTier
  readonly particleCount: number
}

type RawScene = readonly [SceneType, SceneIntensity, RenderTier]

const SCENE_MAP: Record<number, RawScene> = {
  0:  ['clear', 'light', 'css'],
  1:  ['clear', 'light', 'css'],
  2:  ['cloudy', 'light', 'css'],
  3:  ['cloudy', 'moderate', 'css'],
  45: ['fog', 'moderate', 'css'],
  48: ['fog', 'heavy', 'css'],
  51: ['drizzle', 'light', 'css'],
  53: ['drizzle', 'moderate', 'css'],
  55: ['drizzle', 'heavy', 'css'],
  56: ['freezingRain', 'light', 'css'],
  57: ['freezingRain', 'moderate', 'canvas'],
  61: ['rain', 'light', 'css'],
  63: ['rain', 'moderate', 'css'],
  65: ['rain', 'heavy', 'canvas'],
  66: ['freezingRain', 'light', 'css'],
  67: ['freezingRain', 'heavy', 'canvas'],
  71: ['snow', 'light', 'css'],
  73: ['snow', 'moderate', 'css'],
  75: ['snow', 'heavy', 'canvas'],
  77: ['snowGrains', 'moderate', 'canvas'],
  80: ['showers', 'light', 'css'],
  81: ['showers', 'moderate', 'css'],
  82: ['showers', 'heavy', 'canvas'],
  85: ['snow', 'light', 'css'],
  86: ['snow', 'heavy', 'canvas'],
  95: ['thunderstorm', 'moderate', 'canvas'],
  96: ['thunderstorm', 'heavy', 'canvas'],
  99: ['thunderstorm', 'heavy', 'canvas'],
}

const DEFAULT_SCENE: RawScene = ['clear', 'light', 'css']

const CANVAS_PARTICLE_COUNTS: Record<SceneIntensity, number> = {
  light: 80,
  moderate: 120,
  heavy: 200,
}

const resolveParticleCount = (tier: RenderTier, type: SceneType, intensity: SceneIntensity): number => {
  if (tier !== 'canvas') return 0
  if (type === 'thunderstorm') return 200
  return CANVAS_PARTICLE_COUNTS[intensity]
}

export const getScene = (wmoCode: number, performanceLevel: number): SceneConfig => {
  const [type, intensity, naturalTier] = SCENE_MAP[wmoCode] ?? DEFAULT_SCENE

  const tier: RenderTier =
    performanceLevel === 0 ? 'none' :
    performanceLevel === 1 ? 'css' :
    naturalTier

  return {
    type,
    intensity,
    tier,
    particleCount: resolveParticleCount(tier, type, intensity),
  }
}
