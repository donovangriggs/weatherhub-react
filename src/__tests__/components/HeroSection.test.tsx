import { renderWithContext } from '../../test/renderWithContext'
import { HeroSection } from '../../components/hero/HeroSection'

describe('HeroSection', () => {
  it('renders current temperature in celsius by default', () => {
    const { getAllByText } = renderWithContext(<HeroSection />)
    // 72°F = 22°C — both compact (mobile) and full (desktop) views render in jsdom
    const temps = getAllByText('22°')
    expect(temps.length).toBeGreaterThanOrEqual(1)
  })

  it('renders location name', () => {
    const { getAllByText } = renderWithContext(<HeroSection />)
    const locations = getAllByText(/San Francisco/)
    expect(locations.length).toBeGreaterThanOrEqual(1)
  })

  it('renders weather condition', () => {
    const { getAllByText } = renderWithContext(<HeroSection />)
    const conditions = getAllByText('Partly Cloudy')
    expect(conditions.length).toBeGreaterThanOrEqual(1)
  })

  it('renders high and low temps in celsius', () => {
    const { getAllByText } = renderWithContext(<HeroSection />)
    // 78°F = 26°C, 64°F = 18°C
    const highTemps = getAllByText(/H: 26°/)
    expect(highTemps.length).toBeGreaterThanOrEqual(1)
    const lowTemps = getAllByText(/L: 18°/)
    expect(lowTemps.length).toBeGreaterThanOrEqual(1)
  })

  it('renders quick stats in metric', () => {
    const { getByText } = renderWithContext(<HeroSection />)
    // 12 mph = 19 km/h, 0 in = 0 mm
    expect(getByText('0 mm')).toBeInTheDocument()
    expect(getByText('19 km/h')).toBeInTheDocument()
    expect(getByText('Mod 5')).toBeInTheDocument()
  })

  it('renders quick stats in imperial when fahrenheit', () => {
    const { getByText } = renderWithContext(<HeroSection />, { unit: 'fahrenheit' })
    expect(getByText('0 in')).toBeInTheDocument()
    expect(getByText('12 mph')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    const { container } = renderWithContext(<HeroSection />, {
      isLoading: true,
      weatherState: null,
    })
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders temperatures in fahrenheit when selected', () => {
    const { getAllByText } = renderWithContext(<HeroSection />, { unit: 'fahrenheit' })
    const temps = getAllByText('72°')
    expect(temps.length).toBeGreaterThanOrEqual(1)
  })
})
