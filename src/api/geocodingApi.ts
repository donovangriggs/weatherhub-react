import type { GeocodingResponse, GeocodingResult } from '../types/geocoding'
import type { Location } from '../types/weather'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export const reverseGeocode = async (lat: number, lon: number): Promise<Location> => {
  const params = new URLSearchParams({
    name: `${lat.toFixed(2)},${lon.toFixed(2)}`,
    count: '1',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODING_URL}?${params}`)
  if (!response.ok) throw new Error('Reverse geocoding failed')
  const data = (await response.json()) as GeocodingResponse
  if (data.results?.length) {
    const r = data.results[0]
    return {
      name: r.name,
      region: r.admin1 ?? '',
      country: r.country,
      latitude: lat,
      longitude: lon,
    }
  }
  return { name: 'My Location', region: '', country: '', latitude: lat, longitude: lon }
}

export const searchCities = async (query: string): Promise<GeocodingResult[]> => {
  if (query.trim().length < 2) return []

  const params = new URLSearchParams({
    name: query.trim(),
    count: '5',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODING_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`)
  }
  const data = (await response.json()) as GeocodingResponse
  return data.results ?? []
}
