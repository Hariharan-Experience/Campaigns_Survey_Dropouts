import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { typeLabel, buildDropoutRows } from '../utils/dropout'
import { ArrowLeft, ChartIcon } from '../components/Icons'
import './SurveyPage.css'

export default function SurveyPage() {
  const { campaign, drafts, clearDraft } = useApp()
  const [params] = useSearchParams()
  const focusId = params.get('q')
  const [flash, setFlash] = useState(null)
  const refs = useRef({})

  const rows = buildDropoutRows(campaign)
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]))
  const draftCount = Object.keys(drafts).length

  useEffect(() => {
    if (!focusId) return
    const el = refs.current[focusId]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setFlash(focusId)
    const t = setTimeout(() => setFlash(null), 2600)
    return () => clearTimeout(t)
  }, [focusId])

  return (
    <div className="survey-page">
      <div className="survey-topbar">
        <Link to="/campaign/analytics/intelligence" className="back-link">
          <ArrowLeft width={15} height={15} />
          Back to Intelligence
        </Link>
        {draftCount > 0 && (
          <span className="draft-count">
            {draftCount} unsaved draft{draftCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="page-title">
        <div>
          <h1>Survey</h1>
          <p className="page-sub">
            {campaign.name} · {campaign.questions.length} questions ·{' '}
            {campaign.audience}
          </p>
        </div>
      </div>

      <ol className="survey-list">
        {campaign.questions.map((q) => {
          const row = byId[q.id]
          const draft = drafts[q.id]
          const isFocused = flash === q.id

          return (
            <li
              key={q.id}
              id={`q-${q.id}`}
              ref={(el) => (refs.current[q.id] = el)}
              className={[
                'survey-item',
                'card',
                isFocused ? 'is-flash' : '',
                draft ? 'is-draft' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="survey-item-head">
                <span className="survey-order">Q{q.order}</span>
                <span className="type-chip">{typeLabel(q.type)}</span>
                {q.required && <span className="req-chip">Required</span>}
                {row && (
                  <span className={`status-badge status-${row.status.id}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {row.dropoutRate.toFixed(1)}% dropout
                  </span>
                )}
                {draft && <span className="draft-chip">Draft edit</span>}
              </div>

              {draft ? (
                <>
                  <p className="survey-text is-superseded">{q.text}</p>
                  <p className="survey-text is-draft-text">{draft}</p>
                  <div className="survey-item-actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => clearDraft(q.id)}
                    >
                      Revert to original
                    </button>
                  </div>
                </>
              ) : (
                <p className="survey-text">{q.text}</p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="survey-foot card">
        <div>
          <p className="survey-foot-title">Drafts are local to this session</p>
          <p className="survey-foot-text">
            This is a mock survey editor — nothing is persisted and no survey is
            published. Reloading the page clears every draft.
          </p>
        </div>
        <Link to="/campaign/analytics/intelligence" className="ai-btn is-secondary">
          <ChartIcon width={15} height={15} />
          Back to Intelligence
        </Link>
      </div>
    </div>
  )
}
