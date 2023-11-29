import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getMyProfile } from './profileThunk';

export interface ProfileState {
  profile: any;
  auth_status: boolean;
}

const initialState: ProfileState = {
  profile: {},
  auth_status: false,
};

export const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    updateUsename: (state, action: PayloadAction<any>) => {
      state.profile.username = action.payload;
    },
    updateImage: (state, action: PayloadAction<any>) => {
      state.profile.profile.avatar = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const { setProfile, updateUsename, updateImage } = ProfileSlice.actions;
export default ProfileSlice.reducer;
