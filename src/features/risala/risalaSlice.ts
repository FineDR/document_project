import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createRisala, updateRisala, getRisala, generateAIValues } from "../../api/services/risala";
import type { RisalaFormData, RisalaData } from "../../types/risalaTypes";

// --------------------------
//  Async Thunks
// --------------------------

export const submitRisala = createAsyncThunk<RisalaData, RisalaFormData, { rejectValue: string }>(
  "risala/submit",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createRisala(data);
      return res.data as RisalaData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Submission failed");
    }
  }
);

// Fetch current user's risala (no ID)
export const fetchRisala = createAsyncThunk<RisalaData, void, { rejectValue: string }>(
  "risala/fetchOne",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRisala();
      return res.data as RisalaData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

// Update current user's risala (no ID)
export const editRisala = createAsyncThunk<RisalaData, RisalaFormData, { rejectValue: string }>(
  "risala/edit",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateRisala(data);
      return res.data as RisalaData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

export const generateAIForStep = createAsyncThunk<
  Partial<RisalaFormData>,
  { step: number; instruction: string; eventType?: string },
  { rejectValue: string }
>(
  "risala/generateAI",
  async ({ step, instruction, eventType }, { rejectWithValue }) => {
    try {
      const res = await generateAIValues({ step, instruction, eventType });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "AI generation failed");
    }
  }
);

// --------------------------
//  Slice State
// --------------------------

interface RisalaState {
  step: number;
  data: RisalaData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  aiLoading: boolean;
  aiData: Partial<RisalaFormData> | null;
}

const initialState: RisalaState = {
  step: 1,
  data: null,
  loading: false,
  error: null,
  success: false,
  aiLoading: false,
  aiData: null,
};

// --------------------------
//  Slice
// --------------------------

const risalaSlice = createSlice({
  name: "risala",
  initialState,
  reducers: {
    savePartial(state, action: PayloadAction<Partial<RisalaFormData>>) {
      if (state.data) {
        state.data.raw_data = { ...state.data.raw_data, ...action.payload };
        state.data.cleaned_fields = { ...state.data.cleaned_fields, ...action.payload };
      }
    },
    saveFinal(state, action: PayloadAction<RisalaData>) {
      state.data = action.payload;
    },
    nextStep(state) {
      state.step += 1;
    },
    previousStep(state) {
      state.step -= 1;
    },
    resetRisala(state) {
      state.step = 1;
      state.data = null;
      state.error = null;
      state.success = false;
      state.aiLoading = false;
      state.aiData = null;
    },
    clearAIData(state) {
      state.aiData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SUBMIT RISALA
      .addCase(submitRisala.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRisala.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(submitRisala.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // FETCH RISALA
      .addCase(fetchRisala.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRisala.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRisala.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // UPDATE RISALA
      .addCase(editRisala.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editRisala.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(editRisala.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      })

      // AI GENERATION
      .addCase(generateAIForStep.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
      })
      .addCase(generateAIForStep.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiData = action.payload;
      })
      .addCase(generateAIForStep.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload || "AI generation failed";
      });
  },
});

// --------------------------
//  Export Actions & Reducer
// --------------------------

export const {
  savePartial,
  saveFinal,
  nextStep,
  previousStep,
  resetRisala,
  clearAIData,
} = risalaSlice.actions;

export default risalaSlice.reducer;
