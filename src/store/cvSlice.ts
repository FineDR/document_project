/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../types/cv/cv";
import type { RootState } from "../store/store";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Fetch all CVs
export const fetchCVData = createAsyncThunk<User[], void, { state: RootState }>(
  "cv/fetchCVData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.access;

      const response = await axios.get<User[] | User>(`${API_BASE_URL}/auth/user-details/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = Array.isArray(response.data) ? response.data : [response.data];
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single CV by user ID
export const fetchCurrentUserCV = createAsyncThunk<User, void, { state: RootState }>(
  "cv/fetchCurrentUserCV",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.access;

      const response = await axios.get<User>(`${API_BASE_URL}/auth/user-details/`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice state type
interface CVState {
  cvs: User[];
  selectedCV: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: CVState = {
  cvs: [],
  selectedCV: null,
  loading: false,
  error: null,
};

export const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    setSelectedCV(state, action: PayloadAction<User | null>) {
      state.selectedCV = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    // New reducer to update skills
    updateSkills(state, action: PayloadAction<{ skillSet: User["skill_sets"][0] }>) {
      const updatedSkillSet = action.payload.skillSet;

      // Update selectedCV if it exists
      if (state.selectedCV && state.selectedCV.id === updatedSkillSet.user) {
        state.selectedCV.skill_sets = [updatedSkillSet];
      }

      // Update the cvs array
      state.cvs = state.cvs.map((cv) =>
        cv.id === updatedSkillSet.user ? { ...cv, skill_sets: [updatedSkillSet] } : cv
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCVData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCVData.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.cvs = action.payload;
        console.log("Fetched CV data:", state.cvs);
      })
      .addCase(fetchCVData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Failed to fetch CV data:", action.payload);
      })
      .addCase(fetchCurrentUserCV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserCV.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.selectedCV = action.payload;
        console.log("Fetched single CV:", action.payload);
      })
      .addCase(fetchCurrentUserCV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Failed to fetch single CV:", action.payload);
      });
  },
});

// Export actions
export const { setSelectedCV, clearError, updateSkills } = cvSlice.actions;

// Export reducer
export default cvSlice.reducer;
