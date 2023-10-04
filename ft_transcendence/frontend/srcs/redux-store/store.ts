import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import profileReducer from './profile/profileSlice';
import avatarReducer from "./profile/avatarSlice"

export const store = configureStore({
  reducer: {
    profileReducer,
    avatarReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
