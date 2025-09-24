/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store/store";
import type { Job } from "../types/job";

// Use only Vite environment variable
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// Fetch all jobs
export const fetchJobs = createAsyncThunk<Job[], void, { state: RootState }>(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Job[]>(`${API_BASE_URL}/api/jobs/`);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice state type
interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobsError(state) {
      state.error = null;
    },
    clearJobs(state) {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
        console.log("Fetched jobs:", state.jobs);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Failed to fetch jobs:", action.payload);
      });
  },
});

// Export actions
export const { clearJobsError, clearJobs } = jobsSlice.actions;

// Export reducer
export default jobsSlice.reducer;
