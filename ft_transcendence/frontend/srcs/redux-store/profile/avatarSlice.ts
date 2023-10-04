import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AvatarState {
    url: string;
}

const avatarUrl = 'http://localhost:3000/api/atari-pong/v1/user/avatar';

const initialState: AvatarState = {
    url: '',
};

export const profileAvatar = createAsyncThunk('profile/profileAvatar',
async () =>{
    const res = await fetch(avatarUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'image/jpeg',
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        },
    });
	const imageBlob = await res.blob();
  	return URL.createObjectURL(imageBlob) as string;

});

const avatarSlice = createSlice({
    name: 'avatar',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
      builder
      .addCase(profileAvatar.fulfilled, (state, action) => {
        state.url = action.payload;
      })
    },
  });

export const avatarSelector = (state: RootState) => state.avatarReducer;
export default avatarSlice.reducer;
