/** CSV building and browser download. No server round trip. */

function escapeCell(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(headers, rows) {
  return [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n')
}

export function downloadCsv(filename, csv) {
  // BOM so Excel reads UTF-8 quotes and dashes correctly.
  const blob = new Blob([`﻿${csv}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function exportDropoutData(campaign, rows, range) {
  const csv = toCsv(
    [
      'Question #',
      'Question',
      'Type',
      'Reached',
      'Dropped',
      'Dropout rate %',
      'Completion rate % (cumulative)',
      `Previous period % (${campaign.period.previous.label})`,
      'Change (pts)',
      'Avg. time (s)',
      'Status',
    ],
    rows.map((r) => [
      r.order,
      r.text,
      r.typeLabel,
      r.reached,
      r.dropped,
      r.dropoutRate.toFixed(1),
      r.completionRate.toFixed(1),
      r.previousDropoutRate.toFixed(1),
      r.change.toFixed(1),
      r.avgSeconds,
      r.status.label,
    ]),
  )
  downloadCsv(`${slug(campaign.name)}-dropout-${range.id}.csv`, csv)
}

export function exportResponseThemes(campaign, analysis, range) {
  const rows = [
    ['Overall summary', '', '', analysis.overallSummary, ''],
    [
      'Sentiment',
      '',
      '',
      `Positive ${analysis.sentiment.positive}%, Neutral ${analysis.sentiment.neutral}%, Negative ${analysis.sentiment.negative}%`,
      '',
    ],
    ['Top positive theme', '', '', analysis.topPositiveTheme || '—', ''],
    ['Top negative theme', '', '', analysis.topNegativeTheme || '—', ''],
    ...analysis.themes.map((t) => [
      t.name,
      t.responseCount,
      t.percentage,
      t.sentiment,
      `${t.summary} | ${t.quote}`,
    ]),
  ]
  const csv = toCsv(
    ['Theme', 'Responses', 'Share %', 'Sentiment', 'Detail | Quote'],
    rows,
  )
  downloadCsv(`${slug(campaign.name)}-themes-${range.id}.csv`, csv)
}

export function exportFullAnalysis(campaign, { rows, themes, range }) {
  const out = [
    ['Campaign', campaign.name, ''],
    ['Period', campaign.period.current.label, ''],
    ['Compared with', campaign.period.previous.label, ''],
    ['Date filter', range.label, ''],
    ['', '', ''],
    ['— Headline metrics —', '', ''],
    ['Respondents', campaign.metrics.current.respondents, campaign.metrics.previous.respondents],
    ['Completed', campaign.metrics.current.completed, campaign.metrics.previous.completed],
    ['Incomplete', campaign.metrics.current.incomplete, campaign.metrics.previous.incomplete],
    ['Completion rate %', campaign.metrics.current.completionRate, campaign.metrics.previous.completionRate],
    ['Average score', campaign.metrics.current.averageScore, campaign.metrics.previous.averageScore],
    ['', '', ''],
    ['— Dropout by question —', '', ''],
    ['Question', 'Dropout rate %', 'Status'],
    ...rows.map((r) => [`Q${r.order} ${r.text}`, r.dropoutRate.toFixed(1), r.status.label]),
  ]

  if (themes) {
    out.push(
      ['', '', ''],
      ['— Response themes (Claude) —', '', ''],
      ['Overall summary', themes.overallSummary, ''],
      ['Sentiment', `Positive ${themes.sentiment.positive}%, Neutral ${themes.sentiment.neutral}%, Negative ${themes.sentiment.negative}%`, ''],
      ['Top positive theme', themes.topPositiveTheme || '—', ''],
      ['Top negative theme', themes.topNegativeTheme || '—', ''],
      ['', '', ''],
      ['Theme', 'Responses', 'Share % / Sentiment'],
      ...themes.themes.map((t) => [t.name, t.responseCount, `${t.percentage}% ${t.sentiment}`]),
    )
  }

  downloadCsv(
    `${slug(campaign.name)}-full-analysis-${range.id}.csv`,
    toCsv(['Field', 'Value', 'Previous'], out),
  )
}
