import { formatDayLabel, formatFullDate, formatTime } from '../../utils/dateFormatting'

describe('formatDayLabel', () => {
  it('formats a date string to short day and number', () => {
    const label = formatDayLabel('2024-10-21')
    expect(label).toMatch(/Mon, 21/)
  })

  it('formats another date correctly', () => {
    const label = formatDayLabel('2024-10-25')
    expect(label).toMatch(/Fri, 25/)
  })
})

describe('formatFullDate', () => {
  it('formats a date string to a long weekday with month and day', () => {
    const full = formatFullDate('2024-10-24')
    expect(full).toContain('Thursday')
    expect(full).toContain('Oct')
    expect(full).toContain('24')
  })
})

describe('formatTime', () => {
  it('formats an ISO time string to a readable time', () => {
    const time = formatTime('2024-10-24T14:45')
    expect(time).toMatch(/2:45\s*PM/)
  })

  it('formats morning time correctly', () => {
    const time = formatTime('2024-10-24T07:18')
    expect(time).toMatch(/7:18\s*AM/)
  })
})
