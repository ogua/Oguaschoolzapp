//import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userinfoReducer from './features/userinfoSlice';
import examReducer from "./features/examSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';


const rootPersistConfig  = {
  key: 'root',
  storage: storage
}

const userPersistConfig = {
  key: 'userinfo',
 storage: storage
}

const examPersistConfig = {
  key: 'exam',
 storage: storage
}

const rootReducer = combineReducers({
  userinfo: persistReducer(userPersistConfig, userinfoReducer),
  exam: persistReducer(examPersistConfig, examReducer),
})

const persistedReducer = persistReducer(rootPersistConfig , rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)