import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    getSkill,
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    updateSkillSetApi,
    createSkillSetApi
} from '../../api/services/skillsApi';

// NEW: skill-set API helpers

import { type Skill, type SkillSet } from '../../types/cv/cv';

interface SkillsState {
    skills: any[]; // kept loose for backward compatibility; may contain Skill or SkillSet objects
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
};

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
);

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
);

// existing single-skill CRUD thunks (unchanged)
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
);

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
);

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
);

// NEW: create entire SkillSet (one request)
export const createSkillSet = createAsyncThunk<any, { technicalSkills: { value: string }[]; softSkills: { value: string }[] }>(
    "skills/createSkillSet",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createSkillSetApi(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message || 'Failed to create skill set');
        }
    }
);

// NEW: update entire SkillSet by id (one request)
export const updateSkillSet = createAsyncThunk<any, { id: number; data: { technicalSkills: { value: string }[]; softSkills: { value: string }[] } }>(
    "skills/updateSkillSet",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateSkillSetApi(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message || 'Failed to update skill set');
        }
    }
);

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
            // fetchSkills
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

            // fetchSkill
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

            // addSkill (single-skill)
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

            // updateSkillById (single-skill)
            .addCase(updateSkillById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(updateSkillById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const index = state.skills.findIndex((skill: any) => skill.id === action.payload.id);
                if (index !== -1) {
                    state.skills[index] = action.payload;
                }
            })
            .addCase(updateSkillById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })

            // deleteSkillById
            .addCase(deleteSkillById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteSkillById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.skills = state.skills.filter((skill: any) => skill.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteSkillById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })

            // NEW: createSkillSet (skill-set)
            .addCase(createSkillSet.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(createSkillSet.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // push the returned skillset (backend returns skillset object)
                state.skills.push(action.payload);
                state.loading = false;
            })
            .addCase(createSkillSet.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as any) || 'Failed to create skill set';
                state.loading = false;
            })

            // NEW: updateSkillSet (skill-set)
            .addCase(updateSkillSet.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(updateSkillSet.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const index = state.skills.findIndex((s: any) => s.id === action.payload.id);
                if (index !== -1) {
                    state.skills[index] = action.payload;
                } else {
                    // if not present, push it
                    state.skills.push(action.payload);
                }
            })
            .addCase(updateSkillSet.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as any) || 'Failed to update skill set';
                state.loading = false;
            });
    }
});

export const { setSelected, clearSelected } = skillsSlice.actions;

export default skillsSlice.reducer;
