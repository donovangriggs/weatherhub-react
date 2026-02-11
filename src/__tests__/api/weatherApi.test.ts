import { fetchWeather } from '../../api/weatherApi'
import { mockApiResponse } from '../../test/mocks/weatherData'

describe('fetchWeather', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('calls the correct URL with expected parameters', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })

    await fetchWeather(37.7749, -122.4194)

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(calledUrl).toContain('api.open-meteo.com')
    expect(calledUrl).toContain('latitude=37.7749')
    expect(calledUrl).toContain('longitude=-122.4194')
    expect(calledUrl).toContain('past_days=3')
    expect(calledUrl).toContain('forecast_days=4')
    expect(calledUrl).toContain('temperature_unit=fahrenheit')
  })

  it('returns parsed response on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })

    const result = await fetchWeather(37.7749, -122.4194)
    expect(result.current.temperature_2m).toBe(72)
    expect(result.daily.time).toHaveLength(7)
  })

  it('throws on non-OK response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    await expect(fetchWeather(0, 0)).rejects.toThrow('Weather API error: 500')
  })
})
