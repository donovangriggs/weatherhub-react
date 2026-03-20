import { useState, useEffect, useCallback } from 'react'

interface ParticleStats {
  fps: number
  particleCount: number
  activeCount: number
  running: boolean
}

interface DebugOverlayProps {
  skyTimeOfDay: string
  skyColors: { top: string; mid: string; bottom: string }
  performanceLevel: number
  sceneType: string
  sceneTier: string
  particleStats?: ParticleStats
}

const ColorDot = ({ color }: { color: string }) => (
  <span
    className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
    style={{ backgroundColor: color }}
  />
)

export const DebugOverlay = ({
  skyTimeOfDay,
  skyColors,
  performanceLevel,
  sceneType,
  sceneTier,
  particleStats,
}: DebugOverlayProps) => {
  const [visible, setVisible] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault()
      setVisible((prev) => !prev)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!import.meta.env.DEV) return null
  if (!visible) return null

  const fps = particleStats?.fps ?? 0
  const particleCount = particleStats?.particleCount ?? 0
  const activeCount = particleStats?.activeCount ?? 0

  return (
    <div
      className="fixed top-[72px] right-4 z-50 glass rounded-xl p-3 w-[220px]"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <div className="flex flex-col gap-1 text-[11px]">
        <Row label="FPS" value={`${fps} | Level: ${performanceLevel}`} />
        <Row label="Sky" value={skyTimeOfDay} />
        <Row label="Scene" value={`${sceneType} (${sceneTier})`} />
        <Row
          label="Particles"
          value={`${activeCount}/${particleCount}`}
        />
        <div className="text-slate-500">
          Colors:{' '}
          <span className="text-slate-400">
            <ColorDot color={skyColors.top} />
            {skyColors.top}
            {' \u2192 '}
            <ColorDot color={skyColors.bottom} />
            {skyColors.bottom}
          </span>
        </div>
      </div>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-slate-500">{label}: </span>
    <span className="text-slate-400">{value}</span>
  </div>
)
