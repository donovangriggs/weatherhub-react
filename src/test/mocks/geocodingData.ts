import type { GeocodingResponse } from '../../types/geocoding'

export const mockGeocodingResponse: GeocodingResponse = {
  results: [
    {
      id: 5391959,
      name: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      elevation: 16,
      feature_code: 'PPLA2',
      country_code: 'US',
      timezone: 'America/Los_Angeles',
      population: 864816,
      country: 'United States',
      admin1: 'California',
    },
    {
      id: 3621849,
      name: 'San Francisco',
      latitude: 10.0,
      longitude: -84.08,
      elevation: 900,
      feature_code: 'PPLA',
      country_code: 'CR',
      timezone: 'America/Costa_Rica',
      population: 55923,
      country: 'Costa Rica',
      admin1: 'Heredia',
    },
  ],
  generationtime_ms: 0.5,
}
