/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store/store";

// API base URL
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// User type
export interface AdminUser {
  id: number;
  email: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
}

// Slice state type
interface AdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk to fetch admin users
export const fetchAdminUsers = createAsyncThunk<
  AdminUser[],
  void,
  { state: RootState }
>(
  "adminUsers/fetchAdminUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.access;
      const response = await axios.get<AdminUser[] | AdminUser>(`${API_BASE_URL}/auth/admin/users/`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      // Ensure the response is always an array
      const data = Array.isArray(response.data) ? response.data : [response.data];
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
export const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
        state.loading = false;
        state.users = action.payload;
        console.log("Fetched admin users:", state.users);
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Failed to fetch admin users:", action.payload);
      });
  },
});

export default adminUsersSlice.reducer;
