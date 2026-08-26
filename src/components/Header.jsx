import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from './Icons'
import { CampaignSelector, DateFilter, ExportMenu } from './HeaderControls'
import './Header.css'

const CRUMBS = {
  '/campaign/analytics': [{ label: 'Campaign Analytics' }],
  '/campaign/analytics/intelligence': [
    { label: 'Campaign Analytics', to: '/campaign/analytics' },
    { label: 'Dropout & Response Intelligence' },
  ],
  '/campaign/survey': [
    { label: 'Campaign Analytics', to: '/campaign/analytics' },
    { label: 'Survey' },
  ],
}

export default function Header() {
  const { pathname } = useLocation()
  const crumbs = CRUMBS[pathname] ?? [{ label: 'Workspace' }]

  return (
    <header className="header">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/campaign/analytics" className="crumb-root">
          Experience
        </Link>
        {crumbs.map((c, i) => (
          <span className="crumb-group" key={c.label}>
            <ChevronRight width={14} height={14} className="crumb-sep" />
            {c.to && i < crumbs.length - 1 ? (
              <Link to={c.to} className="crumb-link">
                {c.label}
              </Link>
            ) : (
              <span className="crumb-current" aria-current="page">
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="header-actions">
        <CampaignSelector />
        <DateFilter />
        <ExportMenu />
        <button type="button" className="btn-primary">
          New campaign
        </button>
        <span className="avatar" title="Hariharan Jothi">
          HJ
        </span>
      </div>
    </header>
  )
}
