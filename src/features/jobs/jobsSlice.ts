import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Job } from '../../types/job';

import {
    getJob,
    getJobs,
    addJob,
    updateJob,
    deleteJob

} from '../../api/services/jobApi';

interface JobsState {
    jobs: Job[];
    loading: boolean;
    selectedJob?: Job | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: JobsState = {
    jobs: [],
    loading: false,
    status: 'idle',
    error: null
}

export const fetchJobs = createAsyncThunk<Job[]>(
    "jobs/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getJobs();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
        }
    }
)

export const fetchJob = createAsyncThunk<Job, number>(
    "jobs/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getJob(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
        }
    }

)

export const createJob = createAsyncThunk<Job, any>(
    "jobs/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await addJob(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create job');
        }
    }
)

export const updateJobById = createAsyncThunk<Job, { id: number; data: any }>(
    "jobs/updateById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateJob(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update job');
        }
    }
)

export const deleteJobById = createAsyncThunk<{ id: number }, number>(
    "jobs/deleteById",
    async (id, { rejectWithValue }) => {
        try {
            await deleteJob(id);
            return { id };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
        }
    }
)

export const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedJob = action.payload;
        },
        clearSelected(state) {
            state.selectedJob = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.jobs = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchJob.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchJob.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedJob = action.payload;
            })
            .addCase(fetchJob.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.jobs.push(action.payload);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateJobById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.jobs.findIndex(job => job.id === action.payload.id);
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
            })
            .addCase(updateJobById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteJobById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.jobs = state.jobs.filter(job => job.id !== action.payload.id);
            })
            .addCase(deleteJobById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { setSelected, clearSelected } = jobsSlice.actions;
export default jobsSlice.reducer;