import { searchCities } from '../../api/geocodingApi'
import { mockGeocodingResponse } from '../../test/mocks/geocodingData'

describe('searchCities', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('returns empty array for short queries', async () => {
    const results = await searchCities('a')
    expect(results).toEqual([])
  })

  it('returns empty array for empty string', async () => {
    const results = await searchCities('')
    expect(results).toEqual([])
  })

  it('calls geocoding API and returns results', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGeocodingResponse),
    })

    const results = await searchCities('San Francisco')
    expect(results).toHaveLength(2)
    expect(results[0].name).toBe('San Francisco')
    expect(results[0].country).toBe('United States')
  })

  it('returns empty array when API returns no results', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ generationtime_ms: 0.1 }),
    })

    const results = await searchCities('xyznonexistent')
    expect(results).toEqual([])
  })

  it('throws on API error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    })

    await expect(searchCities('test')).rejects.toThrow('Geocoding API error: 429')
  })
})
