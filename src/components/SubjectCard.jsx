export default function SubjectCard({ subject, tasks, onEdit, onDelete }) {
  const related = tasks.filter((task) => task.subjectId === subject.id);
  const completed = related.filter((task) => task.completed).length;
  const progress = related.length ? Math.round((completed / related.length) * 100) : 0;
  return (
    <article className="subject-card">
      <div className="subject-card-top"><div className="subject-icon" style={{ color: subject.color, background: `${subject.color}15` }}><i className={`bi ${subject.icon || 'bi-journal-bookmark'}`} /></div><div className="subject-actions"><button className="icon-button small" onClick={() => onEdit(subject)} aria-label="Edit subject"><i className="bi bi-pencil" /></button><button className="icon-button small danger-hover" onClick={() => onDelete(subject)} aria-label="Delete subject"><i className="bi bi-trash3" /></button></div></div>
      <h3>{subject.name}</h3><div className="subject-target">{subject.target || 0} hr target <span>·</span> {related.length} {related.length === 1 ? 'task' : 'tasks'}</div>
      <div className="progress-label"><span>Task completion</span><b>{progress}%</b></div><div className="progress subject-progress"><div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: subject.color }} /></div>
      <div className="topic-pills">{(subject.topics || []).slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>
    </article>
  );
}
