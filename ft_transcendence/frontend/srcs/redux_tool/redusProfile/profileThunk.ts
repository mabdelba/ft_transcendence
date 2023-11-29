'use client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { setProfile, updateImage } from './profileSlice';
import { store } from '..';
import test from '@/../public/test1.svg';

export const getMyProfile = createAsyncThunk('profile', async () => {
  try {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const respo = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return respo.data;
    }
  } catch (error: any) {
    console.log(error);

    // store.dispatch(setProfile({}));
    // store.dispatch(updateImage(test));
    // store.dispatch((test));
    // // console.log(error);
    // throw error;
  }
});
