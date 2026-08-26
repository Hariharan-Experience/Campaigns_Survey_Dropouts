/**
 * Possible contributors to a question's dropout.
 *
 * These are deterministic rules over the calculated numbers — not model
 * output. They are shown to the researcher and also handed to Claude as
 * context when improving the question.
 */

const LONG_TEXT = 80
const SLOW_MULTIPLE = 2

export function possibleContributors(row, allRows) {
  const times = allRows.map((r) => r.avgSeconds).sort((a, b) => a - b)
  const medianTime = times[Math.floor(times.length / 2)]
  const contributors = []

  if (row.type === 'open_text') {
    contributors.push({
      label: 'Open-text answer',
      detail: 'Free typing costs more effort than tapping a scale.',
      severity: 'high',
    })
  }

  if (row.avgSeconds >= medianTime * SLOW_MULTIPLE) {
    contributors.push({
      label: 'Slow to answer',
      detail: `${row.avgSeconds}s average against a ${medianTime}s survey median.`,
      severity: 'high',
    })
  }

  if (row.text.length > LONG_TEXT) {
    contributors.push({
      label: 'Long wording',
      detail: `${row.text.length} characters — respondents re-read long asks.`,
      severity: 'medium',
    })
  }

  if (/,| and /i.test(row.text)) {
    contributors.push({
      label: 'Asks more than one thing',
      detail: 'A compound question is harder to answer in one box.',
      severity: 'medium',
    })
  }

  const position = row.order / allRows.length
  if (position > 0.5) {
    contributors.push({
      label: 'Late in the survey',
      detail: `Question ${row.order} of ${allRows.length} — fatigue has set in.`,
      severity: 'low',
    })
  }

  if (row.change > 1) {
    contributors.push({
      label: 'Worse than last period',
      detail: `Dropout is up ${row.change.toFixed(1)} pts, so something changed.`,
      severity: 'high',
    })
  }

  return contributors
}
