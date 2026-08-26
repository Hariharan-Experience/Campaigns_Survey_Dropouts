import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { ChevronRight, FunnelIcon } from '../components/Icons'
import {
  getCampaign,
  headlineDeltas,
  DEFAULT_CAMPAIGN_ID,
} from '../data/mockData'
import './CampaignAnalytics.css'

const n = (v) => v.toLocaleString('en-US')
const pct = (part, whole) => Math.round((part / whole) * 100)
const round1 = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, Math.round(v * 10) / 10]),
  )

const ORDINAL = [
  'var(--ordinal-1)',
  'var(--ordinal-2)',
  'var(--ordinal-3)',
  'var(--ordinal-4)',
  'var(--ordinal-5)',
]

const splitOf = (dist) => {
  const countFor = (scores) =>
    dist.filter((d) => scores.includes(d.score)).reduce((s, d) => s + d.count, 0)
  return [
    { label: 'Positive (4–5)', count: countFor([4, 5]) },
    { label: 'Neutral (3)', count: countFor([3]) },
    { label: 'Negative (1–2)', count: countFor([1, 2]) },
  ]
}

export default function CampaignAnalytics() {
  const campaign = getCampaign(DEFAULT_CAMPAIGN_ID)
  const { scoreDistribution, channels: channelBreakdown } = campaign
  const ov = {
    ...campaign.metrics.current,
    campaignName: campaign.name,
    status: campaign.status,
    period: campaign.period.current.label,
    previousPeriod: campaign.period.previous.label,
    deltas: round1(headlineDeltas(campaign)),
  }

  const completedPct = pct(ov.completed, ov.respondents)
  const incompletePct = 100 - completedPct
  const maxScoreCount = Math.max(...scoreDistribution.map((d) => d.count))
  const sentimentSplit = splitOf(scoreDistribution)

  return (
    <div className="analytics-page">
      <div className="page-title">
        <div>
          <div className="title-row">
            <h1>Campaign Analytics</h1>
            <span className="status-pill">{ov.status}</span>
          </div>
          <p className="page-sub">
            {ov.campaignName} · {ov.period} · compared with {ov.previousPeriod}
          </p>
        </div>
      </div>

      <section className="stat-row" aria-label="Headline metrics">
        <StatCard
          label="Respondents"
          value={n(ov.respondents)}
          delta={ov.deltas.respondents}
          goodDirection="up"
          note="invited"
        />
        <StatCard
          label="Completed"
          value={n(ov.completed)}
          delta={ov.deltas.completed}
          goodDirection="up"
          note="finished all questions"
        />
        <StatCard
          label="Incomplete"
          value={n(ov.incomplete)}
          delta={ov.deltas.incomplete}
          goodDirection="down"
          note="dropped out"
        />
        <StatCard
          label="Completion rate"
          value={`${ov.completionRate}%`}
          delta={ov.deltas.completionRate}
          deltaSuffix=" pts"
          goodDirection="up"
          note={`vs ${ov.previousPeriod}`}
          emphasis
        />
        <StatCard
          label="Average score"
          value={ov.averageScore.toFixed(1)}
          suffix="/ 5"
          delta={ov.deltas.averageScore}
          deltaSuffix=" pts"
          goodDirection="up"
          note="all rated questions"
        />
      </section>

      <div className="chart-grid">
        {/* Completion breakdown — 2 categorical series, validated pair */}
        <section className="card viz-card">
          <div className="viz-head">
            <h2>Completion breakdown</h2>
            <p className="viz-sub">
              {n(ov.respondents)} respondents invited this period
            </p>
          </div>

          <div className="stacked-bar" role="img"
            aria-label={`Completed ${n(ov.completed)}, ${completedPct} percent. Incomplete ${n(ov.incomplete)}, ${incompletePct} percent.`}>
            <div
              className="seg seg-start"
              style={{ flex: completedPct, background: 'var(--series-1)' }}
            >
              <span className="viz-tip">
                Completed · {n(ov.completed)} ({completedPct}%)
              </span>
            </div>
            <div
              className="seg seg-end"
              style={{ flex: incompletePct, background: 'var(--series-2)' }}
            >
              <span className="viz-tip">
                Incomplete · {n(ov.incomplete)} ({incompletePct}%)
              </span>
            </div>
          </div>

          <ul className="legend">
            <li>
              <span className="swatch" style={{ background: 'var(--series-1)' }} />
              <span className="legend-label">Completed</span>
              <span className="legend-value">{n(ov.completed)}</span>
              <span className="legend-pct">{completedPct}%</span>
            </li>
            <li>
              <span className="swatch" style={{ background: 'var(--series-2)' }} />
              <span className="legend-label">Incomplete</span>
              <span className="legend-value">{n(ov.incomplete)}</span>
              <span className="legend-pct">{incompletePct}%</span>
            </li>
          </ul>

          <table className="viz-table">
            <caption className="sr-only">Completion by channel</caption>
            <thead>
              <tr>
                <th scope="col">Channel</th>
                <th scope="col">Sent</th>
                <th scope="col">Completed</th>
                <th scope="col">Rate</th>
              </tr>
            </thead>
            <tbody>
              {channelBreakdown.map((c) => (
                <tr key={c.channel}>
                  <th scope="row">{c.channel}</th>
                  <td>{n(c.sent)}</td>
                  <td>{n(c.completed)}</td>
                  <td>{pct(c.completed, c.sent)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Score distribution — single ordinal ramp, validated */}
        <section className="card viz-card">
          <div className="viz-head">
            <h2>Score distribution</h2>
            <p className="viz-sub">
              Mean {ov.averageScore.toFixed(1)} of 5 across {n(ov.completed)}{' '}
              completed responses
            </p>
          </div>

          <ul className="dist-list">
            {scoreDistribution.map((d, i) => (
              <li className="dist-row" key={d.score}>
                <span className="dist-label">{d.label}</span>
                <div className="dist-track">
                  <div
                    className="dist-bar"
                    style={{
                      width: `${(d.count / maxScoreCount) * 100}%`,
                      background: ORDINAL[i],
                    }}
                  >
                    <span className="viz-tip">
                      {d.label} · {n(d.count)} ({pct(d.count, ov.completed)}%)
                    </span>
                  </div>
                </div>
                <span className="dist-value">{n(d.count)}</span>
              </li>
            ))}
          </ul>

          <dl className="sentiment-strip">
            {sentimentSplit.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  {n(s.count)}
                  <span>{pct(s.count, ov.completed)}%</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

      </div>

      <Link to="/campaign/analytics/intelligence" className="feature-card">
        <span className="feature-icon">
          <FunnelIcon width={22} height={22} />
        </span>
        <span className="feature-body">
          <span className="feature-title">
            Survey Dropout &amp; Response Intelligence
          </span>
          <span className="feature-desc">
            See where the {n(ov.incomplete)} incomplete respondents dropped out,
            which questions carry the most friction, and what the open-text
            answers are actually saying.
          </span>
        </span>
        <span className="feature-cta">
          Open
          <ChevronRight width={16} height={16} />
        </span>
      </Link>
    </div>
  )
}
