import { describe, it, expect } from 'vitest'
import { getScene } from '../../utils/weatherSceneMap'

describe('getScene', () => {
  it('maps code 0 to clear/light/css', () => {
    const scene = getScene(0, 2)
    expect(scene.type).toBe('clear')
    expect(scene.intensity).toBe('light')
    expect(scene.tier).toBe('css')
  })

  it('maps code 95 to thunderstorm/moderate/canvas at perf level 2', () => {
    const scene = getScene(95, 2)
    expect(scene.type).toBe('thunderstorm')
    expect(scene.intensity).toBe('moderate')
    expect(scene.tier).toBe('canvas')
  })

  it('maps code 95 to thunderstorm with tier css at perf level 1', () => {
    const scene = getScene(95, 1)
    expect(scene.type).toBe('thunderstorm')
    expect(scene.tier).toBe('css')
  })

  it('maps code 95 to thunderstorm with tier none at perf level 0', () => {
    const scene = getScene(95, 0)
    expect(scene.type).toBe('thunderstorm')
    expect(scene.tier).toBe('none')
  })

  it('maps code 61 (slight rain) to rain/light/css', () => {
    const scene = getScene(61, 2)
    expect(scene.type).toBe('rain')
    expect(scene.intensity).toBe('light')
    expect(scene.tier).toBe('css')
  })

  it('maps code 65 (heavy rain) to rain/heavy/canvas at level 2', () => {
    const scene = getScene(65, 2)
    expect(scene.type).toBe('rain')
    expect(scene.intensity).toBe('heavy')
    expect(scene.tier).toBe('canvas')
  })

  it('maps code 75 (heavy snow) to snow/heavy/canvas at level 2', () => {
    const scene = getScene(75, 2)
    expect(scene.type).toBe('snow')
    expect(scene.intensity).toBe('heavy')
    expect(scene.tier).toBe('canvas')
  })

  it('returns clear/light/css fallback for unknown code', () => {
    const scene = getScene(999, 2)
    expect(scene.type).toBe('clear')
    expect(scene.intensity).toBe('light')
    expect(scene.tier).toBe('css')
  })

  it('canvas tier scenes have positive particleCount', () => {
    const rain = getScene(65, 2)
    expect(rain.tier).toBe('canvas')
    expect(rain.particleCount).toBeGreaterThan(0)

    const thunder = getScene(95, 2)
    expect(thunder.tier).toBe('canvas')
    expect(thunder.particleCount).toBeGreaterThan(0)
  })

  it('css tier scenes have particleCount 0', () => {
    const clear = getScene(0, 2)
    expect(clear.tier).toBe('css')
    expect(clear.particleCount).toBe(0)

    const lightRain = getScene(61, 2)
    expect(lightRain.tier).toBe('css')
    expect(lightRain.particleCount).toBe(0)
  })
})
