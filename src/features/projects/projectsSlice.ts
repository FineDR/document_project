import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { type Project } from '../../types/cv/cv';

import {
    getProject,
    getProjects,
    createProject,
    updateProject,
    deleteProject

} from '../../api/services/projectsApi';

interface ProjectsState {
    projects: Project[];
    loading: boolean;
    selectedProject?: Project | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProjectsState = {
    projects: [],
    loading: false,
    status: 'idle',
    error: null
}

export const fetchProjects = createAsyncThunk<Project[]>(
    "projects/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProjects();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
)

export const fetchProject = createAsyncThunk<Project, number>(
    "projects/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getProject(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
        }
    }

)

export const addProject = createAsyncThunk<Project, any>(
    "projects/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createProject(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
)

export const updateProjectById = createAsyncThunk<Project, { id: number; data: any }>(
    "projects/updateById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateProject(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update project');
        }
    }
)

export const deleteProjectById = createAsyncThunk<number, number>(
    "projects/deleteById",
    async (id, { rejectWithValue }) => {
        try {
            await deleteProject(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
        }
    }
)

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedProject = action.payload;
        },
        clearSelected(state) {
            state.selectedProject = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(fetchProject.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedProject = action.payload;
                state.loading = false;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(addProject.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(addProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects.push(action.payload);
                state.loading = false;
            })
            .addCase(addProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(updateProjectById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(updateProjectById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const index = state.projects.findIndex(project => project.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            .addCase(updateProjectById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(deleteProjectById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteProjectById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.projects = state.projects.filter(project => project.id !== action.payload);
            })
            .addCase(deleteProjectById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
    }
})

export const { setSelected, clearSelected } = projectsSlice.actions;

export default projectsSlice.reducer;
