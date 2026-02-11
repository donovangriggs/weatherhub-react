import { getWeatherInfo } from '../../utils/weatherCodeMap'

describe('getWeatherInfo', () => {
  it('returns clear sky info for code 0', () => {
    const info = getWeatherInfo(0)
    expect(info.description).toBe('Clear Sky')
    expect(info.icon).toBe('wb_sunny')
  })

  it('returns partly cloudy for code 2', () => {
    const info = getWeatherInfo(2)
    expect(info.description).toBe('Partly Cloudy')
    expect(info.icon).toBe('partly_cloudy_day')
  })

  it('returns thunderstorm for code 95', () => {
    const info = getWeatherInfo(95)
    expect(info.description).toBe('Thunderstorm')
    expect(info.icon).toBe('thunderstorm')
  })

  it('returns unknown for unrecognized code', () => {
    const info = getWeatherInfo(999)
    expect(info.description).toBe('Unknown')
    expect(info.icon).toBe('help')
  })
})
