import { Link, useLocation } from 'react-router-dom'

const TITLES = {
  '/overview': 'Overview',
  '/campaigns': 'Campaigns',
  '/respondents': 'Respondents',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function Placeholder() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Not found'

  return (
    <div className="intel-page">
      <div className="page-title">
        <div>
          <h1>{title}</h1>
          <p className="page-sub">
            Outside the scope of this prototype — only Campaign Analytics is
            built out.
          </p>
        </div>
      </div>
      <div className="card intel-card">
        <div className="intel-placeholder">
          <p>
            Nothing here yet.{' '}
            <Link to="/campaign/analytics" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              Go to Campaign Analytics
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
