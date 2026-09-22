/**
 * Dropout derivation.
 *
 * Nothing here is stored in mockData — every rate, delta and status is
 * computed from the raw reached/dropped counts, so the table and funnel
 * stay correct if the underlying data changes.
 */

export const STATUS_THRESHOLDS = { watch: 10, high: 20 }

export const STATUS = {
  healthy: { id: 'healthy', label: 'Healthy' },
  watch: { id: 'watch', label: 'Watch' },
  high: { id: 'high', label: 'High friction' },
}

/** <10% Healthy · 10–20% Watch · >=20% High friction */
export function statusFor(dropoutRate) {
  if (dropoutRate >= STATUS_THRESHOLDS.high) return STATUS.high
  if (dropoutRate >= STATUS_THRESHOLDS.watch) return STATUS.watch
  return STATUS.healthy
}

const TYPE_LABELS = {
  rating: 'Rating',
  nps: 'NPS',
  open_text: 'Open text',
  single_select: 'Single select',
  multi_select: 'Multi select',
}

export const typeLabel = (type) => TYPE_LABELS[type] ?? type

/** 78 → "1m 18s", 9 → "9s" */
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s ? `${m}m ${s}s` : `${m}m`
}

/**
 * One row per question, in survey order.
 *
 * `dropoutRate` is of those who reached the question.
 * `completionRate` is cumulative — the share of everyone invited still in
 * the survey after this question — which is what the funnel plots. Reading
 * it per-question would just be 100 − dropoutRate and carry no new signal.
 */
export function buildDropoutRows(campaign) {
  const invited = campaign.metrics.current.respondents
  const finished = campaign.metrics.current.completed
  const abandoned = campaign.metrics.current.incomplete

  return campaign.questions.map((q) => {
    const cur = q.current
    const prev = q.previous

    const dropoutRate = (cur.dropped / cur.reached) * 100
    const previousDropoutRate = (prev.dropped / prev.reached) * 100

    return {
      id: q.id,
      order: q.order,
      text: q.text,
      type: q.type,
      typeLabel: typeLabel(q.type),

      reached: cur.reached,
      dropped: cur.dropped,
      survived: cur.completed,

      dropoutRate,
      completionRate: (cur.completed / invited) * 100,
      previousDropoutRate,
      change: dropoutRate - previousDropoutRate,

      avgSeconds: cur.avgSeconds,
      previousAvgSeconds: prev.avgSeconds,
      medianSeconds: cur.medianSeconds,
      previousMedianSeconds: prev.medianSeconds,

      // Affected respondents: the people this question cost the survey, and
      // what share of all abandonment it accounts for.
      affected: cur.dropped,
      shareOfDropouts: abandoned ? (cur.dropped / abandoned) * 100 : 0,

      // Theoretical upper bound: nobody drops here, every other question
      // behaves exactly as it does today. Never a forecast.
      completionGainPts: (cur.dropped / invited) * 100,
      projectedCompletionRate: ((finished + cur.dropped) / invited) * 100,

      status: statusFor(dropoutRate),
      previousStatus: statusFor(previousDropoutRate),

      // Shares of everyone invited — the funnel's geometry.
      shareSurvived: cur.completed / invited,
      shareDropped: cur.dropped / invited,
    }
  })
}

/** Highest current dropout. Found, never hard-coded. */
export function worstRow(rows) {
  return rows.reduce((worst, row) =>
    row.dropoutRate > worst.dropoutRate ? row : worst,
  )
}

/** Largest period-over-period worsening, if anything got worse at all. */
export function mostWorsenedRow(rows) {
  const worsened = rows.filter((r) => r.change > 0)
  if (!worsened.length) return null
  return worsened.reduce((most, row) => (row.change > most.change ? row : most))
}

export function statusCounts(rows) {
  return rows.reduce(
    (acc, r) => ({ ...acc, [r.status.id]: (acc[r.status.id] ?? 0) + 1 }),
    {},
  )
}

/** Mean dropout rate across the survey's questions — the comparison baseline. */
export function averageDropoutRate(rows) {
  if (!rows.length) return 0
  return rows.reduce((sum, r) => sum + r.dropoutRate, 0) / rows.length
}

/** Middle value; the mean of the middle pair when the count is even. */
export function median(values) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Where a question sits against the rest, 1 = worst. Ties share a rank.
 */
export function dropoutRank(row, rows) {
  return rows.filter((r) => r.dropoutRate > row.dropoutRate).length + 1
}

/**
 * Answer-time picture for one question, with the survey for context.
 *
 * Average above median means a tail: most answered quickly, some struggled.
 * Median is what a typical respondent experienced, so the two are reported
 * together rather than the average alone.
 */
export function answerTimeStats(row, rows, campaign) {
  const skew = row.avgSeconds - row.medianSeconds
  return {
    avgSeconds: row.avgSeconds,
    medianSeconds: row.medianSeconds,
    skew,
    skewRatio: row.medianSeconds ? row.avgSeconds / row.medianSeconds : 0,
    avgChange: row.avgSeconds - row.previousAvgSeconds,
    medianChange: row.medianSeconds - row.previousMedianSeconds,
    surveyAvgSeconds: rows.reduce((s, r) => s + r.avgSeconds, 0) / rows.length,
    surveyMedianSeconds: median(rows.map((r) => r.medianSeconds)),
    completionSeconds: campaign.metrics.current.medianCompletionSeconds,
  }
}
