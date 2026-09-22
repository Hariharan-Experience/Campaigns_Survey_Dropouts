/**
 * Shared date filter.
 *
 * "Today" is pinned to the campaign data's end date so the relative ranges
 * land inside the mock data instead of resolving to an empty future window.
 */
export const TODAY = '2026-08-26'

export const DATE_FILTERS = [
  { id: 'last7', label: 'Last 7 days', days: 7 },
  { id: 'last15', label: 'Last 15 days', days: 15 },
  { id: 'last30', label: 'Last 30 days', days: 30 },
  { id: 'last90', label: 'Last 90 days', days: 90 },
]

export const DEFAULT_FILTER = 'last30'

const iso = (d) => d.toISOString().slice(0, 10)

function minusDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  return iso(d)
}

export function resolveRange(id, today = TODAY) {
  const filter =
    DATE_FILTERS.find((f) => f.id === id) ??
    DATE_FILTERS.find((f) => f.id === DEFAULT_FILTER)

  // The window is inclusive of today, so an N-day range reaches back N-1.
  return {
    id: filter.id,
    start: minusDays(today, filter.days - 1),
    end: today,
    label: filter.label,
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
