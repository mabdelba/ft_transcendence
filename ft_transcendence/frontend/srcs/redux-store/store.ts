import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import profileReducer from './profile/profileSlice';

export const store = configureStore({
  reducer: {
    profileReducer,
    // reference reducers here
  },
});

// create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
