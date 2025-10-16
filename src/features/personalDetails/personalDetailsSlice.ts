import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getPersonalDetails,
    getPersonalDetail,
    createPersonalDetail,
    updatePersonalDetail,
    deletePersonalDetail
} from '../../api/services/personalDetailsApi';
import { type PersonalDetails } from '../../types/cv/cv';

interface PersonalDetailsState {
    personalDetails: PersonalDetails[];
    loading: boolean;
    selectedPersonalDetail?: PersonalDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PersonalDetailsState = {
    personalDetails: [],
    loading: false,
    status: 'idle',
    error: null,
    selectedPersonalDetail: null
};

// Fetch all personal details (if needed)
export const fetchPersonalDetails = createAsyncThunk<PersonalDetails[]>(
    'personalDetails/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPersonalDetails();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch personal details');
        }
    }
);

// Fetch current user's personal detail
export const fetchPersonalDetail = createAsyncThunk<PersonalDetails>(
    'personalDetails/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPersonalDetail(); // no id
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch personal detail');
        }
    }
);

// Create or update personal detail
export const addPersonalDetail = createAsyncThunk<PersonalDetails, FormData>(
    'personalDetails/add',
    async (data, { rejectWithValue }) => {
        try {
            const response = await createPersonalDetail(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create personal detail');
        }
    }
);

// Update personal detail (no id needed)
export const updatePersonalInfo = createAsyncThunk<PersonalDetails, FormData>(
    'personalDetails/update',
    async (data, { rejectWithValue }) => {
        try {
            const response = await updatePersonalDetail(data); // no id
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update personal detail');
        }
    }
);

// Delete personal detail (no id needed)
export const deletePersonalInfo = createAsyncThunk<void>(
    'personalDetails/delete',
    async (_, { rejectWithValue }) => {
        try {
            await deletePersonalDetail(); // no id
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete personal detail');
        }
    }
);

export const personalDetailsSlice = createSlice({
    name: 'personalDetails',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedPersonalDetail = action.payload;
        },
        clearSelected(state) {
            state.selectedPersonalDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalDetails.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPersonalDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.personalDetails = action.payload;
            })
            .addCase(fetchPersonalDetails.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchPersonalDetail.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPersonalDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedPersonalDetail = action.payload;
            })
            .addCase(fetchPersonalDetail.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addPersonalDetail.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addPersonalDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedPersonalDetail = action.payload;
            })
            .addCase(addPersonalDetail.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updatePersonalInfo.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updatePersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedPersonalDetail = action.payload;
            })
            .addCase(updatePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deletePersonalInfo.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deletePersonalInfo.fulfilled, (state) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedPersonalDetail = null;
            })
            .addCase(deletePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { setSelected, clearSelected } = personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;
