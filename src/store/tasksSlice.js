import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    setTasks: (_state, action) => action.payload,
    addTask: (state, action) => { state.unshift(action.payload); },
    updateTask: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    toggleTask: (state, action) => {
      const task = state.find((item) => item.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    deleteTask: (state, action) => state.filter((task) => task.id !== action.payload),
  },
});

export const { setTasks, addTask, updateTask, toggleTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
