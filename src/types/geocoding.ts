export interface GeocodingResponse {
  results?: GeocodingResult[]
  generationtime_ms: number
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation: number
  feature_code: string
  country_code: string
  timezone: string
  population: number
  postcodes?: string[]
  country: string
  admin1?: string
  admin2?: string
  admin3?: string
}
