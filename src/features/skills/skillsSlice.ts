import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {
    getSkill,
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill

} from '../../api/services/skillsApi';
import { type Skill } from '../../types/cv/cv';

interface SkillsState {
    skills: Skill[];
    loading: boolean;
    selectedSkill?: Skill | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SkillsState = {
    skills: [],
    loading: false,
    status: 'idle',
    error: null
}   
export const fetchSkills = createAsyncThunk<Skill[]>(
    "skills/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSkills();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
        }
    }
)

export const fetchSkill = createAsyncThunk<Skill, number>(
    "skills/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getSkill(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch skill');
        }
    }

)
export const addSkill = createAsyncThunk<Skill, any>(
    "skills/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createSkill(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create skill');
        }
    }
)

export const updateSkillById = createAsyncThunk<Skill, { id: number; data: Partial<Skill> }>(
    "skills/updateById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateSkill(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update skill');
        }
    }
)

export const deleteSkillById = createAsyncThunk<number, number>(
    "skills/deleteById",
    async (id, { rejectWithValue }) => {
        try {
            await deleteSkill(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete skill');
        }
    }
)

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedSkill = action.payload;
        },
        clearSelected(state) {
            state.selectedSkill = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSkills.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.skills = action.payload;
                state.loading = false;
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(fetchSkill.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchSkill.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedSkill = action.payload;
                state.loading = false;
            })
            .addCase(fetchSkill.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(addSkill.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(addSkill.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.skills.push(action.payload);
                state.loading = false;
            })
            .addCase(addSkill.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(updateSkillById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(updateSkillById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const index = state.skills.findIndex(skill => skill.id === action.payload.id);
                if (index !== -1) {
                    state.skills[index] = action.payload;
                }
            })
            .addCase(updateSkillById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(deleteSkillById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteSkillById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.skills = state.skills.filter(skill => skill.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteSkillById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
    }
})

export const { setSelected, clearSelected } = skillsSlice.actions;

export default skillsSlice.reducer;