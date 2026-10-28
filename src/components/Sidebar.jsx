import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Overview', icon: 'bi-grid-1x2' },
  { to: '/subjects', label: 'My subjects', icon: 'bi-journals' },
  { to: '/planner', label: 'Daily planner', icon: 'bi-calendar3' },
  { to: '/tasks', label: 'Study tasks', icon: 'bi-check2-square' },
  { to: '/progress', label: 'Progress', icon: 'bi-bar-chart-line' },
  { to: '/assistant', label: 'Study assistant', icon: 'bi-stars' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="/">
        <span className="brand-mark"><i className="bi bi-compass-fill" /></span>
        <span>upsc<span className="brand-light">track</span><small>YOUR STUDY COMPANION</small></span>
      </a>
      <div className="side-label">WORKSPACE</div>
      <nav className="nav flex-column gap-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            <i className={`bi ${link.icon}`} /><span>{link.label}</span>
            {link.to === '/assistant' && <span className="new-pill">AI</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="focus-card">
          <span className="focus-icon"><i className="bi bi-lightbulb" /></span>
          <p>Small steps, every day.</p>
          <span>Consistency is your superpower.</span>
        </div>
        <div className="profile-row">
          <div className="avatar">A</div><div><b>Aspirant</b><small>UPSC 2026</small></div>
          <i className="bi bi-three-dots ms-auto" />
        </div>
      </div>
    </aside>
  );
}
