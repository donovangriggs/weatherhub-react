export const formatDayLabel = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00')
  const day = date.toLocaleDateString('en-US', { weekday: 'short' })
  const num = date.getDate()
  return `${day}, ${num}`
}

export const formatFullDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export const formatTime = (isoStr: string): string => {
  const date = new Date(isoStr)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getTimeAgo = (date: Date): string => {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}
