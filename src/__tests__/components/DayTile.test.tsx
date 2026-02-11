import { renderWithContext } from '../../test/renderWithContext'
import { DayTile } from '../../components/temporal/DayTile'
import { mockWeatherState } from '../../test/mocks/weatherData'
import userEvent from '@testing-library/user-event'

const day = mockWeatherState.days[3] // today

describe('DayTile', () => {
  it('renders the day label and temperature in celsius by default', () => {
    const { getByText } = renderWithContext(
      <DayTile day={day} index={3} isToday isHistory={false} isSelected={false} />,
    )
    // 78°F = 26°C
    expect(getByText('26°')).toBeInTheDocument()
    expect(getByText(/Thu, 24/)).toBeInTheDocument()
  })

  it('shows CURRENT badge when today and selected', () => {
    const { getByText } = renderWithContext(
      <DayTile day={day} index={3} isToday isHistory={false} isSelected />,
    )
    expect(getByText('Current')).toBeInTheDocument()
  })

  it('shows CURRENT badge on today even when not selected', () => {
    const { getByText } = renderWithContext(
      <DayTile day={day} index={3} isToday isHistory={false} isSelected={false} />,
    )
    expect(getByText('Current')).toBeInTheDocument()
  })

  it('does not show CURRENT badge on non-today tiles', () => {
    const historyDay = mockWeatherState.days[0]
    const { queryByText } = renderWithContext(
      <DayTile day={historyDay} index={0} isToday={false} isHistory isSelected={false} />,
    )
    expect(queryByText('Current')).not.toBeInTheDocument()
  })

  it('applies opacity class for history tiles', () => {
    const historyDay = mockWeatherState.days[0]
    const { container } = renderWithContext(
      <DayTile day={historyDay} index={0} isToday={false} isHistory isSelected={false} />,
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('opacity-60')
  })

  it('applies glass-active class when selected', () => {
    const { container } = renderWithContext(
      <DayTile day={day} index={3} isToday isHistory={false} isSelected />,
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('glass-active')
  })

  it('calls selectDay on click', async () => {
    const selectDay = vi.fn()
    const { getByRole } = renderWithContext(
      <DayTile day={day} index={3} isToday isHistory={false} isSelected={false} />,
      { selectDay },
    )
    await userEvent.click(getByRole('button'))
    expect(selectDay).toHaveBeenCalledWith(3)
  })

  it('displays celsius when unit is celsius', () => {
    const { getByText } = renderWithContext(
      <DayTile day={day} index={3} isToday isHistory={false} isSelected={false} />,
      { unit: 'celsius' },
    )
    // 78°F = 26°C
    expect(getByText('26°')).toBeInTheDocument()
  })
})
