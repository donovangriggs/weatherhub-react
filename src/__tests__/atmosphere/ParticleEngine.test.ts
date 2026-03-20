import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ParticleEngine } from '../../components/atmosphere/ParticleEngine'
import type { ParticleConfig } from '../../components/atmosphere/ParticleEngine'

const createMockContext = (): CanvasRenderingContext2D => {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    scale: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    globalAlpha: 1,
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
  } as unknown as CanvasRenderingContext2D
}

const createMockCanvas = (): HTMLCanvasElement => {
  const ctx = createMockContext()
  const style: Record<string, string> = {}
  return {
    getContext: vi.fn(() => ctx),
    width: 800,
    height: 600,
    style: {
      get width() { return style.width ?? '' },
      set width(v: string) { style.width = v },
      get height() { return style.height ?? '' },
      set height(v: string) { style.height = v },
      setProperty: vi.fn(),
    },
  } as unknown as HTMLCanvasElement
}

const defaultConfig: ParticleConfig = {
  type: 'rain',
  count: 50,
  windSpeed: 1,
  gravity: 9.8,
  opacity: [0.3, 0.8],
  size: [1, 3],
  speed: [4, 8],
}

describe('ParticleEngine', () => {
  let rafCallbacks: ((timestamp: number) => void)[]

  beforeEach(() => {
    rafCallbacks = []
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: (t: number) => void) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('devicePixelRatio', 2)
  })

  it('constructor creates engine but does not start', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    const stats = engine.getStats()
    expect(stats.running).toBe(false)
    expect(stats.particleCount).toBe(0)
  })

  it('start() begins animation, getStats() shows running=true', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    engine.start()
    const stats = engine.getStats()
    expect(stats.running).toBe(true)
    expect(stats.particleCount).toBe(50)
  })

  it('stop() stops animation, getStats() shows running=false', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    engine.start()
    engine.stop()
    const stats = engine.getStats()
    expect(stats.running).toBe(false)
  })

  it('pause()/resume() cycle', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    engine.start()
    expect(engine.getStats().running).toBe(true)

    engine.pause()
    expect(engine.getStats().running).toBe(false)

    engine.resume()
    expect(engine.getStats().running).toBe(true)
  })

  it('resize() updates canvas dimensions (physical pixels = css * dpr)', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    engine.resize(400, 300)

    // dpr is 2, so physical = css * 2
    expect(canvas.width).toBe(800)
    expect(canvas.height).toBe(600)
    expect(canvas.style.width).toBe('400px')
    expect(canvas.style.height).toBe('300px')
  })

  it('updateConfig() changes particle count', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    engine.start()
    expect(engine.getStats().particleCount).toBe(50)

    engine.updateConfig({ ...defaultConfig, count: 100 })
    expect(engine.getStats().particleCount).toBe(100)
  })

  it('onError callback fires when render throws', () => {
    const canvas = createMockCanvas()
    const ctx = canvas.getContext('2d')!
    ;(ctx.clearRect as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('render failure')
    })

    const engine = new ParticleEngine(canvas, defaultConfig)
    const errorHandler = vi.fn()
    engine.onError = errorHandler

    engine.start()

    // Execute the raf callback to trigger render
    if (rafCallbacks.length > 0) {
      rafCallbacks[rafCallbacks.length - 1](16)
    }

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error))
    expect(errorHandler).toHaveBeenCalledWith(expect.objectContaining({ message: 'render failure' }))
    expect(engine.getStats().running).toBe(false)
  })

  it('getStats() returns fps, particleCount, activeCount', () => {
    const canvas = createMockCanvas()
    const engine = new ParticleEngine(canvas, defaultConfig)
    engine.start()
    const stats = engine.getStats()
    expect(stats).toHaveProperty('fps')
    expect(stats).toHaveProperty('particleCount')
    expect(stats).toHaveProperty('activeCount')
    expect(stats).toHaveProperty('running')
    expect(typeof stats.fps).toBe('number')
    expect(typeof stats.particleCount).toBe('number')
    expect(typeof stats.activeCount).toBe('number')
  })
})
