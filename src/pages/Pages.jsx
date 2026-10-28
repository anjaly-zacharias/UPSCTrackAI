import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import SubjectCard from '../components/SubjectCard';
import StudyTimer from '../components/StudyTimer';
import AITipCard from '../components/AITipCard';
import { CompletionChart, StudyHoursChart, SubjectProgressChart } from '../components/ProgressChart';
import { addSubject, deleteSubject, updateSubject } from '../store/subjectsSlice';
import { addTask, deleteTask, toggleTask, updateTask } from '../store/tasksSlice';
import { addSession, deleteSession, selectDate, updateSession } from '../store/plannerSlice';
import { getErrorMessage } from '../services/api';
import { persistItem, removeItem } from '../services/persistence';

const today = () => new Date().toISOString().slice(0, 10);
const welcomeTip = 'You’ve already shown up for your preparation today. Focus on the next small task—not the entire journey.';

function MetricCard({ icon, label, value, detail, tint }) {
  return <div className="metric-card"><div className={`metric-icon ${tint}`}><i className={`bi ${icon}`} /></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-detail">{detail}</div></div>;
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}

function EmptyState({ icon, title, children, action }) {
  return <div className="empty-state"><div><i className={`bi ${icon}`} /></div><h3>{title}</h3><p>{children}</p>{action}</div>;
}

function SessionEditor({ open, onClose, onSave, subjects, session, date }) {
  const [form, setForm] = useState({ date, start: '09:00', end: '10:00', subjectId: subjects[0]?.id || '', topic: '', priority: 'Medium', description: '' });
  if (!open) return null;
  const values = session ? { ...form, ...session } : form;
  const change = (event) => setForm({ ...values, [event.target.name]: event.target.value });
  const submit = (event) => { event.preventDefault(); if (!values.topic.trim() || values.end <= values.start) return; onSave(values); };
  return <div className="modal-backdrop-custom" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="app-modal"><div className="modal-heading"><div><span className="eyebrow">YOUR STUDY DAY</span><h2>{session ? 'Edit session' : 'Plan a session'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button></div><form onSubmit={submit}><div className="row g-3"><div className="col-6"><label className="form-label">Start</label><input className="form-control" type="time" name="start" value={values.start} onChange={change} required /></div><div className="col-6"><label className="form-label">End</label><input className="form-control" type="time" name="end" value={values.end} onChange={change} required /></div></div><div className="row g-3 mt-1"><div className="col-6"><label className="form-label">Subject</label><select className="form-select" name="subjectId" value={values.subjectId} onChange={change}>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div className="col-6"><label className="form-label">Priority</label><select className="form-select" name="priority" value={values.priority} onChange={change}><option>High</option><option>Medium</option><option>Low</option></select></div></div><label className="form-label mt-3">Topic or session name</label><input className="form-control" name="topic" value={values.topic} onChange={change} placeholder="e.g. Fundamental Rights" required /><label className="form-label mt-3">Notes</label><textarea className="form-control" name="description" rows="2" value={values.description || ''} onChange={change} placeholder="What would you like to cover?" /><div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-primary">{session ? 'Save changes' : 'Add to planner'}</button></div></form></div></div>;
}

export function Dashboard({ onEditTask, onCreateTask, notify }) {
  const subjects = useSelector((state) => state.subjects);
  const tasks = useSelector((state) => state.tasks);
  const sessions = useSelector((state) => state.planner.sessions);
  const { studyMinutes } = useSelector((state) => state.planner);
  const dispatch = useDispatch();
  const todayTasks = tasks.filter((task) => task.date === today());
  const done = todayTasks.filter((task) => task.completed).length;
  const progress = todayTasks.length ? Math.round(done / todayTasks.length * 100) : 0;
  const schedule = sessions.filter((session) => session.date === today()).sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = todayTasks.filter((task) => !task.completed).slice(0, 3);
  const toggleOne = async (item) => {
    const updated = { ...item, completed: !item.completed };
    try { await persistItem('tasks', updated, true); dispatch(updateTask(updated)); }
    catch (error) { notify(getErrorMessage(error), 'error'); }
  };
  const deleteOne = async (item) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    try { await removeItem('tasks', item.id); dispatch(deleteTask(item.id)); notify('Task deleted.'); }
    catch (error) { notify(getErrorMessage(error), 'error'); }
  };
  return <div className="page-stack">
    <div className="welcome-banner"><div className="welcome-copy"><span className="welcome-kicker"><i className="bi bi-sunrise me-2" />YOUR DAILY CHECK-IN</span><h2>One focused day at a time.</h2><p>Preparation is a marathon. Let’s make today count.</p></div><div className="welcome-art"><span className="sun-disc" /><span className="hill hill-back" /><span className="hill hill-front" /><span className="welcome-plant">✳</span></div></div>
    <div className="metric-grid"><MetricCard icon="bi-journals" label="Active subjects" value={subjects.length} detail="Your learning portfolio" tint="metric-violet" /><MetricCard icon="bi-list-check" label="Today's tasks" value={todayTasks.length} detail={`${todayTasks.length - done} left to complete`} tint="metric-blue" /><MetricCard icon="bi-check2-circle" label="Completion" value={`${progress}%`} detail={`${done} of ${todayTasks.length} tasks done`} tint="metric-green" /><MetricCard icon="bi-clock-history" label="Study time" value={`${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m`} detail="Focused time recorded" tint="metric-amber" /></div>
    <div className="dashboard-grid"><section className="panel schedule-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR DAY, AT A GLANCE</span><h3>Today's schedule</h3></div><a href="/planner" className="text-link">View planner <i className="bi bi-arrow-right ms-1" /></a></div>{schedule.length ? <div className="schedule-list">{schedule.slice(0, 4).map((session) => { const subject = subjects.find((item) => item.id === session.subjectId); return <div className="schedule-row" key={session.id}><div className="schedule-time">{session.start}<small>{session.end}</small></div><div className="schedule-rail"><span style={{ background: subject?.color || '#436b58' }} /></div><div className="schedule-details"><b>{session.topic}</b><span>{subject?.name || 'Study session'} · {session.description}</span></div><span className="schedule-duration">{Math.max(0, (Number(session.end.slice(0, 2)) * 60 + Number(session.end.slice(3))) - (Number(session.start.slice(0, 2)) * 60 + Number(session.start.slice(3))))}m</span></div>; })}</div> : <EmptyState icon="bi-calendar2-plus" title="No sessions planned">Add a study block to give your day a gentle structure.</EmptyState>}<a className="planner-cta" href="/planner"><i className="bi bi-plus-circle" /> Plan a study session <i className="bi bi-arrow-right ms-auto" /></a></section>
      <section className="panel tasks-panel"><div className="panel-heading"><div><span className="eyebrow">A GOOD PLACE TO START</span><h3>Up next</h3></div><a href="/tasks" className="text-link">All tasks <i className="bi bi-arrow-right ms-1" /></a></div>{upcoming.length ? <div className="compact-tasks">{upcoming.map((task) => <TaskItem key={task.id} task={task} subject={subjects.find((s) => s.id === task.subjectId)} onToggle={toggleOne} onEdit={onEditTask} onDelete={deleteOne} />)}</div> : <EmptyState icon="bi-check2-all" title="You're all caught up">A great moment to review, rest, or plan ahead.</EmptyState>}<button className="add-task-link" onClick={onCreateTask}><i className="bi bi-plus-lg" /> Add a task</button></section>
    </div>
    <div className="dashboard-grid lower-grid"><StudyTimer /><section className="panel tip-panel"><div className="panel-heading"><div><span className="eyebrow">A GENTLE REMINDER</span><h3>Keep your rhythm</h3></div><i className="bi bi-heart tip-heart" /></div><AITipCard compact>{welcomeTip}</AITipCard><div className="streak-note"><span className="streak-icon"><i className="bi bi-fire" /></span><span><b>Consistency over intensity</b><small>Your best study plan is the one you can return to tomorrow.</small></span></div></section></div>
  </div>;
}

export function SubjectsPage({ notify }) {
  const subjects = useSelector((state) => state.subjects);
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('60');
  const save = async (event) => { event.preventDefault(); if (!name.trim()) return; const subject = editor || {}; const next = { ...subject, id: subject.id || crypto.randomUUID(), name: name.trim(), target: Number(target), color: subject.color || '#5267d8', icon: subject.icon || 'bi-journal-bookmark', topics: subject.topics || [] }; try { const saved = await persistItem('subjects', next, Boolean(editor?.id)); dispatch(editor?.id ? updateSubject(saved) : addSubject(saved)); setEditor(null); setName(''); setTarget('60'); notify(editor?.id ? 'Subject updated.' : 'Subject added.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  const removeSubject = async (item) => { if (!window.confirm(`Delete “${item.name}”? Existing tasks will remain in your task list.`)) return; try { await removeItem('subjects', item.id); dispatch(deleteSubject(item.id)); notify('Subject deleted.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  return <div className="page-stack"><PageHeading eyebrow="YOUR LEARNING MAP" title="Every subject, in one place." description="Set a direction for each part of your preparation." action={<button className="btn btn-primary" onClick={() => { setEditor({}); setName(''); setTarget('60'); }}><i className="bi bi-plus-lg me-2" />Add subject</button>} /><div className="subject-summary"><div className="summary-mark"><i className="bi bi-book-half" /></div><div><b>A broad foundation, built steadily.</b><span>Track your progress across the subjects that shape your UPSC journey.</span></div><div className="summary-count"><b>{subjects.length}</b><span>subjects</span></div></div>{subjects.length ? <div className="subject-grid">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} tasks={tasks} onEdit={(item) => { setEditor(item); setName(item.name); setTarget(String(item.target || 60)); }} onDelete={removeSubject} />)}</div> : <EmptyState icon="bi-journal-plus" title="Your subjects start here">Add a subject to organize your preparation.</EmptyState>}<div className="modal-backdrop-custom" style={{ display: editor === null ? 'none' : undefined }} role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditor(null); }}><div className="app-modal"><div className="modal-heading"><div><span className="eyebrow">SUBJECT DETAILS</span><h2>{editor?.id ? 'Edit subject' : 'Add a subject'}</h2></div><button className="icon-button" onClick={() => setEditor(null)} aria-label="Close"><i className="bi bi-x-lg" /></button></div><form onSubmit={save}><label className="form-label">Subject name</label><input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Indian Polity" required autoFocus /><label className="form-label mt-3">Study target (hours)</label><input className="form-control" type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} required /><div className="modal-actions"><button type="button" className="btn btn-light" onClick={() => setEditor(null)}>Cancel</button><button className="btn btn-primary">{editor?.id ? 'Save changes' : 'Add subject'}</button></div></form></div></div></div>;
}

export function TasksPage({ onEditTask, onCreateTask, notify }) {
  const tasks = useSelector((state) => state.tasks);
  const subjects = useSelector((state) => state.subjects);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All tasks');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const filtered = useMemo(() => tasks.filter((task) => {
    const matchesText = `${task.title} ${task.topic || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || task.subjectId === subjectFilter;
    const matchesStatus = filter === 'All tasks' || (filter === 'Completed' ? task.completed : filter === 'Pending' ? !task.completed : task.date < today() && !task.completed);
    return matchesText && matchesSubject && matchesStatus;
  }).sort((a, b) => a.date.localeCompare(b.date)), [tasks, search, filter, subjectFilter]);
  const toggleOne = async (item) => { const updated = { ...item, completed: !item.completed }; try { await persistItem('tasks', updated, true); dispatch(updateTask(updated)); notify(updated.completed ? 'Nice work — task completed!' : 'Task moved to pending.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  const deleteOne = async (item) => { if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return; try { await removeItem('tasks', item.id); dispatch(deleteTask(item.id)); notify('Task deleted.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  return <div className="page-stack"><PageHeading eyebrow="MAKE IT ACTIONABLE" title="One task at a time." description="Keep your study goals clear, achievable, and moving forward." action={<button className="btn btn-primary" onClick={onCreateTask}><i className="bi bi-plus-lg me-2" />Create task</button>} /><div className="task-toolbar"><div className="search-box"><i className="bi bi-search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks or topics..." /></div><select className="form-select filter-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}><option value="all">All subjects</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select><select className="form-select filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All tasks</option><option>Pending</option><option>Completed</option><option>Overdue</option></select></div><section className="panel task-list-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR STUDY QUEUE</span><h3>{filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}</h3></div></div>{filtered.length ? filtered.map((task) => <TaskItem key={task.id} task={task} subject={subjects.find((s) => s.id === task.subjectId)} onToggle={toggleOne} onEdit={onEditTask} onDelete={deleteOne} />) : <EmptyState icon="bi-search" title="No matching tasks">Try another search or add something you’d like to work on.</EmptyState>}</section></div>;
}

export function PlannerPage({ notify }) {
  const subjects = useSelector((state) => state.subjects);
  const { sessions, selectedDate } = useSelector((state) => state.planner);
  const dispatch = useDispatch();
  const [editor, setEditor] = useState(null);
  const daySessions = sessions.filter((session) => session.date === selectedDate).sort((a, b) => a.start.localeCompare(b.start));
  const totalMinutes = daySessions.reduce((total, session) => total + Math.max(0, (Number(session.end.slice(0, 2)) * 60 + Number(session.end.slice(3))) - (Number(session.start.slice(0, 2)) * 60 + Number(session.start.slice(3)))), 0);
  const save = async (item) => { const next = { ...item, id: editor?.id || crypto.randomUUID(), date: selectedDate }; try { const saved = await persistItem('sessions', next, Boolean(editor?.id)); dispatch(editor?.id ? updateSession(saved) : addSession(saved)); setEditor(null); notify(editor?.id ? 'Study session updated.' : 'Study session added.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  const updateOne = async (session) => { const updated = { ...session, completed: !session.completed }; try { const saved = await persistItem('sessions', updated, true); dispatch(updateSession(saved)); notify(updated.completed ? 'Session marked complete.' : 'Session marked as planned.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  const deleteOne = async (session) => { if (!window.confirm('Delete this study session?')) return; try { await removeItem('sessions', session.id); dispatch(deleteSession(session.id)); notify('Session deleted.'); } catch (error) { notify(getErrorMessage(error), 'error'); } };
  return <div className="page-stack"><PageHeading eyebrow="MAKE TODAY YOURS" title="A plan with room to breathe." description="Give your focus a home. Your schedule is yours to shape." action={<button className="btn btn-primary" onClick={() => setEditor({})}><i className="bi bi-plus-lg me-2" />Plan a session</button>} /><section className="panel planner-panel"><div className="planner-datebar"><div><span className="eyebrow">YOUR STUDY DAY</span><h3>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</h3></div><div className="date-controls"><button className="icon-button" onClick={() => dispatch(selectDate(new Date(new Date(`${selectedDate}T12:00:00`).getTime() - 86400000).toISOString().slice(0, 10)))} aria-label="Previous day"><i className="bi bi-chevron-left" /></button><input type="date" className="form-control" value={selectedDate} onChange={(e) => dispatch(selectDate(e.target.value))} /><button className="icon-button" onClick={() => dispatch(selectDate(new Date(new Date(`${selectedDate}T12:00:00`).getTime() + 86400000).toISOString().slice(0, 10)))} aria-label="Next day"><i className="bi bi-chevron-right" /></button><button className="btn btn-light today-button" onClick={() => dispatch(selectDate(today()))}>Today</button></div></div><div className="planner-summary"><span><i className="bi bi-clock" /> {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m planned</span><span><i className="bi bi-calendar-check" /> {daySessions.length} sessions</span><span className="planner-summary-note">Steady progress beats a perfect plan.</span></div>{daySessions.length ? <div className="planner-timeline">{daySessions.map((session) => { const subject = subjects.find((item) => item.id === session.subjectId); const duration = Math.max(0, (Number(session.end.slice(0, 2)) * 60 + Number(session.end.slice(3))) - (Number(session.start.slice(0, 2)) * 60 + Number(session.start.slice(3)))); return <article className={`planner-session${session.completed ? ' session-complete' : ''}`} key={session.id}><div className="timeline-time">{session.start}<span>{session.end}</span></div><div className="timeline-marker" style={{ '--subject-color': subject?.color || '#436b58' }} /><div className="session-card"><div className="session-top"><span className="session-subject" style={{ color: subject?.color || '#436b58' }}>{subject?.name || 'Study session'}</span><span className={`priority priority-${session.priority.toLowerCase()}`}>{session.priority}</span></div><h4>{session.topic}</h4><p>{session.description || 'A focused study block for your preparation.'}</p><div className="session-foot"><span><i className="bi bi-hourglass-split" /> {duration} min</span><div><button className="session-action" onClick={() => updateOne(session)}><i className={`bi ${session.completed ? 'bi-arrow-counterclockwise' : 'bi-check2'}`} /> {session.completed ? 'Undo' : 'Complete'}</button><button className="session-action" onClick={() => setEditor(session)}><i className="bi bi-pencil" /> Edit</button><button className="session-action danger-hover" onClick={() => deleteOne(session)}><i className="bi bi-trash3" /></button></div></div></div></article>; })}</div> : <EmptyState icon="bi-calendar2-plus" title="An open page in your planner">Add a session when you’re ready to shape this day.<button className="btn btn-primary mt-3" onClick={() => setEditor({})}>Plan a session</button></EmptyState>}</section><SessionEditor key={`${selectedDate}-${editor?.id || 'new'}`} open={editor !== null} onClose={() => setEditor(null)} onSave={save} subjects={subjects} session={editor?.id ? editor : null} date={selectedDate} /></div>;
}

export function ProgressPage() {
  const tasks = useSelector((state) => state.tasks);
  const subjects = useSelector((state) => state.subjects);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const weeklyHours = tasks.filter((task) => task.completed && new Date(`${task.date}T12:00:00`) >= weekStart).reduce((sum, task) => sum + Number(task.duration || 0), 0) / 60;
  const completed = tasks.filter((task) => task.completed).length;
  return <div className="page-stack"><PageHeading eyebrow="LOOK HOW FAR YOU'VE COME" title="Progress, not perfection." description="Your effort is adding up. Take a moment to see the shape of it." /><div className="metric-grid progress-metrics"><MetricCard icon="bi-clock-history" label="This week" value={`${weeklyHours.toFixed(1)}h`} detail="Study time completed" tint="metric-green" /><MetricCard icon="bi-check2-circle" label="Tasks completed" value={completed} detail={`of ${tasks.length} total tasks`} tint="metric-violet" /><MetricCard icon="bi-journals" label="Subjects in focus" value={subjects.length} detail="Your learning portfolio" tint="metric-blue" /><MetricCard icon="bi-graph-up-arrow" label="Overall completion" value={`${tasks.length ? Math.round(completed / tasks.length * 100) : 0}%`} detail="Across all study tasks" tint="metric-amber" /></div><div className="progress-charts-grid"><section className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">SHOWING UP COUNTS</span><h3>Study time this week</h3></div><span className="chart-unit">Hours / day</span></div><StudyHoursChart tasks={tasks} /></section><section className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">STEADY MOMENTUM</span><h3>Tasks at a glance</h3></div></div><CompletionChart tasks={tasks} /></section><section className="panel chart-panel full-chart"><div className="panel-heading"><div><span className="eyebrow">YOUR LEARNING MAP</span><h3>Subject task completion</h3></div><span className="chart-unit">Based on completed tasks</span></div><SubjectProgressChart subjects={subjects} tasks={tasks} /></section></div></div>;
}

export function AssistantPage({ notify }) {
  const tasks = useSelector((state) => state.tasks);
  const subjects = useSelector((state) => state.subjects);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const pending = tasks.filter((task) => !task.completed);
  const ask = async (question = prompt) => {
    setLoading(true);
    try {
      const { api } = await import('../services/api');
      const result = await api.post('/assistant', { prompt: question, context: { tasks: tasks.slice(0, 30), subjects: subjects.map(({ id, name }) => ({ id, name })) } });
      setAnswer(result.data.message);
    } catch {
      setAnswer('Your study assistant is unavailable right now. You can still use the suggestions below to plan a focused study block.');
      notify('Could not reach the study assistant. Please check that the backend is running.');
    } finally { setLoading(false); }
  };
  return <div className="page-stack"><PageHeading eyebrow="A LITTLE GUIDANCE, WHEN YOU NEED IT" title="Think it through together." description="Ask for a plan, a revision nudge, or help finding your next step." /><div className="assistant-layout"><section className="assistant-main"><div className="assistant-intro"><div className="assistant-large-orb"><i className="bi bi-stars" /></div><div><span className="eyebrow">YOUR STUDY COMPANION</span><h3>What would help today?</h3><p>Suggestions are based on your current subjects and tasks. No question is too small.</p></div></div><div className="prompt-chips">{['Make me a plan for today', 'What should I revise next?', 'Help me catch up this week'].map((question) => <button key={question} onClick={() => { setPrompt(question); ask(question); }}>{question}<i className="bi bi-arrow-up-right" /></button>)}</div><form className="assistant-input" onSubmit={(event) => { event.preventDefault(); if (prompt.trim()) ask(); }}><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows="2" placeholder="Tell me what you're working on..." /><div className="assistant-input-footer"><span><i className="bi bi-shield-check me-1" />Your study data stays on your configured backend.</span><button className="btn btn-primary" disabled={loading || !prompt.trim()}>{loading ? <><span className="spinner-border spinner-border-sm me-2" />Thinking</> : <>Ask assistant <i className="bi bi-arrow-up-right ms-2" /></>}</button></div></form>{answer && <div className="answer-card"><span className="eyebrow"><i className="bi bi-stars me-1" />A THOUGHTFUL NEXT STEP</span><p>{answer}</p></div>}</section><aside className="assistant-aside"><div className="panel"><div className="panel-heading"><div><span className="eyebrow">A FEW IDEAS</span><h3>Try asking</h3></div></div><div className="idea-list">{['Create a balanced study plan for today.', 'How can I revise a topic I keep forgetting?', 'Suggest a realistic way to catch up on pending tasks.', 'Give me a quick recall exercise for a subject.'].map((text, index) => <button key={text} onClick={() => { setPrompt(text); ask(text); }}><span>0{index + 1}</span>{text}<i className="bi bi-arrow-up-right" /></button>)}</div></div><AITipCard compact>{pending.length ? `You have ${pending.length} pending tasks. Pick one to work on for just 25 minutes—starting is the hardest part.` : 'A clear task list is a lovely place to be. Consider a short revision session or a well-earned break.'}</AITipCard><div className="privacy-note"><i className="bi bi-lock" /><span><b>Private by design</b><small>AI requests are sent only to your configured backend. Keep provider keys on the server.</small></span></div></aside></div></div>;
}
