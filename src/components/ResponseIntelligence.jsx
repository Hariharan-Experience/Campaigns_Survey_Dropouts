import { analyzeResponses } from '../utils/api'
import { useAsyncAction } from '../utils/useAsyncAction'
import { useApp } from '../context/AppContext'

const SENTIMENT_COLORS = {
  positive: 'var(--series-1)',
  neutral: 'var(--ink-muted)',
  negative: 'var(--series-2)',
}

const THEME_COLORS = {
  positive: 'var(--series-1)',
  negative: 'var(--series-2)',
  neutral: 'var(--ordinal-2)',
  mixed: 'var(--ordinal-2)',
}

const SENTIMENT_BADGE = {
  positive: 'text-success-emphasis bg-success-subtle',
  negative: 'text-danger-emphasis bg-danger-subtle',
  neutral: 'text-secondary-emphasis bg-body-secondary',
  mixed: 'text-secondary-emphasis bg-body-secondary',
}

const label = (t) => (
  <div
    className="text-muted text-uppercase fw-semibold mb-2"
    style={{ fontSize: '10.5px', letterSpacing: '.06em' }}
  >
    {t}
  </div>
)

function TopTheme({ kind, theme }) {
  const positive = kind === 'positive'
  return (
    <div className="col-md-6">
      <div
        className="border rounded bg-white h-100 p-3 border-start border-3"
        style={{
          borderLeftColor: positive ? 'var(--series-1)' : 'var(--series-2)',
        }}
      >
        {label(`Top ${kind} theme`)}
        {theme ? (
          <>
            <div className="fw-semibold">{theme.name}</div>
            <div className="text-muted small tabnum">
              {theme.responseCount} response
              {theme.responseCount === 1 ? '' : 's'} · {theme.percentage}%
            </div>
            <p className="text-body-secondary small mb-0 mt-2">
              {theme.summary}
            </p>
          </>
        ) : (
          <div className="text-muted small">
            No clearly {kind} theme in this set.
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResponseIntelligence({ campaign, responses, range }) {
  const { data, error, isLoading, run } = useAsyncAction(analyzeResponses)
  const { setResult } = useApp()

  const onAnalyze = async () => {
    const result = await run({
      campaign: { name: campaign.name, purpose: campaign.purpose },
      period: range?.label ?? campaign.period.current.label,
      responses: responses.map((r) => ({
        text: r.text,
        score: r.score,
        segment: r.segment,
        channel: r.channel,
      })),
    })
    if (result) setResult('themes', result)
  }

  const findTheme = (name) => data?.themes.find((t) => t.name === name) ?? null

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h2 className="h5 mb-1">Survey Intelligence</h2>
            <p className="text-primary fw-semibold small mb-1">
              What are respondents saying?
            </p>
            <p className="text-muted small mb-0" style={{ maxWidth: '70ch' }}>
              {responses.length} open-text answer
              {responses.length === 1 ? '' : 's'} from {campaign.name} in{' '}
              {range?.label ?? 'the selected range'} · themes are discovered
              from the text itself, never from a predefined list
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            onClick={onAnalyze}
            disabled={isLoading || responses.length === 0}
          >
            {isLoading && (
              <span className="spinner-border spinner-border-sm" role="status" />
            )}
            {isLoading
              ? 'Analyzing…'
              : data
                ? 'Analyze again'
                : 'Analyze Responses'}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-0" role="alert">
            {error}
          </div>
        )}

        {isLoading && !data && (
          <div className="bg-body-tertiary border rounded p-4 text-center text-muted small">
            <span
              className="spinner-border spinner-border-sm text-primary me-2"
              role="status"
            />
            Claude is reading {responses.length} responses and discovering
            themes…
          </div>
        )}

        {!data && !error && !isLoading && (
          <div className="bg-body-tertiary border rounded p-4 text-center text-muted small">
            {responses.length === 0
              ? 'No open-text answers fall in the selected date range. Widen the date filter to analyze.'
              : 'Run the analysis to discover what respondents are saying.'}
          </div>
        )}

        {data && (
          <>
            <div className="mb-4">
              {label('Overall summary')}
              <p className="mb-0 text-body-secondary" style={{ maxWidth: '78ch' }}>
                {data.overallSummary}
              </p>
            </div>

            <div className="row g-3 mb-4">
              <TopTheme kind="positive" theme={findTheme(data.topPositiveTheme)} />
              <TopTheme kind="negative" theme={findTheme(data.topNegativeTheme)} />
            </div>

            <div className="mb-4">
              {label('Sentiment')}
              <div className="sentiment-bar mb-2">
                {['positive', 'neutral', 'negative'].map((k) => (
                  <div
                    key={k}
                    className="sentiment-seg"
                    style={{
                      flex: Math.max(data.sentiment[k], 0.5),
                      background: SENTIMENT_COLORS[k],
                    }}
                  />
                ))}
              </div>
              <ul className="list-unstyled d-flex flex-wrap gap-4 small mb-0">
                {['positive', 'neutral', 'negative'].map((k) => (
                  <li key={k} className="d-flex align-items-center gap-2">
                    <span
                      className="swatch"
                      style={{ background: SENTIMENT_COLORS[k] }}
                    />
                    <span className="text-body-secondary">
                      {k[0].toUpperCase() + k.slice(1)}
                    </span>
                    <span className="fw-semibold tabnum">
                      {data.sentiment[k]}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {label('Top themes')}
              <ul className="list-unstyled mb-0">
                {data.themes.map((t) => (
                  <li key={t.name} className="mb-3">
                    <div className="d-flex justify-content-between align-items-baseline gap-3">
                      <span className="fw-semibold">
                        {t.name}{' '}
                        <span
                          className={`badge fw-semibold ${SENTIMENT_BADGE[t.sentiment]}`}
                          style={{ fontSize: '10px' }}
                        >
                          {t.sentiment}
                        </span>
                      </span>
                      <span className="fw-semibold tabnum text-nowrap small">
                        {t.responseCount} · {t.percentage}%
                      </span>
                    </div>
                    <div className="theme-track my-2">
                      <div
                        className="theme-fill"
                        style={{
                          width: `${Math.min(t.percentage, 100)}%`,
                          background: THEME_COLORS[t.sentiment],
                        }}
                      />
                    </div>
                    <p className="small text-body-secondary mb-1">{t.summary}</p>
                    <p className="small quote mb-0">“{t.quote}”</p>
                  </li>
                ))}
              </ul>
            </div>

            <p
              className="text-muted border-top pt-2 mt-3 mb-0"
              style={{ fontSize: '11px' }}
            >
              Themes, counts and sentiment generated by Claude from{' '}
              {responses.length} response texts in this campaign and date range.
              Percentages are share of responses raising each theme, so they
              overlap and need not total 100.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
