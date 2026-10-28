import { createSlice } from '@reduxjs/toolkit';

const plannerSlice = createSlice({
  name: 'planner',
  initialState: { sessions: [], selectedDate: new Date().toISOString().slice(0, 10), timer: null, elapsedSeconds: 0, studyMinutes: 0 },
  reducers: {
    setSessions: (state, action) => { state.sessions = action.payload; },
    addSession: (state, action) => { state.sessions.push(action.payload); },
    updateSession: (state, action) => {
      const index = state.sessions.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.sessions[index] = action.payload;
    },
    deleteSession: (state, action) => { state.sessions = state.sessions.filter((item) => item.id !== action.payload); },
    selectDate: (state, action) => { state.selectedDate = action.payload; },
    startTimer: (state, action) => { state.timer = { ...action.payload, startedAt: Date.now() }; },
    stopTimer: (state) => {
      state.timer = null;
      state.elapsedSeconds = 0;
    },
    setElapsed: (state, action) => { state.elapsedSeconds = action.payload; },
    addStudyMinutes: (state, action) => { state.studyMinutes += action.payload; },
  },
});

export const { setSessions, addSession, updateSession, deleteSession, selectDate, startTimer, stopTimer, setElapsed, addStudyMinutes } = plannerSlice.actions;
export default plannerSlice.reducer;
