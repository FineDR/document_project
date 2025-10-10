import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    getLetter,
    getLetters,
    createLetter,
    updateLetter,
    deleteLetter

} from '../../api/services/letterApi';
import { type Letter } from '../../types/cv/types';

interface LettersState {
    letters: Letter[];
    loading: boolean;
    selectedLetter?: Letter | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LettersState = {
    letters: [],
    loading: false,
    status: 'idle',
    error: null
}
export const fetchLetters = createAsyncThunk<Letter[]>(
    "letters/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getLetters();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch letters');
        }
    });

export const fetchLetter = createAsyncThunk<Letter, number>(
    "letters/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getLetter(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch letter');
        }
    }

);
export const addLetter = createAsyncThunk<Letter, any>(
    "letters/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createLetter(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create letter');
        }
    }
);

export const updateLetterById = createAsyncThunk<Letter, { id: number; data: any }>(
    "letters/updateById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateLetter(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update letter');
        }
    }
);

export const deleteLetterById = createAsyncThunk<number, number>(
    "letters/deleteById",
    async (id, { rejectWithValue }) => {
        try {
            await deleteLetter(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete letter');
        }
    }
);

export const lettersSlice = createSlice({
    name: 'letters',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedLetter = action.payload;
        },
        clearSelected(state) {
            state.selectedLetter = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLetters.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLetters.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.letters = action.payload;
            })
            .addCase(fetchLetters.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchLetter.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLetter.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedLetter = action.payload;
            })
            .addCase(fetchLetter.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addLetter.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addLetter.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.letters.push(action.payload);
            })
            .addCase(addLetter.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateLetterById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null; 
            })
            .addCase(updateLetterById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.letters.findIndex(letter => letter.id === action.payload.id);
                if (index !== -1) {
                    state.letters[index] = action.payload;
                }
            })
            .addCase(updateLetterById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteLetterById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteLetterById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.letters = state.letters.filter(letter => letter.id !== action.payload);
            })
            .addCase(deleteLetterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addDefaultCase((state) => {
                state.status = 'idle';
            });
    }
});

export const { setSelected, clearSelected } = lettersSlice.actions;

export default lettersSlice.reducer;