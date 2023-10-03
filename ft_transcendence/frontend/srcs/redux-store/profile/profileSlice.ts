import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import io from 'socket.io-client';

interface Profile {
  firstName: string;
  lastName: string;
  login: string;
  numberOfGamesPlayed: number;
  winPercent: number;
  level: number;
  percentage: number;
  state: number;
  numberOfGamesWon: number;
  avatar: string;
}

export interface ProfileState {
  loading: boolean;
  hasErrors: boolean | string;
  profile: Profile;
}

const initialState: ProfileState = {
  loading: false,
  hasErrors: '',
  profile: {} as Profile,
};

const profileUrl = 'http://localhost:3000/api/atari-pong/v1/user/me';

export const fetchProfile = createAsyncThunk('profile/fetchProfile',
async () =>{
  try {
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(profileUrl, config);
    return response.data;
  } catch (error) {
    return error;
  }
});

export const userOnline = createAsyncThunk('profile/userOnline',
async () =>{
  try {
    const token = localStorage.getItem('jwtToken');
    io('http://localhost:3000', {transports: ['websocket'], 
      auth: {
        token: token
      }})
  } catch (error) {
    return error;
  }
});


const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    })
  },
});

export const profileSelector = (state: RootState) => state.profileReducer;
export default profileSlice.reducer;