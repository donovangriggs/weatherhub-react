import { renderWithContext } from '../../test/renderWithContext'
import { Navbar } from '../../components/layout/Navbar'

describe('Navbar', () => {
  it('renders the logo text', () => {
    const { getByText } = renderWithContext(<Navbar />)
    expect(getByText('Weather')).toBeInTheDocument()
    expect(getByText('Hub')).toBeInTheDocument()
  })

  it('renders the search input', () => {
    const { getAllByPlaceholderText } = renderWithContext(<Navbar />)
    const inputs = getAllByPlaceholderText('Search city or zip code...')
    expect(inputs.length).toBeGreaterThanOrEqual(1)
  })

  it('renders unit toggle buttons', () => {
    const { getByText } = renderWithContext(<Navbar />)
    expect(getByText('°F')).toBeInTheDocument()
    expect(getByText('°C')).toBeInTheDocument()
  })

  it('highlights fahrenheit button when unit is fahrenheit', () => {
    const { getByText } = renderWithContext(<Navbar />, { unit: 'fahrenheit' })
    const fButton = getByText('°F')
    expect(fButton.className).toContain('text-white')
  })

  it('highlights celsius button when unit is celsius', () => {
    const { getByText } = renderWithContext(<Navbar />, { unit: 'celsius' })
    const cButton = getByText('°C')
    expect(cButton.className).toContain('text-white')
  })
})
