import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { campaigns } from '../data/mockData'
import { DATE_FILTERS, formatRange } from '../utils/dateFilter'
import {
  exportDropoutData,
  exportResponseThemes,
  exportFullAnalysis,
} from '../utils/csv'

/**
 * Bootstrap dropdown markup, driven by React state instead of Bootstrap's
 * JS bundle — no Popper dependency, and Escape / outside-click still work.
 */
function useDismissable(onClose) {
  const ref = useRef(null)
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return ref
}

export function CampaignSelector() {
  const { campaignId, selectCampaign, campaign } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useDismissable(() => setOpen(false))

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm dropdown-toggle text-truncate"
        style={{ maxWidth: 260 }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {campaign.name}
      </button>
      <ul className={open ? 'dropdown-menu show' : 'dropdown-menu'}>
        <li>
          <h6 className="dropdown-header">Campaign</h6>
        </li>
        {campaigns.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={
                c.id === campaignId ? 'dropdown-item active' : 'dropdown-item'
              }
              onClick={() => {
                selectCampaign(c.id)
                setOpen(false)
              }}
            >
              <div>{c.name}</div>
              <small
                className={c.id === campaignId ? 'text-white-50' : 'text-muted'}
              >
                {c.metrics.current.respondents.toLocaleString('en-US')}{' '}
                respondents · {c.period.current.label}
              </small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DateFilter() {
  const { filterId, setFilterId, range } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useDismissable(() => setOpen(false))

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm dropdown-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {DATE_FILTERS.find((f) => f.id === filterId)?.label}
        <span className="text-muted ms-2 d-none d-xl-inline">
          {formatRange(range)}
        </span>
      </button>
      <ul className={open ? 'dropdown-menu show' : 'dropdown-menu'}>
        {DATE_FILTERS.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              className={
                f.id === filterId ? 'dropdown-item active' : 'dropdown-item'
              }
              onClick={() => {
                setFilterId(f.id)
                setOpen(false)
              }}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ExportMenu() {
  const { campaign, rows, range, results } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useDismissable(() => setOpen(false))

  const items = [
    {
      id: 'dropout',
      label: 'Dropout Data',
      hint: `${rows.length} questions`,
      enabled: true,
      run: () => exportDropoutData(campaign, rows, range),
    },
    {
      id: 'themes',
      label: 'Response Themes',
      hint: results.themes
        ? `${results.themes.themes.length} themes`
        : 'Run Analyze Responses first',
      enabled: Boolean(results.themes),
      run: () => exportResponseThemes(campaign, results.themes, range),
    },
    {
      id: 'full',
      label: 'Full Analysis',
      hint: results.themes
        ? 'Dropout metrics + discovered themes'
        : 'Dropout metrics only until themes are run',
      enabled: true,
      run: () =>
        exportFullAnalysis(campaign, { rows, themes: results.themes, range }),
    },
  ]

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm dropdown-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Export
      </button>
      <ul
        className={
          open ? 'dropdown-menu dropdown-menu-end show' : 'dropdown-menu'
        }
      >
        <li>
          <h6 className="dropdown-header">Download CSV</h6>
        </li>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="dropdown-item"
              disabled={!item.enabled}
              onClick={() => {
                item.run()
                setOpen(false)
              }}
            >
              <div>{item.label}</div>
              <small className="text-muted">{item.hint}</small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
