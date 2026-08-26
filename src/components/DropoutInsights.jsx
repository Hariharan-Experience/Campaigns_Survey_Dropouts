import { buildDropoutRows, worstRow, statusCounts, formatDuration, STATUS } from '../utils/dropout'
import QuestionAnalysis from './QuestionAnalysis'

const n = (v) => v.toLocaleString('en-US')
const pctText = (v) => `${v.toFixed(1)}%`

export function StatusPill({ status }) {
  return (
    <span className={`status-pill status-${status.id}`}>
      <span className="status-dot" aria-hidden="true" />
      {status.label}
    </span>
  )
}

export default function DropoutInsights({ campaign, selectedQuestionId, onAnalyze }) {
  const rows = buildDropoutRows(campaign)
  const worst = worstRow(rows)
  const counts = statusCounts(rows)
  const m = campaign.metrics.current

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h2 className="h5 mb-1">Survey Dropout</h2>
            <p className="text-primary fw-semibold small mb-1">
              Where are respondents dropping out?
            </p>
            <p className="text-muted small mb-0">
              {n(m.incomplete)} of {n(m.respondents)} respondents left before
              finishing · compared with {campaign.period.previous.label}
            </p>
          </div>
          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            {[STATUS.healthy, STATUS.watch, STATUS.high].map((s) => (
              <span key={s.id} className="d-flex align-items-center gap-2">
                <StatusPill status={s} />
                <span className="fw-semibold tabnum">{counts[s.id] ?? 0}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle dropout-table mb-0">
            <caption className="visually-hidden">
              Dropout by question for {campaign.name}
            </caption>
            <thead>
              <tr>
                <th scope="col" className="col-question">Survey Question</th>
                <th scope="col">Type</th>
                <th scope="col" className="text-end">Respondents Reached</th>
                <th scope="col" className="text-end">Respondents Dropped</th>
                <th scope="col" className="text-end">Dropout Rate</th>
                <th scope="col" className="text-end">
                  Completion Rate<span className="th-note">cumulative</span>
                </th>
                <th scope="col" className="text-end">
                  Potential Completion Gain
                  <span className="th-note">estimated upper bound</span>
                </th>
                <th scope="col" className="text-end">Avg. Answer Time</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="visually-hidden">Analyze</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isOpen = r.id === selectedQuestionId
                return [
                  <tr
                    key={r.id}
                    className={[
                      r.id === worst.id ? 'row-worst' : '',
                      isOpen ? 'table-primary' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <th scope="row" className="col-question fw-normal">
                      <span className="text-muted small me-2 tabnum">Q{r.order}</span>
                      <span className="q-text">{r.text}</span>
                    </th>
                    <td>
                      <span className="badge text-secondary-emphasis bg-body-secondary border fw-normal">
                        {r.typeLabel}
                      </span>
                    </td>
                    <td className="text-end tabnum">{n(r.reached)}</td>
                    <td className="text-end tabnum">{n(r.dropped)}</td>
                    <td className="text-end tabnum fw-semibold">{pctText(r.dropoutRate)}</td>
                    <td className="text-end tabnum">{pctText(r.completionRate)}</td>
                    <td className="text-end tabnum fw-semibold text-primary">
                      Up to +{r.dropoutRate.toFixed(1)} pts
                    </td>
                    <td className="text-end tabnum">{formatDuration(r.avgSeconds)}</td>
                    <td><StatusPill status={r.status} /></td>
                    <td className="text-end">
                      <button
                        type="button"
                        className={
                          isOpen
                            ? 'btn btn-primary btn-sm'
                            : 'btn btn-outline-primary btn-sm'
                        }
                        onClick={() => onAnalyze?.(r)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? 'Close' : 'Analyze'}
                      </button>
                    </td>
                  </tr>,

                  isOpen && (
                    <tr key={`${r.id}-drawer`}>
                      <td colSpan={10} className="p-0 border-bottom">
                        <QuestionAnalysis campaign={campaign} row={r} allRows={rows} />
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
