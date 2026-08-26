import { NavLink } from 'react-router-dom'
import {
  GridIcon,
  MegaphoneIcon,
  ChartIcon,
  UsersIcon,
  DocIcon,
  CogIcon,
} from './Icons'
import './Sidebar.css'

const NAV = [
  { to: '/overview', label: 'Overview', Icon: GridIcon },
  { to: '/campaigns', label: 'Campaigns', Icon: MegaphoneIcon },
  { to: '/campaign/analytics', label: 'Analytics', Icon: ChartIcon },
  { to: '/campaign/survey', label: 'Survey', Icon: DocIcon },
  { to: '/respondents', label: 'Respondents', Icon: UsersIcon },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">X</span>
        <span className="brand-text">
          <strong>Experience</strong>
          <small>Survey Cloud</small>
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        <p className="nav-heading">Workspace</p>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-item is-active' : 'nav-item'
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}

        <p className="nav-heading">Account</p>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'nav-item is-active' : 'nav-item'
          }
        >
          <CogIcon />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p className="footer-label">Mock workspace</p>
        <p className="footer-note">Sample data · no live sources connected</p>
      </div>
    </aside>
  )
}
