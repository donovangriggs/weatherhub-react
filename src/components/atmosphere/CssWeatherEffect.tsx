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
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.4; }
}
@keyframes sunPulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.4; }
}
@keyframes lightningFlash {
  0%, 90%, 100% { opacity: 0; }
  92% { opacity: 0.8; }
  94% { opacity: 0.1; }
  96% { opacity: 0.6; }
  98% { opacity: 0; }
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
    <>
      {/* Sun glow top-right */}
      <div
        className="absolute"
        style={{
          top: '-10%',
          right: '-5%',
          width: '50vw',
          height: '50vh',
          background: 'radial-gradient(ellipse 70% 60% at center, rgba(255,200,60,0.35), rgba(255,180,40,0.15) 40%, transparent 70%)',
          opacity: 0.6 * mult,
          animation: 'sunPulse 6s ease-in-out infinite',
        }}
      />
      {/* Warm light rays */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(255,220,100,0.08) 50%, transparent 70%)',
          opacity: 0.5 * mult,
        }}
      />
    </>
  )
}

const CloudyEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  const blobs = useMemo(() => [
    { top: '5%', left: '10%', w: 500, h: 200, delay: '0s', opacity: 0.35 * mult },
    { top: '15%', left: '50%', w: 450, h: 180, delay: '-6s', opacity: 0.3 * mult },
    { top: '0%', left: '30%', w: 600, h: 250, delay: '-12s', opacity: 0.25 * mult },
    { top: '20%', left: '70%', w: 400, h: 160, delay: '-3s', opacity: 0.3 * mult },
    { top: '8%', left: '-5%', w: 350, h: 140, delay: '-9s', opacity: 0.28 * mult },
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
            background: 'radial-gradient(ellipse, rgba(180,195,220,0.7), rgba(160,180,210,0.3) 50%, transparent 75%)',
            filter: 'blur(30px)',
            opacity: b.opacity,
            animation: `driftBlob 25s ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
    </>
  )
}

const FogEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  return (
    <>
      {/* Main fog layer */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(200,210,220,0.4), rgba(180,190,200,0.3) 50%, rgba(160,170,180,0.15))',
          opacity: 0.6 * mult,
          animation: 'fogPulse 8s ease-in-out infinite',
        }}
      />
      {/* Drifting fog patches */}
      <div
        className="absolute"
        style={{
          top: '20%',
          left: '-10%',
          width: '120%',
          height: '40%',
          background: 'radial-gradient(ellipse 80% 100% at center, rgba(200,210,220,0.5), transparent 70%)',
          filter: 'blur(40px)',
          opacity: 0.4 * mult,
          animation: 'driftBlob 30s ease-in-out infinite',
        }}
      />
    </>
  )
}

const RainLikeEffect = ({ intensity, isDrizzle }: { intensity: string; isDrizzle: boolean }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  const baseCount = isDrizzle ? 60 : 120
  const count = Math.round(baseCount * mult)
  const speedRange: [number, number] = isDrizzle ? [1.0, 2.0] : [0.5, 1.2]

  const particles = useMemo(() => generateParticles(count, speedRange), [count, speedRange[0], speedRange[1]])

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10%',
            width: isDrizzle ? 1.5 : 2 + p.size,
            height: isDrizzle ? 18 : 25 + p.size * 8,
            background: isDrizzle
              ? `rgba(180,200,230,${p.opacity * 0.6})`
              : `rgba(220,235,255,${p.opacity * 0.7})`,
            borderRadius: '0 0 2px 2px',
            animation: `fall ${p.animDuration} linear ${p.animDelay} infinite`,
          }}
        />
      ))}
    </>
  )
}

const SnowEffect = ({ intensity }: { intensity: string }) => {
  const mult = INTENSITY_MULTIPLIER[intensity] ?? 1
  const count = Math.round(60 * mult)

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        animDuration: `${3 + Math.random() * 5}s`,
        animDelay: `${-Math.random() * 6}s`,
        opacity: 0.6 + Math.random() * 0.3,
        size: 3 + Math.random() * 5,
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

const ThunderstormEffect = ({ intensity }: { intensity: string }) => {
  const flashCount = 3
  const flashes = useMemo(
    () =>
      Array.from({ length: flashCount }, (_, i) => ({
        animDelay: `${i * 3.5}s`,
        animDuration: `${7 + i * 2}s`,
      })),
    [],
  )

  return (
    <>
      <RainLikeEffect intensity="heavy" isDrizzle={false} />
      {flashes.map((f, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            background: `rgba(255,255,255,${INTENSITY_MULTIPLIER[intensity] ?? 1 > 1 ? 0.3 : 0.2})`,
            animation: `lightningFlash ${f.animDuration} ease-in-out ${f.animDelay} infinite`,
            pointerEvents: 'none',
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
  thunderstorm: ({ intensity }) => <ThunderstormEffect intensity={intensity} />,
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
