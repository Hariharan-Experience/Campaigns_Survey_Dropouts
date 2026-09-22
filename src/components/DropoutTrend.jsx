import { useEffect, useMemo, useRef, useState } from 'react'
import { buildTrendSeries, formatWeek } from '../utils/trend'
import { formatDuration } from '../utils/dropout'

const n = (v) => v.toLocaleString('en-US')
const pct = (v) => `${v.toFixed(1)}%`

const HEIGHT = 190
const PAD = { top: 14, right: 16, bottom: 24, left: 36 }

/** Chart width comes from layout, so the SVG is drawn at its real size. */
function useWidth(ref) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(el)
    setWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [ref])
  return width
}

function Delta({ value }) {
  const flat = Math.abs(value) < 0.05
  // Dropout going up is bad; down is good.
  const tone = flat
    ? 'text-ink-muted'
    : value > 0
      ? 'text-crit-ink'
      : 'text-good-ink'
  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold ${tone}`}>
      <span aria-hidden="true" className="text-[8px] leading-none">
        {flat ? '■' : value > 0 ? '▲' : '▼'}
      </span>
      <span className="tabnum">
        {value > 0 ? '+' : value < 0 ? '−' : '±'}
        {Math.abs(value).toFixed(1)} pts
      </span>
    </span>
  )
}

export default function DropoutTrend({ campaign }) {
  const series = useMemo(() => buildTrendSeries(campaign), [campaign])
  const wrapRef = useRef(null)
  const width = useWidth(wrapRef)
  const [active, setActive] = useState(null)

  const { points } = series
  const innerW = Math.max(width - PAD.left - PAD.right, 10)
  const innerH = HEIGHT - PAD.top - PAD.bottom

  // Rates are shares, so the scale starts at zero — no truncated baseline.
  const maxRate = Math.max(...points.map((p) => p.dropoutRate), 1)
  const top = Math.ceil(maxRate / 15) * 15
  const ticks = [0, top / 3, (top * 2) / 3, top]

  const x = (i) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
  const y = (rate) => PAD.top + innerH - (rate / top) * innerH

  // The two periods need not be adjacent in time — a pulse survey compares
  // February with August — so each is drawn as its own path. One continuous
  // line across the boundary would imply a trajectory that was never measured.
  const base = PAD.top + innerH
  const pathFor = (from, to) =>
    points
      .slice(from, to)
      .map((p, i) => `${i ? 'L' : 'M'}${x(from + i)},${y(p.dropoutRate)}`)
      .join(' ')
  const areaFor = (from, to) =>
    to - from > 0
      ? `${pathFor(from, to)} L${x(to - 1)},${base} L${x(from)},${base} Z`
      : ''

  const segments = [
    { id: 'previous', from: 0, to: series.currentStartIndex },
    { id: 'current', from: series.currentStartIndex, to: points.length },
  ].filter((seg) => seg.to > seg.from)

  const boundaryX = series.currentStartIndex > 0
    ? (x(series.currentStartIndex - 1) + x(series.currentStartIndex)) / 2
    : null

  // First, last, and a few evenly spaced weeks in between.
  const labelEvery = Math.max(1, Math.ceil(points.length / 5))
  const shown = active ?? null

  const move = (step) => {
    setActive((cur) => {
      const next = (cur === null ? points.length - 1 : cur) + step
      return Math.min(Math.max(next, 0), points.length - 1)
    })
  }

  return (
    <section className="card mb-4 overflow-hidden">
      <div className="card-head">
        <div>
          <div className="eyebrow">Dropout trend</div>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight">
            Is dropout getting better or worse?
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Weekly dropout rate across {series.previousLabel} and{' '}
            {series.currentLabel} · each point is one week of respondents
          </p>
        </div>

        <div className="text-right">
          <div className="eyebrow">{series.currentLabel}</div>
          <div className="mt-0.5 flex items-baseline justify-end gap-2">
            <span className="text-[22px] leading-none font-semibold tabnum">
              {pct(series.currentRate)}
            </span>
            <Delta value={series.change} />
          </div>
          <p className="mt-1 text-[11px] text-ink-muted">
            {series.previousLabel} averaged {pct(series.previousRate)}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <div ref={wrapRef} className="relative">
          {width > 0 && (
            <svg
              width={width}
              height={HEIGHT}
              role="img"
              tabIndex={0}
              aria-label={`Weekly dropout rate. ${series.previousLabel} averaged ${pct(series.previousRate)}, ${series.currentLabel} averaged ${pct(series.currentRate)}. Use the arrow keys to read each week.`}
              className="touch-pan-y outline-none focus-visible:rounded-control"
              onPointerLeave={() => setActive(null)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
                if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
                if (e.key === 'Escape') setActive(null)
              }}
            >
              <defs>
                <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Recessive grid */}
              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD.left}
                    x2={width - PAD.right}
                    y1={y(t)}
                    y2={y(t)}
                    stroke="var(--line-soft)"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.left - 8}
                    y={y(t) + 3}
                    textAnchor="end"
                    className="fill-[var(--ink-muted)] text-[9.5px] tabular-nums"
                  >
                    {Math.round(t)}%
                  </text>
                </g>
              ))}

              {/* Previous-period average, as the comparison baseline */}
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(series.previousRate)}
                y2={y(series.previousRate)}
                stroke="var(--ink-faint)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Where the current period starts */}
              {boundaryX !== null && (
                <>
                  <line
                    x1={boundaryX}
                    x2={boundaryX}
                    y1={PAD.top}
                    y2={PAD.top + innerH}
                    stroke="var(--line)"
                    strokeWidth="1"
                  />
                  <text
                    x={boundaryX + 5}
                    y={PAD.top + 8}
                    className="fill-[var(--ink-muted)] text-[9.5px]"
                  >
                    {series.currentLabel}
                  </text>
                </>
              )}

              {segments.map((seg) => (
                <g key={seg.id}>
                  <path d={areaFor(seg.from, seg.to)} fill="url(#trend-fill)" />
                  <path
                    d={pathFor(seg.from, seg.to)}
                    fill="none"
                    stroke="var(--series-1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}

              {/* Dense series: the line carries the shape, dots would speckle it */}
              {points.map((p, i) =>
                shown === i || points.length <= 14 ? (
                  <circle
                    key={p.weekStart}
                    cx={x(i)}
                    cy={y(p.dropoutRate)}
                    r={shown === i ? 4.5 : 2.5}
                    fill="var(--series-1)"
                    stroke="var(--surface)"
                    strokeWidth="2"
                  />
                ) : null,
              )}

              {/* X labels, thinned so they never collide */}
              {points.map((p, i) =>
                i % labelEvery === 0 || i === points.length - 1 ? (
                  <text
                    key={`l-${p.weekStart}`}
                    x={x(i)}
                    y={HEIGHT - 6}
                    textAnchor="middle"
                    className="fill-[var(--ink-muted)] text-[9.5px]"
                  >
                    {formatWeek(p.weekStart)}
                  </text>
                ) : null,
              )}

              {/* Hit targets are wider than the marks */}
              {points.map((p, i) => (
                <rect
                  key={`h-${p.weekStart}`}
                  x={x(i) - innerW / points.length / 2}
                  y={PAD.top}
                  width={innerW / points.length}
                  height={innerH}
                  fill="transparent"
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={() => setActive(i)}
                />
              ))}

              {shown !== null && (
                <line
                  x1={x(shown)}
                  x2={x(shown)}
                  y1={PAD.top}
                  y2={PAD.top + innerH}
                  stroke="var(--series-1)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
            </svg>
          )}

          {shown !== null && width > 0 && (
            <div
              className="pointer-events-none absolute z-10 w-44 rounded-control border border-line bg-surface p-2.5 shadow-e3"
              style={{
                left: Math.min(Math.max(x(shown) - 88, 0), Math.max(width - 176, 0)),
                top: Math.max(y(points[shown].dropoutRate) - 104, 0),
              }}
              role="status"
            >
              <div className="eyebrow">
                Week of {formatWeek(points[shown].weekStart)}
              </div>
              <div className="mt-1 text-[16px] font-semibold tabnum">
                {pct(points[shown].dropoutRate)}
              </div>
              <div className="mt-0.5 text-[11.5px] text-ink-muted tabnum">
                {n(points[shown].dropped)} of {n(points[shown].respondents)} left
              </div>
              <div className="mt-1 text-[11px] text-ink-faint">
                {points[shown].period === 'current'
                  ? series.currentLabel
                  : series.previousLabel}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11.5px] text-ink-muted">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full bg-series-1" aria-hidden="true" />
              Weekly dropout rate
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-0 w-4 border-t border-dashed border-ink-faint"
                aria-hidden="true"
              />
              {series.previousLabel} average ({pct(series.previousRate)})
            </span>
          </span>
          <span>
            Worst week so far:{' '}
            <span className="font-semibold text-ink-soft tabnum">
              {formatWeek(series.peak.weekStart)} at {pct(series.peak.dropoutRate)}
            </span>{' '}
            · typical completion {formatDuration(campaign.metrics.current.medianCompletionSeconds)}
          </span>
        </div>

        {/* The same numbers, for anyone not reading the chart */}
        <div className="sr-only">
          <table>
            <caption>Weekly dropout rate for {campaign.name}</caption>
            <thead>
              <tr>
                <th scope="col">Week starting</th>
                <th scope="col">Period</th>
                <th scope="col">Respondents</th>
                <th scope="col">Dropped</th>
                <th scope="col">Dropout rate</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.weekStart}>
                  <th scope="row">{p.weekStart}</th>
                  <td>
                    {p.period === 'current' ? series.currentLabel : series.previousLabel}
                  </td>
                  <td>{n(p.respondents)}</td>
                  <td>{n(p.dropped)}</td>
                  <td>{pct(p.dropoutRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
