import { renderWithContext } from '../../test/renderWithContext'
import { TemporalWindow } from '../../components/temporal/TemporalWindow'

describe('TemporalWindow', () => {
  it('renders section header', () => {
    const { getByText } = renderWithContext(<TemporalWindow />)
    expect(getByText('Temporal Window')).toBeInTheDocument()
  })

  it('renders 7 day tiles', () => {
    const { getAllByRole } = renderWithContext(<TemporalWindow />)
    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(7)
  })

  it('shows loading skeletons when loading', () => {
    const { container } = renderWithContext(<TemporalWindow />, {
      isLoading: true,
      weatherState: null,
    })
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(7)
  })
})
