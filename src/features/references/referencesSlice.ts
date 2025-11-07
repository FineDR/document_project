import { type Reference } from "../../types/cv/cv";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    getReference,
    getReferences,
    createReference,
    updateReference,
    deleteReference

} from '../../api/services/referencesApi';

interface ReferencesState {
    references: Reference[];
    loading: boolean;
    selectedReference?: Reference | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ReferencesState = {
    references: [],
    loading: false,
    status: 'idle',
    error: null
}

export const fetchReferences = createAsyncThunk<Reference[]>(
  "references/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getReferences(); // no argument here
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch references"
      );
    }
  }
);

export const fetchReference = createAsyncThunk<Reference, number>(
    "references/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getReference(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reference');
        }
    }

)

export const addReference = createAsyncThunk<Reference, any>(
    "references/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createReference(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add reference');
        }
    }
)

export const editReference = createAsyncThunk<Reference, { id: number; data: any }>(
    "references/edit",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateReference(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update reference');
        }
    }
)

export const deleteReferenceById = createAsyncThunk<Reference, number>(
    "references/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteReference(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete reference');
        }
    }
)

export const referencesSlice = createSlice({
    name: 'references',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedReference = action.payload;
        },
        clearSelected(state) {
            state.selectedReference = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReferences.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchReferences.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.references = action.payload;
            })
            .addCase(fetchReferences.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchReference.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchReference.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedReference = action.payload;
            })
            .addCase(fetchReference.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addReference.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addReference.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.references=[...state.references, action.payload];
            })
            .addCase(addReference.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(editReference.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(editReference.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.references.findIndex(ref => ref.id === action.payload.id);
                if (index !== -1) {
                    state.references[index] = action.payload;
                }
            })
            .addCase(editReference.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteReferenceById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteReferenceById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.references = state.references.filter(ref => ref.id !== action.payload.id);
            })
            .addCase(deleteReferenceById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { setSelected, clearSelected } = referencesSlice.actions;

export default referencesSlice.reducer;