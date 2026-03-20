import { useMemo } from 'react'
import type { ReactNode } from 'react'

interface CssWeatherEffectProps {
  readonly sceneType: string
  readonly intensity: string
}

type ParticleConfig = {
  readonly left: string
  readonly animDuration: string
  readonly animDelay: string
  readonly opacity: number
  readonly size: number
}

const INTENSITY_MULTIPLIER: Record<string, number> = {
  light: 0.5,
  moderate: 1,
  heavy: 1.5,
}

const KEYFRAMES = `
@keyframes fall {
  0% { transform: translateY(-10vh) translateX(0); }
  100% { transform: translateY(110vh) translateX(20px); }
}
@keyframes fallSnow {
  0% { transform: translateY(-10vh) translateX(0); }
  50% { transform: translateY(50vh) translateX(15px); }
  100% { transform: translateY(110vh) translateX(-10px); }
}
@keyframes driftBlob {
  0% { transform: translateX(-10%); }
  50% { transform: translateX(10%); }
  100% { transform: translateX(-10%); }
}
@keyframes fogPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}
@keyframes sunPulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.25; }
}
`

const generateParticles = (count: number, speedRange: [number, number]): readonly ParticleConfig[] =>
  Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    animDuration: `${speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])}s`,
    animDelay: `${-Math.random() * speedRange[1]}s`,
    opacity: 0.3 + Math.random() * 0.5,
    size: 1 + Math.random() * 2,
  }))

const ClearEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse 60% 40% at 70% 15%, rgba(255,220,100,0.15), transparent 70%)',
        opacity: 0.15 * mult,
        animation: 'sunPulse 6s ease-in-out infinite',
      }}
    />
  )
}

const CloudyEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  const blobs = useMemo(() => [
    { top: '10%', left: '20%', w: 300, h: 150, delay: '0s', opacity: 0.06 * mult },
    { top: '25%', left: '60%', w: 250, h: 120, delay: '-4s', opacity: 0.08 * mult },
    { top: '5%', left: '40%', w: 350, h: 180, delay: '-8s', opacity: 0.05 * mult },
  ], [mult])

  return (
    <>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.w,
            height: b.h,
            background: 'radial-gradient(ellipse, rgba(200,210,230,0.5), transparent 70%)',
            filter: 'blur(40px)',
            opacity: b.opacity,
            animation: `driftBlob 20s ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
    </>
  )
}

const FogEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(to bottom, rgba(180,190,200,0.15), rgba(160,170,180,0.08))',
        opacity: 0.15 * mult,
        animation: 'fogPulse 8s ease-in-out infinite',
      }}
    />
  )
}

const RainLikeEffect = ({ intensity, isDrizzle }: { intensity: string; isDrizzle: boolean }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  const baseCount = isDrizzle ? 30 : 50
  const count = Math.round(baseCount * mult)
  const speedRange: [number, number] = isDrizzle ? [1.5, 3] : [0.8, 1.8]

  const particles = useMemo(() => generateParticles(count, speedRange), [count, speedRange[0], speedRange[1]])

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: p.left,
            top: 0,
            width: isDrizzle ? 1 : p.size,
            height: isDrizzle ? 8 : 12 + p.size * 4,
            background: `rgba(180,200,220,${p.opacity})`,
            borderRadius: '0 0 1px 1px',
            animation: `fall ${p.animDuration} linear ${p.animDelay} infinite`,
          }}
        />
      ))}
    </>
  )
}

const SnowEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  const count = Math.round(35 * mult)

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        animDuration: `${4 + Math.random() * 6}s`,
        animDelay: `${-Math.random() * 8}s`,
        opacity: 0.4 + Math.random() * 0.4,
        size: 2 + Math.random() * 2,
      })),
    [count],
  )

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            background: `rgba(255,255,255,${p.opacity})`,
            animation: `fallSnow ${p.animDuration} ease-in-out ${p.animDelay} infinite`,
          }}
        />
      ))}
    </>
  )
}

const SCENE_RENDERERS: Record<string, (props: { intensity: string }) => ReactNode> = {
  clear: ({ intensity }) => <ClearEffect intensity={intensity} />,
  cloudy: ({ intensity }) => <CloudyEffect intensity={intensity} />,
  fog: ({ intensity }) => <FogEffect intensity={intensity} />,
  drizzle: ({ intensity }) => <RainLikeEffect intensity={intensity} isDrizzle />,
  rain: ({ intensity }) => <RainLikeEffect intensity={intensity} isDrizzle={false} />,
  showers: ({ intensity }) => <RainLikeEffect intensity={intensity} isDrizzle={false} />,
  snow: ({ intensity }) => <SnowEffect intensity={intensity} />,
  snowGrains: ({ intensity }) => <SnowEffect intensity={intensity} />,
  freezingRain: ({ intensity }) => <RainLikeEffect intensity={intensity} isDrizzle={false} />,
}

export const CssWeatherEffect = ({ sceneType, intensity }: CssWeatherEffectProps) => {
  const Renderer = SCENE_RENDERERS[sceneType]

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      style={{
        transform: 'translateY(var(--parallax-scene, 0px))',
      }}
    >
      <style>{KEYFRAMES}</style>
      {Renderer ? <Renderer intensity={intensity} /> : null}
    </div>
  )
}
