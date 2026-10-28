import { createSlice } from '@reduxjs/toolkit';

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: [],
  reducers: {
    setSubjects: (_state, action) => action.payload,
    addSubject: (state, action) => { state.unshift(action.payload); },
    updateSubject: (state, action) => {
      const index = state.findIndex((subject) => subject.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteSubject: (state, action) => state.filter((subject) => subject.id !== action.payload),
  },
});

export const { setSubjects, addSubject, updateSubject, deleteSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;
