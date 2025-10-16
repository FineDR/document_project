import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { TEMPLATE_DOWNLOAD } from "../../api/endpoints";

// -------------------- Async thunks --------------------

// Fetch PDF for Basic template
export const getBasicPDF = createAsyncThunk(
  "downloads/getBasicPDF",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(TEMPLATE_DOWNLOAD.Basic, {
        responseType: "blob",
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch PDF for Intermediate template
export const getIntermediatePDF = createAsyncThunk(
  "downloads/getIntermediatePDF",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(TEMPLATE_DOWNLOAD.Intermediate, {
        responseType: "blob",
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch PDF for Advanced template
export const getAdvancedPDF = createAsyncThunk(
  "downloads/getAdvancedPDF",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(TEMPLATE_DOWNLOAD.Advanced, {
        responseType: "blob",
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// -------------------- Slice --------------------
interface DownloadsState {
  loading: boolean;
  error: string | null;
  pdfBlob: Blob | null;
}

const initialState: DownloadsState = {
  loading: false,
  error: null,
  pdfBlob: null,
};

const downloadsSlice = createSlice({
  name: "downloads",
  initialState,
  reducers: {
    clearPDF: (state) => {
      state.pdfBlob = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: DownloadsState) => {
      state.loading = true;
      state.error = null;
      state.pdfBlob = null;
    };

    const handleRejected = (state: DownloadsState, action: any) => {
      state.loading = false;
      state.error = action.payload || "Failed to download PDF";
    };

    const handleFulfilled = (state: DownloadsState, action: any) => {
      state.loading = false;
      state.pdfBlob = action.payload;
      state.error = null;
    };

    // Basic
    builder.addCase(getBasicPDF.pending, handlePending);
    builder.addCase(getBasicPDF.rejected, handleRejected);
    builder.addCase(getBasicPDF.fulfilled, handleFulfilled);

    // Intermediate
    builder.addCase(getIntermediatePDF.pending, handlePending);
    builder.addCase(getIntermediatePDF.rejected, handleRejected);
    builder.addCase(getIntermediatePDF.fulfilled, handleFulfilled);

    // Advanced
    builder.addCase(getAdvancedPDF.pending, handlePending);
    builder.addCase(getAdvancedPDF.rejected, handleRejected);
    builder.addCase(getAdvancedPDF.fulfilled, handleFulfilled);
  },
});

export const { clearPDF } = downloadsSlice.actions;
export default downloadsSlice.reducer;
