import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studentData: null,
  courses: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    fetchStudentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentSuccess: (state, action) => {
      state.loading = false;
      state.studentData = action.payload.student;
      state.courses = action.payload.courseAttendance;
    },
    fetchStudentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStudentData: (state, action) => {
      state.studentData = { ...state.studentData, ...action.payload };
    },
    updateCourses: (state, action) => {
      state.courses = action.payload;
    },
    clearStudentData: (state) => {
      state.studentData = null;
      state.courses = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchStudentStart,
  fetchStudentSuccess,
  fetchStudentFailure,
  updateStudentData,
  updateCourses,
  clearStudentData,
} = studentSlice.actions;

export default studentSlice.reducer;
