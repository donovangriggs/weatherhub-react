import { describe, it, expect } from 'vitest'
import {
  getTimeOfDay,
  interpolateColors,
  SKY_PALETTES,
} from '../../utils/skyPalette'
import type { TimeOfDay, SkyColors } from '../../utils/skyPalette'

const makeDate = (year: number, month: number, day: number, hour: number, minute: number): Date =>
  new Date(year, month - 1, day, hour, minute, 0, 0)

const isoTime = (year: number, month: number, day: number, hour: number, minute: number): string =>
  new Date(year, month - 1, day, hour, minute, 0, 0).toISOString()

describe('getTimeOfDay', () => {
  const sunrise = isoTime(2026, 3, 20, 6, 0)
  const sunset = isoTime(2026, 3, 20, 18, 0)
  const tz = 'America/New_York'

  it('returns dawn for 5:30am with sunrise at 6am', () => {
    const now = makeDate(2026, 3, 20, 5, 30)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('dawn')
  })

  it('returns morning for 7am with sunrise at 6am', () => {
    const now = makeDate(2026, 3, 20, 7, 0)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('morning')
  })

  it('returns day for 12pm', () => {
    const now = makeDate(2026, 3, 20, 12, 0)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('day')
  })

  it('returns goldenHour for 5pm with sunset at 6pm', () => {
    const now = makeDate(2026, 3, 20, 17, 0)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('goldenHour')
  })

  it('returns dusk for 7pm with sunset at 6pm', () => {
    const now = makeDate(2026, 3, 20, 18, 30)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('dusk')
  })

  it('returns night for 10pm', () => {
    const now = makeDate(2026, 3, 20, 22, 0)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('night')
  })

  it('returns midnight for 2am', () => {
    const now = makeDate(2026, 3, 20, 2, 0)
    expect(getTimeOfDay(now, sunrise, sunset, tz)).toBe('midnight')
  })

  it('defaults to day/night when sunrise/sunset are invalid', () => {
    const noon = makeDate(2026, 3, 20, 12, 0)
    expect(getTimeOfDay(noon, 'invalid', 'invalid', tz)).toBe('day')

    const lateNight = makeDate(2026, 3, 20, 23, 0)
    expect(getTimeOfDay(lateNight, 'invalid', 'invalid', tz)).toBe('night')
  })
})

describe('interpolateColors', () => {
  // Use distinct custom colors since all palettes may be identical
  const a: SkyColors = { top: '#000000', mid: '#333333', bottom: '#666666', tint: 'rgba(0,0,0,0.2)' }
  const b: SkyColors = { top: '#ffffff', mid: '#cccccc', bottom: '#999999', tint: 'rgba(255,255,255,0.8)' }

  it('returns color a at t=0', () => {
    const result = interpolateColors(a, b, 0)
    expect(result.top).toBe(a.top)
    expect(result.mid).toBe(a.mid)
    expect(result.bottom).toBe(a.bottom)
  })

  it('returns color b at t=1', () => {
    const result = interpolateColors(a, b, 1)
    expect(result.top).toBe(b.top)
    expect(result.mid).toBe(b.mid)
    expect(result.bottom).toBe(b.bottom)
  })

  it('returns a midpoint at t=0.5', () => {
    const result = interpolateColors(a, b, 0.5)
    // Midpoint should differ from both a and b
    expect(result.top).not.toBe(a.top)
    expect(result.top).not.toBe(b.top)
    // Should be a valid hex color
    expect(result.top).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.mid).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.bottom).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.tint).toMatch(/^rgba\(\d+,\d+,\d+,[\d.]+\)$/)
  })
})

describe('SKY_PALETTES', () => {
  const ALL_TIMES: TimeOfDay[] = ['dawn', 'morning', 'day', 'goldenHour', 'dusk', 'night', 'midnight']

  it('has all 7 time states defined', () => {
    expect(Object.keys(SKY_PALETTES)).toHaveLength(7)
    for (const time of ALL_TIMES) {
      expect(SKY_PALETTES[time]).toBeDefined()
    }
  })

  it.each(ALL_TIMES)('palette "%s" has top, mid, bottom, tint properties', (time) => {
    const palette = SKY_PALETTES[time]
    expect(palette).toHaveProperty('top')
    expect(palette).toHaveProperty('mid')
    expect(palette).toHaveProperty('bottom')
    expect(palette).toHaveProperty('tint')
    expect(typeof palette.top).toBe('string')
    expect(typeof palette.mid).toBe('string')
    expect(typeof palette.bottom).toBe('string')
    expect(typeof palette.tint).toBe('string')
  })
})
