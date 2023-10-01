import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  firstName: string;
  lastName: string;
  login: string;
  matchPlayed: number;
  winPercent: number;
  level: number;
  percentage: number;
  online: boolean;
}

const initialState: ProfileState = {
  firstName: '',
  lastName: '',
  login: '',
  matchPlayed: 0,
  winPercent: 0,
  level: 0,
  percentage: 0,
  online: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;