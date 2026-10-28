import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import TaskForm from './components/TaskForm';
import { api, getErrorMessage } from './services/api';
import { persistItem } from './services/persistence';
import { setSubjects, addSubject, updateSubject } from './store/subjectsSlice';
import { setTasks, addTask, updateTask } from './store/tasksSlice';
import { setSessions } from './store/plannerSlice';
import { Dashboard, SubjectsPage, TasksPage, PlannerPage, ProgressPage, AssistantPage } from './pages/Pages';

export default function App() {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects);
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [dataStatus, setDataStatus] = useState('loading');
  const location = useLocation();

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3600);
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/data').then(({ data }) => {
      if (!active) return;
      if (Array.isArray(data.subjects)) dispatch(setSubjects(data.subjects));
      if (Array.isArray(data.tasks)) dispatch(setTasks(data.tasks));
      if (Array.isArray(data.sessions)) dispatch(setSessions(data.sessions));
      setDataStatus('connected');
    }).catch(() => {
      if (!active) return;
      setDataStatus(import.meta.env.VITE_DEMO_MODE === 'false' ? 'error' : 'demo');
    });
    return () => { active = false; };
  }, [dispatch]);

  const openNewTask = () => { setEditingTask(null); setTaskModal(true); };
  const openEditTask = (task) => { setEditingTask(task); setTaskModal(true); };
  const saveTask = async (task) => {
    const item = { ...task, id: editingTask?.id || crypto.randomUUID() };
    try {
      await persistItem('tasks', item, Boolean(editingTask));
      dispatch(editingTask ? updateTask(item) : addTask(item));
      setTaskModal(false);
      setEditingTask(null);
      notify(editingTask ? 'Task updated.' : 'Task added to your study list.');
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar onAddTask={openNewTask} />
        {dataStatus === 'error' && <div className="connection-banner error"><i className="bi bi-exclamation-circle" /> Could not load the backend data. Check your API configuration and refresh.</div>}
        {dataStatus === 'demo' && <div className="connection-banner"><i className="bi bi-info-circle" /> Demo mode · your changes are saved in this browser. Start the API to enable shared file persistence.</div>}
        <div className="content-area" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Dashboard onEditTask={openEditTask} onCreateTask={openNewTask} notify={notify} />} />
            <Route path="/subjects" element={<SubjectsPage notify={notify} />} />
            <Route path="/planner" element={<PlannerPage notify={notify} />} />
            <Route path="/tasks" element={<TasksPage onEditTask={openEditTask} onCreateTask={openNewTask} notify={notify} />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/assistant" element={<AssistantPage notify={notify} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <TaskForm open={taskModal} onClose={() => setTaskModal(false)} onSave={saveTask} subjects={subjects} task={editingTask} />
      {toast && <div className={`app-toast ${toast.type}`} role="status"><i className={`bi ${toast.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle-fill'}`} />{toast.message}<button onClick={() => setToast(null)} aria-label="Dismiss"><i className="bi bi-x" /></button></div>}
    </div>
  );
}
