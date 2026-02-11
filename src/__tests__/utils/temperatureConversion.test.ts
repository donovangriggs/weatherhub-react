import { fahrenheitToCelsius, celsiusToFahrenheit, mphToKmh, inchesToMm } from '../../utils/temperatureConversion'

describe('fahrenheitToCelsius', () => {
  it('converts 32°F to 0°C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0)
  })

  it('converts 212°F to 100°C', () => {
    expect(fahrenheitToCelsius(212)).toBe(100)
  })

  it('converts 72°F correctly', () => {
    expect(fahrenheitToCelsius(72)).toBe(22)
  })

  it('handles negative values', () => {
    expect(fahrenheitToCelsius(-40)).toBe(-40)
  })

  it('rounds to nearest integer', () => {
    expect(fahrenheitToCelsius(100)).toBe(38)
  })
})

describe('celsiusToFahrenheit', () => {
  it('converts 0°C to 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
  })

  it('converts 100°C to 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBe(212)
  })

  it('handles negative values', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40)
  })
})

describe('mphToKmh', () => {
  it('converts 0 mph to 0 km/h', () => {
    expect(mphToKmh(0)).toBe(0)
  })

  it('converts 12 mph to 19 km/h', () => {
    expect(mphToKmh(12)).toBe(19)
  })

  it('converts 60 mph to 97 km/h', () => {
    expect(mphToKmh(60)).toBe(97)
  })
})

describe('inchesToMm', () => {
  it('converts 0 inches to 0 mm', () => {
    expect(inchesToMm(0)).toBe(0)
  })

  it('converts 1 inch to 25.4 mm', () => {
    expect(inchesToMm(1)).toBe(25.4)
  })

  it('converts 0.5 inches to 12.7 mm', () => {
    expect(inchesToMm(0.5)).toBe(12.7)
  })
})
