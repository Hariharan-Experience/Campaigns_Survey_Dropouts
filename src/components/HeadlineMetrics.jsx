import { formatDuration } from '../utils/dropout'

const n = (v) => v.toLocaleString('en-US')
const pctChange = (cur, prev) => ((cur - prev) / prev) * 100
const signed = (v, digits = 1) =>
  `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toFixed(digits)}`

/**
 * Signed delta. Colour carries direction × whether up is good; the arrow
 * repeats it, so colour is never the only channel.
 */
function Delta({ value, text, goodWhen }) {
  const flat = Math.abs(value) < 0.05
  const good = flat ? null : goodWhen === 'up' ? value > 0 : value < 0
  const tone =
    good === null ? 'text-ink-muted' : good ? 'text-good-ink' : 'text-crit-ink'

  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold ${tone}`}>
      <span aria-hidden="true" className="text-[8px] leading-none">
        {flat ? '■' : value > 0 ? '▲' : '▼'}
      </span>
      <span className="tabnum">{text}</span>
    </span>
  )
}

function StatTile({ label, value, delta }) {
  return (
    <div className="flex flex-col justify-center gap-0.5 bg-surface px-4 py-3.5">
      <div className="eyebrow">{label}</div>
      <div className="text-[20px] leading-tight font-semibold">{value}</div>
      <div>{delta}</div>
    </div>
  )
}

export default function HeadlineMetrics({ campaign }) {
  const cur = campaign.metrics.current
  const prev = campaign.metrics.previous
  const period = campaign.period.previous.label

  const completionChange = cur.completionRate - prev.completionRate
  const timeChange = cur.medianCompletionSeconds - prev.medianCompletionSeconds

  return (
    <section aria-label="Headline metrics" className="card mb-4 overflow-hidden">
      <div className="card-head py-2.5">
        <div className="eyebrow">Performance · {campaign.period.current.label}</div>
        <p className="text-[11.5px] text-ink-muted">
          Change shown against {period}
        </p>
      </div>

      <div className="flex flex-col gap-px bg-line xl:flex-row">
        {/* Hero figure — the one number this view leads with */}
        <div className="bg-surface px-5 py-4 xl:w-[300px] xl:shrink-0">
          <div className="eyebrow">Completion rate</div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="text-[40px] leading-none font-semibold tracking-tight">
              {cur.completionRate.toFixed(1)}
              <span className="text-[22px] text-ink-muted">%</span>
            </span>
            <Delta
              value={completionChange}
              text={`${signed(completionChange)} pts`}
              goodWhen="up"
            />
          </div>

          {/* Meter: fill and track are steps of one ramp, so the bar reads whole */}
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-track"
            role="img"
            aria-label={`${cur.completionRate.toFixed(1)} percent of respondents finished the survey`}
          >
            <div
              className="h-1.5 rounded-full bg-series-1"
              style={{ width: `${Math.min(cur.completionRate, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11.5px] text-ink-muted">
            {n(cur.completed)} of {n(cur.respondents)} finished
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-px bg-line lg:grid-cols-4">
          <StatTile
            label="Respondents"
            value={n(cur.respondents)}
            delta={
              <Delta
                value={pctChange(cur.respondents, prev.respondents)}
                text={`${signed(pctChange(cur.respondents, prev.respondents))}%`}
                goodWhen="up"
              />
            }
          />
          <StatTile
            label="Completed"
            value={n(cur.completed)}
            delta={
              <Delta
                value={pctChange(cur.completed, prev.completed)}
                text={`${signed(pctChange(cur.completed, prev.completed))}%`}
                goodWhen="up"
              />
            }
          />
          <StatTile
            label="Dropped off"
            value={n(cur.incomplete)}
            delta={
              <Delta
                value={pctChange(cur.incomplete, prev.incomplete)}
                text={`${signed(pctChange(cur.incomplete, prev.incomplete))}%`}
                goodWhen="down"
              />
            }
          />
          <StatTile
            label="Median time"
            value={formatDuration(cur.medianCompletionSeconds)}
            delta={
              <Delta
                value={timeChange}
                text={`${signed(timeChange, 0)}s`}
                goodWhen="down"
              />
            }
          />
        </div>
      </div>
    </section>
  )
}
