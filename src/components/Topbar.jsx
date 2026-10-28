import { useLocation } from 'react-router-dom';

const titles = {
  '/': ['Good morning, Aspirant', 'A little progress each day adds up to big results.'],
  '/subjects': ['Your subjects', 'Build a strong foundation, one topic at a time.'],
  '/planner': ['Daily planner', 'Make space for focused study and meaningful breaks.'],
  '/tasks': ['Study tasks', 'Keep your next best action clear and manageable.'],
  '/progress': ['Your progress', 'Every focused hour is a step closer to your goal.'],
  '/assistant': ['Study assistant', 'Thoughtful guidance for your UPSC preparation.'],
};

export default function Topbar({ onAddTask }) {
  const { pathname } = useLocation();
  const [title, subtitle] = titles[pathname] || titles['/'];
  return (
    <header className="topbar">
      <div className="topbar-copy"><div className="eyebrow">{new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</div><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><i className="bi bi-bell" /><span className="notification-dot" /></button><button className="btn btn-primary-soft" onClick={onAddTask}><i className="bi bi-plus-lg me-2" />New task</button></div>
    </header>
  );
}
