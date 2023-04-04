import { configureStore } from '@reduxjs/toolkit'
import userinfoReducer from './features/userinfoSlice'

export default configureStore({
  reducer: {
    userinfo: userinfoReducer
  },
})