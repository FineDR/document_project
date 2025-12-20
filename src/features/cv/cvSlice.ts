import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { users, userDetails } from "../../api/services/authApi";
import { type User } from "../../types/cv/cv";
import { cvData } from "../../data/cvData"; // Import the static data

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

// Helper function to check if CV is empty or incomplete
const isCvEmpty = (cv: User): boolean => {
  return (
    !cv.personal_details?.profile_summary &&
    cv.career_objectives.length === 0 &&
    cv.educations.length === 0 &&
    cv.projects.length === 0 &&
    cv.work_experiences.length === 0
  );
};

// Helper function to merge user data with static template
const mergeWithStaticTemplate = (user: User): User => {
  // Create a deep copy of the static template
  const mergedCv = JSON.parse(JSON.stringify(cvData));
  
  // Preserve user's basic information
  mergedCv.id = user.id;
  mergedCv.email = user.email;
  mergedCv.first_name = user.first_name;
  mergedCv.middle_name = user.middle_name;
  mergedCv.last_name = user.last_name;
  
  // Update personal details if they exist
  if (user.personal_details) {
    mergedCv.personal_details = {
      ...mergedCv.personal_details,
      ...user.personal_details,
      id: user.personal_details.id || mergedCv.personal_details.id,
      user: user.id
    };
  }
  
  // Update other sections if they have data
  if (user.career_objectives.length > 0) {
    mergedCv.career_objectives = user.career_objectives.map(obj => ({
      ...obj,
      user: user.id
    }));
  }
  
  if (user.educations.length > 0) {
    mergedCv.educations = user.educations.map(edu => ({
      ...edu,
      user: user.id
    }));
  }
  
  // Repeat for other sections (projects, work_experiences, etc.)
  
  return mergedCv;
};

// -------------------- Async Thunks --------------------

// Fetch current user's CV
export const fetchCv = createAsyncThunk<User>(
  'cv/fetchCv',
  async (_, { rejectWithValue }) => {
    try {
      const response = await users();
      let userData = response.data.enhanced_data || response.data;
      
      // If CV is empty or incomplete, use static template
      if (isCvEmpty(userData)) {
        userData = mergeWithStaticTemplate(userData);
      }
      
      return userData;
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
      const response = await userDetails();
      return response.data.map((user: User) => {
        // If any user's CV is empty, merge with static template
        if (isCvEmpty(user)) {
          return mergeWithStaticTemplate(user);
        }
        return user;
      });
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