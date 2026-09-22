/**
 * Dropout trend over time.
 *
 * The weekly buckets in mockData sum exactly to the headline respondent and
 * incomplete counts (verifyCampaign asserts it), so the rate this file plots
 * and the rate on the metrics card are the same number seen two ways.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatWeek(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

const rate = (bucket) =>
  bucket.respondents ? (bucket.dropped / bucket.respondents) * 100 : 0

function periodRate(buckets) {
  const respondents = buckets.reduce((s, b) => s + b.respondents, 0)
  const dropped = buckets.reduce((s, b) => s + b.dropped, 0)
  return respondents ? (dropped / respondents) * 100 : 0
}

/**
 * One continuous series across both periods, tagged so the chart can mark
 * where the current period starts.
 */
export function buildTrendSeries(campaign) {
  const previous = campaign.trend?.previous ?? []
  const current = campaign.trend?.current ?? []

  const points = [...previous, ...current].map((b, i) => ({
    ...b,
    index: i,
    period: i < previous.length ? 'previous' : 'current',
    dropoutRate: rate(b),
  }))

  const previousRate = periodRate(previous)
  const currentRate = periodRate(current)
  const change = currentRate - previousRate

  const currentPoints = points.filter((p) => p.period === 'current')
  const peak = currentPoints.reduce(
    (worst, p) => (p.dropoutRate > worst.dropoutRate ? p : worst),
    currentPoints[0],
  )

  return {
    points,
    currentStartIndex: previous.length,
    previousRate,
    currentRate,
    change,
    direction: Math.abs(change) < 0.05 ? 'flat' : change > 0 ? 'up' : 'down',
    peak,
    latest: points[points.length - 1],
    previousLabel: campaign.period.previous.label,
    currentLabel: campaign.period.current.label,
  }
}
