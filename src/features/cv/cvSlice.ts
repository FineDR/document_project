import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { users, userDetails } from "../../api/services/authApi";
import { type User } from "../../types/cv/cv";

// -------------------- State --------------------
export interface CvState {
  cv: User | null;           // Currently viewed CV
  allUsers: User[];          // All users (for admin view)
  loading: boolean;
  error: string | null;
  selectedCvId: number | null; // Admin-selected user CV
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CvState = {
  cv: null,
  allUsers: [],
  loading: false,
  error: null,
  selectedCvId: null,
  status: 'idle',
};

// -------------------- Async Thunks --------------------

// Fetch current user's CV
export const fetchCv = createAsyncThunk<User>(
  'cv/fetchCv',
  async (_, { rejectWithValue }) => {
    try {
      const response = await users(); // ✅ await the Axios call
      console.log("Fetched CV data:", response.data);
      return response.data.enhanced_data || response.data; // use flattened CV
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all users (admin)
export const fetchAllUsers = createAsyncThunk<User[]>(
  'cv/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userDetails(); // ✅ await the Axios call
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- Slice --------------------
const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setSelectedCvId(state, action) {
      state.selectedCvId = action.payload;

      // Update the CV if the selected ID exists in allUsers
      const selected = state.allUsers.find(user => user.id === action.payload);
      if (selected) {
        state.cv = selected.enhanced_data || selected;
      }
    },
    clearCv(state) {
      state.cv = null;
      state.allUsers = [];
      state.error = null;
      state.loading = false;
      state.status = 'idle';
      state.selectedCvId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- fetchCv --------
      .addCase(fetchCv.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchCv.fulfilled, (state, action) => {
        state.loading = false;
        state.cv = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      })

      // -------- fetchAllUsers --------
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.status = 'succeeded';

        // Optionally set the first user's CV if none selected
        if (!state.selectedCvId && action.payload.length > 0) {
          state.selectedCvId = action.payload[0].id;
          state.cv = action.payload[0].enhanced_data || action.payload[0];
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

// -------------------- Exports --------------------
export const { setSelectedCvId, clearCv } = cvSlice.actions;
export default cvSlice.reducer;
