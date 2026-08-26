/**
 * Shared date filter.
 *
 * "Today" is pinned to the campaign data's end date so the relative ranges
 * land inside the mock data instead of resolving to an empty future window.
 */
export const TODAY = '2026-08-26'

export const DATE_FILTERS = [
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last30', label: 'Last 30 days' },
  { id: 'last90', label: 'Last 90 days' },
  { id: 'thisQuarter', label: 'This quarter' },
  { id: 'prevQuarter', label: 'Previous quarter' },
]

export const DEFAULT_FILTER = 'thisQuarter'

const iso = (d) => d.toISOString().slice(0, 10)

function minusDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  return iso(d)
}

function quarterBounds(dateStr, offset = 0) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const q = Math.floor(d.getUTCMonth() / 3) + offset
  const year = d.getUTCFullYear() + Math.floor(q / 4)
  const qi = ((q % 4) + 4) % 4
  const start = new Date(Date.UTC(year, qi * 3, 1))
  const end = new Date(Date.UTC(year, qi * 3 + 3, 0))
  return { start: iso(start), end: iso(end), quarter: `Q${qi + 1} ${year}` }
}

export function resolveRange(id, today = TODAY) {
  switch (id) {
    case 'last7':
      return { id, start: minusDays(today, 6), end: today, label: 'Last 7 days' }
    case 'last30':
      return { id, start: minusDays(today, 29), end: today, label: 'Last 30 days' }
    case 'last90':
      return { id, start: minusDays(today, 89), end: today, label: 'Last 90 days' }
    case 'prevQuarter': {
      const q = quarterBounds(today, -1)
      return { id, start: q.start, end: q.end, label: `Previous quarter (${q.quarter})` }
    }
    case 'thisQuarter':
    default: {
      const q = quarterBounds(today, 0)
      return { id: 'thisQuarter', start: q.start, end: q.end, label: `This quarter (${q.quarter})` }
    }
  }
}

export function inRange(dateStr, range) {
  return dateStr >= range.start && dateStr <= range.end
}

/**
 * Both periods of responses form one pool; the filter selects from it by
 * date. That way "Previous quarter" genuinely surfaces the earlier answers
 * rather than emptying the panel.
 */
export function filterResponses(campaign, range) {
  return [...campaign.responses.current, ...campaign.responses.previous].filter(
    (r) => inRange(r.submittedAt, range),
  )
}

export function formatRange(range) {
  const fmt = (s) =>
    new Date(`${s}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  return `${fmt(range.start)} – ${fmt(range.end)}`
}
