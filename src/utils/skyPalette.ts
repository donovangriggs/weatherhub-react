export type TimeOfDay =
  | 'dawn'
  | 'morning'
  | 'day'
  | 'goldenHour'
  | 'dusk'
  | 'night'
  | 'midnight'

export type SkyColors = {
  readonly top: string
  readonly mid: string
  readonly bottom: string
  readonly tint: string
}

export const SKY_PALETTES: Record<TimeOfDay, SkyColors> = {
  dawn: { top: '#1a1025', mid: '#4a2545', bottom: '#d4726a', tint: 'rgba(74,37,69,0.2)' },
  morning: { top: '#4a7fb5', mid: '#87ceeb', bottom: '#b0d4f1', tint: 'rgba(74,127,181,0.12)' },
  day: { top: '#1565a8', mid: '#2196d4', bottom: '#64b5f6', tint: 'rgba(33,150,212,0.15)' },
  goldenHour: { top: '#1a1025', mid: '#8b4513', bottom: '#e67e22', tint: 'rgba(139,69,19,0.2)' },
  dusk: { top: '#0d1321', mid: '#2c1654', bottom: '#6a3d7d', tint: 'rgba(44,22,84,0.2)' },
  night: { top: '#0a0e1a', mid: '#101d30', bottom: '#162040', tint: 'rgba(16,29,48,0.25)' },
  midnight: { top: '#050810', mid: '#0a0e1a', bottom: '#101525', tint: 'rgba(10,14,26,0.3)' },
}

const parseHex = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const toHex = (r: number, g: number, b: number): string => {
  const ch = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  return `#${ch(r)}${ch(g)}${ch(b)}`
}

const lerpChannel = (a: number, b: number, t: number): number => a + (b - a) * t

const parseRgba = (rgba: string): [number, number, number, number] => {
  const m = rgba.match(/rgba?\((\d+),(\d+),(\d+),?([\d.]*)\)/)
  if (!m) return [0, 0, 0, 0]
  return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] ? Number(m[4]) : 1]
}

export const interpolateColors = (a: SkyColors, b: SkyColors, t: number): SkyColors => {
  const clamped = Math.max(0, Math.min(1, t))
  const lerpHex = (h1: string, h2: string): string => {
    const [r1, g1, b1] = parseHex(h1)
    const [r2, g2, b2] = parseHex(h2)
    return toHex(lerpChannel(r1, r2, clamped), lerpChannel(g1, g2, clamped), lerpChannel(b1, b2, clamped))
  }
  const [ar, ag, ab, ao] = parseRgba(a.tint)
  const [br, bg, bb, bo] = parseRgba(b.tint)
  const lr = Math.round(lerpChannel(ar, br, clamped))
  const lg = Math.round(lerpChannel(ag, bg, clamped))
  const lb = Math.round(lerpChannel(ab, bb, clamped))
  const lo = +(lerpChannel(ao, bo, clamped)).toFixed(3)
  return {
    top: lerpHex(a.top, b.top),
    mid: lerpHex(a.mid, b.mid),
    bottom: lerpHex(a.bottom, b.bottom),
    tint: `rgba(${lr},${lg},${lb},${lo})`,
  }
}

const toMs = (isoOrTime: string): number => new Date(isoOrTime).getTime()

export const getTimeOfDay = (
  now: Date,
  sunrise: string,
  sunset: string,
  _timezone: string,
): TimeOfDay => {
  const sunriseMs = toMs(sunrise)
  const sunsetMs = toMs(sunset)

  if (Number.isNaN(sunriseMs) || Number.isNaN(sunsetMs)) {
    const hour = now.getHours()
    return hour >= 6 && hour < 18 ? 'day' : 'night'
  }

  const nowMs = now.getTime()
  const hour1 = 3_600_000
  const hour2 = 7_200_000

  const dawnStart = sunriseMs - hour1
  const morningEnd = sunriseMs + hour2
  const goldenStart = sunsetMs - hour2
  const duskEnd = sunsetMs + hour1

  if (nowMs < dawnStart) return 'midnight'
  if (nowMs < sunriseMs) return 'dawn'
  if (nowMs < morningEnd) return 'morning'
  if (nowMs < goldenStart) return 'day'
  if (nowMs < sunsetMs) return 'goldenHour'
  if (nowMs < duskEnd) return 'dusk'

  const midnightApprox = new Date(now)
  midnightApprox.setHours(23, 0, 0, 0)
  if (nowMs < midnightApprox.getTime()) return 'night'
  return 'midnight'
}
