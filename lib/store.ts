import { configureStore } from '@reduxjs/toolkit';
import teamReducer from './slices/teamSlice';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    team: teamReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
