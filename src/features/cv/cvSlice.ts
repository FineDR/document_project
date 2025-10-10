import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import {users,userDetails} from "../../api/services/authApi";
import { type User } from "../../types/cv/cv";

export interface Cv{
    cv: User | null;
    loading: boolean;
    error: string | null;
    selectedCvId: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';

}
const initialState: Cv = {
    cv: null,
    loading: false,
    error: null,
    selectedCvId: null,
    status: 'idle',
};

export const fetchCv = createAsyncThunk<User>(
    'cv/fetchCv',
    async (___reactRouterServerStorage___, { rejectWithValue }) => {
        try {
            const response = users();
            console.log("Fetched CV data:", response);
            return (await response).data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllUsers = createAsyncThunk<User[]>(
    'cv/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = userDetails();
            return (await response).data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const cvSlice = createSlice({
    name: 'cv',
    initialState,
    reducers: {
        setSelectedCvId(state, action) {
            state.selectedCvId = action.payload;
        },
        clearCv(state) {
            state.cv = null;
            state.error = null;
            state.loading = false;
            state.status = 'idle';
            state.selectedCvId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCv.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchCv.fulfilled, (state, action) => {
                state.loading = false;
                state.cv = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCv.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.cv = action.payload[0]; // Just an example, you might want to handle this differently
                state.status = 'succeeded';
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            });
        }
    });  


export const { setSelectedCvId, clearCv } = cvSlice.actions;

export default cvSlice.reducer;