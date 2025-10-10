import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import {
    getEducation,
    getEducations,
    createEducation,
    updateEducation,
    deleteEducation

} from '../../api/services/educationApi';
import { type Education } from '../../types/cv/cv';

interface EducationsState {
    educations: Education[];
    loading: boolean;
    selectedEducation?: Education | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: EducationsState = {
    educations: [],
    loading: false,
    status: 'idle',
    error: null
}
export const fetchEducations = createAsyncThunk<Education[]>(
    "educations/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getEducations();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch educations');
        }
    }
)

export const fetchEducation = createAsyncThunk<Education, number>(
    "educations/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getEducation(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch education');
        }
    }

)

export const addEducation = createAsyncThunk<Education, any>(
    "educations/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createEducation(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create education');
        }
    }
)

export const editEducation = createAsyncThunk<Education, { id: number; data: any }>(
    "educations/edit",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateEducation(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update education');
        }
    }
)

export const removeEducation = createAsyncThunk<number, number>(
    "educations/remove",
    async (id, { rejectWithValue }) => {
        try {
            await deleteEducation(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete education');
        }
    }
)

const educationsSlice = createSlice({
    name: 'educations',
    initialState,
    reducers: {
        setSelectedEducation(state, action) {
            state.selectedEducation = action.payload;
        },
        clearSelectedEducation(state) {
            state.selectedEducation = null;
        }
    },
    extraReducers: (builder) => {  
        builder
            .addCase(fetchEducations.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEducations.fulfilled, (state, action) => {
                state.loading = false;
                state.educations = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchEducations.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchEducation.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEducation.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEducation = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchEducation.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addEducation.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addEducation.fulfilled, (state, action) => {
                state.loading = false;
                state.educations.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(addEducation.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(editEducation.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(editEducation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.educations.findIndex(edu => edu.id === action.payload.id);
                if (index !== -1) {
                    state.educations[index] = action.payload;
                }
                state.status = 'succeeded';
            })
            .addCase(editEducation.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(removeEducation.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(removeEducation.fulfilled, (state, action) => {
                state.loading = false;
                state.educations = state.educations.filter(edu => edu.id !== action.payload);
                state.status = 'succeeded';
            })
            .addCase(removeEducation.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            });     
     }});


export const { setSelectedEducation, clearSelectedEducation } = educationsSlice.actions;
export default educationsSlice.reducer;