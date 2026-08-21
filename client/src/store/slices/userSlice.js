import userService from "@/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react";

import { getMe } from "@/services/authService";

const fetchUserProfile = createAsyncThunk("user/fetchProfile", async () => {
  const res = await userService.fetchUserProfile();
  return res;
});

const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formdata) => {
    const res = await userService.updateUserProfile(formdata);
    return res;
  },
);

const changePassword = createAsyncThunk("user/changePassword", async (data) => {
  const res = await userService.changePassword(data);
  return res;
});

const fetchMe = createAsyncThunk("user/getMe", async () => {
  const res = await getMe();
  return res;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //change user password

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.user = action.error.message;
      })

      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export { fetchUserProfile, updateUserProfile, changePassword, fetchMe };
export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
