interface WeatherCodeInfo {
  description: string
  icon: string
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear Sky', icon: 'wb_sunny' },
  1: { description: 'Mainly Clear', icon: 'wb_sunny' },
  2: { description: 'Partly Cloudy', icon: 'partly_cloudy_day' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Foggy', icon: 'foggy' },
  48: { description: 'Rime Fog', icon: 'foggy' },
  51: { description: 'Light Drizzle', icon: 'rainy' },
  53: { description: 'Moderate Drizzle', icon: 'rainy' },
  55: { description: 'Dense Drizzle', icon: 'rainy' },
  56: { description: 'Light Freezing Drizzle', icon: 'weather_snowy' },
  57: { description: 'Dense Freezing Drizzle', icon: 'weather_snowy' },
  61: { description: 'Slight Rain', icon: 'rainy' },
  63: { description: 'Moderate Rain', icon: 'rainy' },
  65: { description: 'Heavy Rain', icon: 'rainy' },
  66: { description: 'Light Freezing Rain', icon: 'weather_snowy' },
  67: { description: 'Heavy Freezing Rain', icon: 'weather_snowy' },
  71: { description: 'Slight Snow', icon: 'weather_snowy' },
  73: { description: 'Moderate Snow', icon: 'weather_snowy' },
  75: { description: 'Heavy Snow', icon: 'weather_snowy' },
  77: { description: 'Snow Grains', icon: 'grain' },
  80: { description: 'Slight Showers', icon: 'rainy' },
  81: { description: 'Moderate Showers', icon: 'rainy' },
  82: { description: 'Violent Showers', icon: 'thunderstorm' },
  85: { description: 'Slight Snow Showers', icon: 'weather_snowy' },
  86: { description: 'Heavy Snow Showers', icon: 'weather_snowy' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm' },
  96: { description: 'Thunderstorm with Hail', icon: 'thunderstorm' },
  99: { description: 'Thunderstorm with Heavy Hail', icon: 'thunderstorm' },
}

export const getWeatherInfo = (code: number): WeatherCodeInfo => {
  return WEATHER_CODE_MAP[code] ?? { description: 'Unknown', icon: 'help' }
}
