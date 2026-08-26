import { useMemo } from 'react'
import { improveQuestion } from '../utils/api'
import { useAsyncAction } from '../utils/useAsyncAction'
import { possibleContributors } from '../utils/contributors'
import { formatDuration } from '../utils/dropout'
import { responsesForQuestion } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { StatusPill } from './DropoutInsights'

const n = (v) => v.toLocaleString('en-US')
const signed = (v) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toFixed(1)}`

function Metric({ label, children }) {
  return (
    <div className="col">
      <div className="border rounded bg-white h-100 px-3 py-2">
        <div
          className="text-muted text-uppercase fw-semibold"
          style={{ fontSize: '10.5px', letterSpacing: '.05em' }}
        >
          {label}
        </div>
        <div className="fw-semibold tabnum" style={{ fontSize: '17px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function QuestionAnalysis({ campaign, row, allRows }) {
  const { data, error, isLoading, run } = useAsyncAction(improveQuestion)
  const { drafts, setDraft, clearDraft } = useApp()
  const draft = drafts[row.id]

  const contributors = useMemo(
    () => possibleContributors(row, allRows),
    [row, allRows],
  )

  const samples = responsesForQuestion(campaign, row.id, 'current')
    .slice(0, 8)
    .map((r) => r.text)

  const onImprove = () =>
    run({
      campaign: {
        name: campaign.name,
        purpose: campaign.purpose,
        audience: campaign.audience,
      },
      question: {
        text: draft ?? row.text,
        type: row.typeLabel,
        order: row.order,
        required: row.required,
      },
      metrics: {
        reached: row.reached,
        dropped: row.dropped,
        dropoutRate: row.dropoutRate.toFixed(1),
        completionRate: row.completionRate.toFixed(1),
        previousDropoutRate: row.previousDropoutRate.toFixed(1),
        change: row.change.toFixed(1),
        avgSeconds: row.avgSeconds,
        status: row.status.label,
      },
      contributors: contributors.map((c) => `${c.label}: ${c.detail}`),
      sampleResponses: samples,
    })

  const recommendedIndex = data?.options?.findIndex(
    (o) => o.wording.trim() === data.recommended.wording.trim(),
  )

  const label = (t) => (
    <div
      className="text-muted text-uppercase fw-semibold mb-2"
      style={{ fontSize: '10.5px', letterSpacing: '.06em' }}
    >
      {t}
    </div>
  )

  return (
    <div className="bg-body-tertiary border-start border-primary border-3 p-3 p-lg-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div>
          {label('Question Analysis')}
          <div className="fw-semibold">
            Q{row.order} · {row.typeLabel} ·{' '}
            {row.required ? 'Required' : 'Optional'}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
          onClick={onImprove}
          disabled={isLoading}
        >
          {isLoading && (
            <span className="spinner-border spinner-border-sm" role="status" />
          )}
          {isLoading
            ? 'Improving…'
            : data
              ? 'Improve again'
              : 'Improve Question with AI'}
        </button>
      </div>

      <div className="bg-white border-start border-primary border-3 rounded-end p-3 mb-3">
        {label(draft ? 'Local draft wording' : 'Current wording')}
        {draft && <p className="mb-1 small superseded">{row.text}</p>}
        <p className="mb-0">{draft ?? row.text}</p>
        {draft && (
          <button
            type="button"
            className="btn btn-link btn-sm p-0 mt-2"
            onClick={() => clearDraft(row.id)}
          >
            Revert to original
          </button>
        )}
      </div>

      <div className="row row-cols-2 row-cols-md-4 row-cols-xl-7 g-2 mb-3">
        <Metric label="Reached">{n(row.reached)}</Metric>
        <Metric label="Dropped">{n(row.dropped)}</Metric>
        <Metric label="Current dropout">{row.dropoutRate.toFixed(1)}%</Metric>
        <Metric label="Previous period">
          {row.previousDropoutRate.toFixed(1)}%
        </Metric>
        <Metric label="Change vs previous">{signed(row.change)}</Metric>
        <Metric label="Avg. answer time">
          {formatDuration(row.avgSeconds)}
        </Metric>
        <Metric label="Status">
          <StatusPill status={row.status} />
        </Metric>
      </div>

      {label('Possible contributors')}
      <ul className="list-unstyled mb-3">
        {contributors.length === 0 && (
          <li className="bg-white border rounded px-3 py-2 small text-muted">
            Nothing structural stands out for this question.
          </li>
        )}
        {contributors.map((c) => (
          <li
            key={c.label}
            className="bg-white border rounded px-3 py-2 small mb-2 d-flex gap-2"
          >
            <span
              className={`status-dot sev-${c.severity} mt-2 flex-shrink-0`}
              aria-hidden="true"
            />
            <span>
              <strong>{c.label}</strong>
              <span className="text-muted"> — {c.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      {error && (
        <div className="alert alert-danger py-2 small mb-0" role="alert">
          {error}
        </div>
      )}

      {isLoading && !data && (
        <div className="bg-white border rounded p-4 text-center text-muted small">
          <span
            className="spinner-border spinner-border-sm text-primary me-2"
            role="status"
          />
          Claude is reading the metrics and {samples.length} response
          {samples.length === 1 ? '' : 's'} for this question…
        </div>
      )}

      {!data && !error && !isLoading && (
        <div className="bg-white border rounded p-4 text-center text-muted small">
          <strong>Improve Question with AI</strong> returns three alternative
          wordings. Only the question text is suggested — the campaign may
          already be live, so nothing structural is proposed.
        </div>
      )}

      {data && (
        <>
          <div className="mb-3">
            {label('AI analysis')}
            <p className="mb-0 text-body-secondary">{data.diagnosis}</p>
          </div>

          {label('3 improved versions')}
          <ul className="list-unstyled mb-3">
            {data.options.map((o, i) => (
              <li
                key={o.wording}
                className={
                  i === recommendedIndex
                    ? 'card border-primary bg-primary-subtle mb-2'
                    : 'card mb-2'
                }
              >
                <div className="card-body py-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="text-muted text-uppercase fw-semibold"
                      style={{ fontSize: '10.5px', letterSpacing: '.05em' }}
                    >
                      Version {i + 1}
                    </span>
                    {i === recommendedIndex && (
                      <span className="badge text-bg-primary">Recommended</span>
                    )}
                  </div>
                  <p className="mb-1">{o.wording}</p>
                  <p className="text-muted small mb-3">{o.rationale}</p>
                  <button
                    type="button"
                    className={
                      draft === o.wording
                        ? 'btn btn-secondary btn-sm'
                        : 'btn btn-outline-primary btn-sm'
                    }
                    onClick={() => setDraft(row.id, o.wording)}
                    disabled={draft === o.wording}
                  >
                    {draft === o.wording
                      ? 'Applied to local draft'
                      : 'Use Suggested Text'}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="card border-primary bg-primary-subtle mb-3">
            <div className="card-body py-3">
              {label('Recommended version')}
              <p className="mb-2">{data.recommended.wording}</p>
              <p className="text-body-secondary small mb-0">
                {data.recommended.why}
              </p>
            </div>
          </div>

          <div className="mb-3">
            {label('Recommended next step')}
            <p className="mb-0 text-body-secondary">{data.nextStep}</p>
          </div>

          <p
            className="text-muted border-top pt-2 mb-0"
            style={{ fontSize: '11px' }}
          >
            Generated by Claude from the calculated metrics above. Only question
            wording is suggested. “Use Suggested Text” updates local draft state
            only — nothing is published to the live campaign.
          </p>
        </>
      )}
    </div>
  )
}
