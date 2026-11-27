const eastern = 'America/New_York';

/** `YYYY-MM-DD` → "Friday, November 27, 2026" without a timezone shift. */
export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatMonth(year: string, month: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: eastern,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

export function formatUpdated(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: eastern,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}
