import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  exam: null,
}

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExam: (state,action) => {
      state.exam = action.payload
    },
    
  },
})

export const {setExam} = examSlice.actions

export const selectexam = (state) => state.exam.exam


export default examSlice.reducer