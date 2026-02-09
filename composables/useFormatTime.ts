// Shared date/time formatting for chat (conversation list and message bubbles).

function isToday(d: Date, now: Date) {
  return d.toDateString() === now.toDateString()
}

function isYesterday(d: Date, now: Date) {
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  return d.toDateString() === yesterday.toDateString()
}

/** For conversation list: time only today, "Yesterday", or "Mon 5" */
function formatTimeShort(date: Date): string {
  const d = new Date(date)
  const now = new Date()
  if (isToday(d, now)) return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  if (isYesterday(d, now)) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** For message bubble: "2:30 PM" / "Yesterday 2:30 PM" / "Mon 5 2:30 PM" */
function formatTimeWithDate(date: Date): string {
  const d = new Date(date)
  const now = new Date()
  const timeStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  if (isToday(d, now)) return timeStr
  if (isYesterday(d, now)) return `Yesterday ${timeStr}`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + timeStr
}

export function useFormatTime() {
  return { formatTimeShort, formatTimeWithDate }
}
