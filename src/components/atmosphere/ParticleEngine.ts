type ParticleType = 'rain' | 'snow' | 'hail'

interface ParticleConfig {
  type: ParticleType
  count: number
  windSpeed: number
  gravity: number
  opacity: [number, number]
  size: [number, number]
  speed: [number, number]
}

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; active: boolean
}

interface EngineStats {
  fps: number; particleCount: number; activeCount: number; running: boolean
}

const MAX_PARTICLES = 200
const MAX_DPR = 2
const rand = (min: number, max: number) => min + Math.random() * (max - min)

class ParticleEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: ParticleConfig
  private particles: Particle[] = []
  private rafId: number | null = null
  private running = false
  private lastTimestamp = 0
  private fps = 0
  private dpr = 1
  onError: ((error: Error) => void) | null = null

  constructor(canvas: HTMLCanvasElement, config: ParticleConfig) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2D rendering context')
    this.ctx = ctx
    this.config = { ...config, count: Math.min(config.count, MAX_PARTICLES) }
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.initParticles()
    this.lastTimestamp = 0
    this.rafId = requestAnimationFrame((t) => this.render(t))
  }

  stop(): void {
    this.cancelRaf()
    this.running = false
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i] = { ...this.particles[i], active: false }
    }
  }

  pause(): void {
    this.cancelRaf()
    this.running = false
  }

  resume(): void {
    if (this.running) return
    this.running = true
    this.lastTimestamp = 0
    this.rafId = requestAnimationFrame((t) => this.render(t))
  }

  resize(width: number, height: number): void {
    this.dpr = Math.min(window.devicePixelRatio, MAX_DPR)
    this.canvas.width = width * this.dpr
    this.canvas.height = height * this.dpr
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.dpr, this.dpr)
  }

  updateConfig(config: ParticleConfig): void {
    const cappedCount = Math.min(config.count, MAX_PARTICLES)
    const prevCount = this.config.count
    this.config = { ...config, count: cappedCount }
    if (cappedCount > prevCount) {
      const w = this.canvas.width / (this.dpr || 1)
      for (let i = prevCount; i < cappedCount; i++) this.particles.push(this.createParticle(w))
    } else if (cappedCount < prevCount) {
      this.particles = this.particles.slice(0, cappedCount)
    }
  }

  getStats(): EngineStats {
    let activeCount = 0
    for (const p of this.particles) { if (p.active) activeCount++ }
    return { fps: Math.round(this.fps), particleCount: this.particles.length, activeCount, running: this.running }
  }

  private cancelRaf(): void {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null }
  }

  private initParticles(): void {
    const w = this.canvas.width / (this.dpr || 1)
    const h = this.canvas.height / (this.dpr || 1)
    this.particles = []
    for (let i = 0; i < this.config.count; i++) {
      const p = this.createParticle(w)
      this.particles.push({ ...p, y: -rand(0, h) })
    }
  }

  private createParticle(canvasWidth: number): Particle {
    const { speed, size, opacity, windSpeed } = this.config
    return {
      x: rand(0, canvasWidth), y: -rand(10, 60),
      vx: windSpeed + rand(-0.3, 0.3), vy: rand(speed[0], speed[1]),
      size: rand(size[0], size[1]), opacity: rand(opacity[0], opacity[1]), active: true,
    }
  }

  private render(timestamp: number): void {
    if (!this.running) return
    try {
      if (this.lastTimestamp > 0) {
        const delta = timestamp - this.lastTimestamp
        this.fps = delta > 0 ? 1000 / delta : 0
      }
      this.lastTimestamp = timestamp

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const w = this.canvas.width / (this.dpr || 1)
      const h = this.canvas.height / (this.dpr || 1)
      const { gravity, type } = this.config

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i]
        if (!p.active) continue
        const updated: Particle = {
          ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + gravity * 0.01,
        }
        if (updated.y > h || updated.x < -20 || updated.x > w + 20) {
          this.particles[i] = this.createParticle(w)
        } else {
          this.particles[i] = updated
          this.drawParticle(updated, type)
        }
      }
      this.rafId = requestAnimationFrame((t) => this.render(t))
    } catch (err) {
      this.stop()
      if (this.onError && err instanceof Error) this.onError(err)
    }
  }

  private drawParticle(p: Particle, type: ParticleType): void {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = p.opacity
    switch (type) {
      case 'rain':
        ctx.strokeStyle = 'white'
        ctx.lineWidth = rand(1, 2)
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x, p.y + p.size * 3)
        ctx.stroke()
        break
      case 'snow':
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'hail':
        ctx.fillStyle = 'white'
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
        break
    }
    ctx.restore()
  }
}

export { ParticleEngine }
export type { ParticleConfig, Particle, ParticleType, EngineStats }
