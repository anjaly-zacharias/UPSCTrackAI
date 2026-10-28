import { useEffect, useState } from 'react';

const blank = { title: '', subjectId: '', topic: '', date: new Date().toISOString().slice(0, 10), duration: 60, priority: 'Medium', notes: '' };

export default function TaskForm({ open, onClose, onSave, subjects, task }) {
  const [form, setForm] = useState(blank);
  useEffect(() => {
    if (open) setForm(task ? { ...task } : { ...blank, subjectId: subjects[0]?.id || '' });
  }, [open, task, subjects]);
  if (!open) return null;
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.subjectId) return;
    onSave({ ...form, title: form.title.trim(), duration: Number(form.duration), completed: task?.completed || false });
  };
  return (
    <div className="modal-backdrop-custom" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="app-modal">
        <div className="modal-heading"><div><span className="eyebrow">STAY ON TRACK</span><h2>{task ? 'Edit task' : 'Create a task'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button></div>
        <form onSubmit={submit}>
          <label className="form-label">Task name</label><input className="form-control" name="title" value={form.title} onChange={change} placeholder="e.g. Revise Fundamental Rights" required autoFocus />
          <div className="row g-3 mt-1"><div className="col-6"><label className="form-label">Subject</label><select className="form-select" name="subjectId" value={form.subjectId} onChange={change} required>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div className="col-6"><label className="form-label">Topic</label><input className="form-control" name="topic" value={form.topic} onChange={change} placeholder="Topic or chapter" /></div></div>
          <div className="row g-3 mt-1"><div className="col-4"><label className="form-label">Study date</label><input type="date" className="form-control" name="date" value={form.date} onChange={change} /></div><div className="col-4"><label className="form-label">Minutes</label><input type="number" min="5" max="720" className="form-control" name="duration" value={form.duration} onChange={change} /></div><div className="col-4"><label className="form-label">Priority</label><select className="form-select" name="priority" value={form.priority} onChange={change}><option>High</option><option>Medium</option><option>Low</option></select></div></div>
          <label className="form-label mt-3">Notes <span className="optional">(optional)</span></label><textarea className="form-control" name="notes" rows="2" value={form.notes || ''} onChange={change} placeholder="Add a reminder or revision note" />
          <div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-primary" type="submit">{task ? 'Save changes' : 'Add task'}</button></div>
        </form>
      </div>
    </div>
  );
}
