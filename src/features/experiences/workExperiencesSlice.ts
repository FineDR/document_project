import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import {
 getWorkExperience,
 getWorkExperiences,
 createWorkExperience,
 updateWorkExperience,
 deleteWorkExperience

} from '../../api/services/workExperienceApi';
import {  type WorkExperience } from '../../types/cv/cv';

interface WorkExperiencesState {
    workExperiences: WorkExperience[];
    loading: boolean;
    selectedWorkExperience?: WorkExperience | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: WorkExperiencesState = {
    workExperiences: [],
    loading: false,
    status: 'idle',
    error: null
}   

export const fetchWorkExperiences = createAsyncThunk<WorkExperience[]>(
    "workExperiences/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getWorkExperiences();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch work experiences');
        }
    }
)

export const fetchWorkExperience = createAsyncThunk<WorkExperience, number>(
    "workExperiences/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getWorkExperience(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch work experience');
        }
    }

)

export const addWorkExperience = createAsyncThunk<WorkExperience, any>(
    "workExperiences/add",
    async (data, { rejectWithValue }) => {
        try {
            const response =await createWorkExperience(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create work experience');
        }
    }
)

export const updateWorkExperienceById = createAsyncThunk<WorkExperience, {id:number, data:any}>(
    "workExperiences/updateById",
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await updateWorkExperience(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update work experience');
        }
    }
)

export const deleteWorkExperienceById = createAsyncThunk<number, number>(
    "workExperiences/deleteById",
    async (id, { rejectWithValue }) => {
        try {
            await deleteWorkExperience(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete work experience');
        }
    }
)

export const workExperiencesSlice = createSlice({
    name: 'workExperiences',
    initialState,
    reducers: {
        setSelectedExperiences(state, action) {
            state.selectedWorkExperience = action.payload;
        },
        clearSelected(state) {
            state.selectedWorkExperience = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkExperiences.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWorkExperiences.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.workExperiences = action.payload;
            })
            .addCase(fetchWorkExperiences.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchWorkExperience.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWorkExperience.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedWorkExperience = action.payload;
            })
            .addCase(fetchWorkExperience.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addWorkExperience.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addWorkExperience.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.workExperiences.push(action.payload);
            })
            .addCase(addWorkExperience.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateWorkExperienceById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateWorkExperienceById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.workExperiences.findIndex(we => we.id === action.payload.id);
                if (index !== -1) {
                    state.workExperiences[index] = action.payload;
                }
            })
            .addCase(updateWorkExperienceById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteWorkExperienceById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteWorkExperienceById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.workExperiences = state.workExperiences.filter(we => we.id !== action.payload);
            })
            .addCase(deleteWorkExperienceById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { setSelectedExperiences, clearSelected } = workExperiencesSlice.actions;
export default workExperiencesSlice.reducer;