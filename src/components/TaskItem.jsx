export default function TaskItem({ task, subject, onToggle, onEdit, onDelete }) {
  return (
    <div className={`task-row${task.completed ? ' task-done' : ''}`}>
      <button className={`task-check${task.completed ? ' checked' : ''}`} onClick={() => onToggle(task)} aria-label={task.completed ? 'Mark pending' : 'Mark completed'}>{task.completed && <i className="bi bi-check-lg" />}</button>
      <div className="task-main"><div className="task-title">{task.title}</div><div className="task-meta"><span className="subject-dot" style={{ backgroundColor: subject?.color || '#8491a4' }} />{subject?.name || 'Subject'}<span className="meta-separator">·</span>{task.topic || 'General study'}<span className="meta-separator">·</span><i className="bi bi-clock" /> {task.duration} min</div></div>
      <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      <div className="task-controls"><button className="icon-button small" onClick={() => onEdit(task)} aria-label="Edit task"><i className="bi bi-pencil" /></button><button className="icon-button small danger-hover" onClick={() => onDelete(task)} aria-label="Delete task"><i className="bi bi-trash3" /></button></div>
    </div>
  );
}
