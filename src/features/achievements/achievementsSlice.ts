import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    getAchievement,
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement

} from '../../api/services/achievementsApi';
import { type Achievement } from '../../types/cv/cv';

interface AchievementsState {
    achievements: Achievement[];
    loading: boolean;
    selectedAchievement?: Achievement | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AchievementsState = {
    achievements: [],
    loading: false,
    status: 'idle',
    error: null
}



export const fetchAchievements = createAsyncThunk<Achievement[]>(
    "achievements/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAchievements();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements');
        }
    }
)

export const fetchAchievement = createAsyncThunk<Achievement, number>(
    "achievements/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getAchievement(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievement');
        }
    }

)
export const addAchievement = createAsyncThunk<Achievement, any>(
    "achievements/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createAchievement(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add achievement');
        }
    }
)
export const editAchievement = createAsyncThunk<Achievement, { id: number, data: any }>(
    "achievements/edit",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateAchievement(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to edit achievement');
        }
    }
)

export const deleteAchievementById = createAsyncThunk<Achievement, number>(
    "achievements/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteAchievement(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete achievement');
        }
    }
)


const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedAchievement = action.payload;
        },
        clearSelected(state) {
            state.selectedAchievement = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAchievements.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAchievements.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.achievements = action.payload;
            })
            .addCase(fetchAchievements.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAchievement.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAchievement.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedAchievement = action.payload;
            })
            .addCase(fetchAchievement.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addAchievement.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addAchievement.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.achievements.push(action.payload);
            })
            .addCase(addAchievement.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(editAchievement.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(editAchievement.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.achievements.findIndex(ach => ach.id === action.payload.id);
                if (index !== -1) {
                    state.achievements[index] = action.payload;
                }
            })
            .addCase(editAchievement.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteAchievementById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteAchievementById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.achievements = state.achievements.filter(ach => ach.id !== action.payload.id);
            })
            .addCase(deleteAchievementById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { setSelected, clearSelected } = achievementsSlice.actions;

export default achievementsSlice.reducer;