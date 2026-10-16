import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import biodataReducer from '../features/biodata/biodataSlice';
import gamReducer from '../features/gams/gamSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    biodata: biodataReducer,
    gams: gamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
