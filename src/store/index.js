import { configureStore } from '@reduxjs/toolkit';
import subjectsReducer from './subjectsSlice';
import tasksReducer from './tasksSlice';
import plannerReducer from './plannerSlice';
import { initialData } from '../data/seed';

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('upsc-track-state') || 'null'); } catch { return null; }
})();

export const store = configureStore({
  reducer: {
    subjects: subjectsReducer,
    tasks: tasksReducer,
    planner: plannerReducer,
  },
  preloadedState: {
    subjects: saved?.subjects || initialData.subjects,
    tasks: saved?.tasks || initialData.tasks,
    planner: {
      sessions: saved?.planner?.sessions || initialData.sessions,
      selectedDate: new Date().toISOString().slice(0, 10),
      timer: null,
      elapsedSeconds: 0,
      studyMinutes: saved?.planner?.studyMinutes || 0,
    },
  },
});

store.subscribe(() => {
  const { subjects, tasks, planner } = store.getState();
  localStorage.setItem('upsc-track-state', JSON.stringify({
    subjects,
    tasks,
    planner: { sessions: planner.sessions, studyMinutes: planner.studyMinutes },
  }));
});
