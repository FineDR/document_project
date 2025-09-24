import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../types/cv/cv";
interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
}

const initialState: AuthState = {
  access: null,
  refresh: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        access: string;
        refresh: string;
        user: User;
      }>
    ) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.user = action.payload.user;
    },
    logoutSuccess: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
