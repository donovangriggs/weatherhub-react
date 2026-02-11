import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { WeatherContextValue } from '../context/weatherContextValue'
import { WeatherContext } from '../context/weatherContextValue'
import { mockWeatherState } from './mocks/weatherData'

const defaultContextValue: WeatherContextValue = {
  weatherState: mockWeatherState,
  isLoading: false,
  error: null,
  unit: 'celsius',
  setUnit: vi.fn(),
  toggleUnit: vi.fn(),
  selectDay: vi.fn(),
  changeLocation: vi.fn(),
  refresh: vi.fn(),
}

export const renderWithContext = (
  ui: ReactNode,
  overrides: Partial<WeatherContextValue> = {},
) => {
  const value = { ...defaultContextValue, ...overrides }
  return {
    ...render(
      <WeatherContext.Provider value={value}>{ui}</WeatherContext.Provider>,
    ),
    contextValue: value,
  }
}
