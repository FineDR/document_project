import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import {
    getPersonalDetails,
    getPersonalDetail,
    createPersonalDetail,
    updatePersonalDetail,
    deletePersonalDetail

} from '../../api/services/personalDetailsApi'

import {  type PersonalDetails } from '../../types/cv/cv';

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
    error: null
}
export const fetchPersonalDetails = createAsyncThunk<PersonalDetails[]>(
    "personalDetails/fetchAll",
    async (_, {rejectWithValue}) => {
        try {
            const response = await getPersonalDetails();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch personal details');
        }
    }
)

export const fetchPersonalDetail = createAsyncThunk<PersonalDetails, number>(
    "personalDetails/fetchById",
    async (id, {rejectWithValue}) => {
        try {
            const response = await getPersonalDetail(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch personal detail');
        }
    }

)

export const addPersonalDetail = createAsyncThunk<PersonalDetails, any>(
    "personalDetails/add",
    async (data, {rejectWithValue}) => {
        try {
            const response = await createPersonalDetail(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create personal detail');
        }
    }
)

export const updatePersonalInfo = createAsyncThunk<PersonalDetails, {id: number, data: any}>(
    "personalDetails/update",           
    async ({id, data}, {rejectWithValue}) => {
        try {
            const response = await updatePersonalDetail(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update personal detail');
        }
    }
)

export const deletePersonalInfo = createAsyncThunk<number, number>(
    "personalDetails/delete",
    async (id, {rejectWithValue}) => {
        try {
            await deletePersonalDetail(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete personal detail');
        }
    }
)

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
                state.personalDetails.push(action.payload);
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
                const index = state.personalDetails.findIndex(pd => pd.id === action.payload.id);
                if (index !== -1) {
                    state.personalDetails[index] = action.payload;
                }
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
            .addCase(deletePersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.personalDetails = state.personalDetails.filter(pd => pd.id !== action.payload);
            })
            .addCase(deletePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { setSelected,clearSelected } = personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;