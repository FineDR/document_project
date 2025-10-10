import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { type Language } from '../../types/cv/cv';

import {
    getLanguage,
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage

} from '../../api/services/languageApi';

interface LanguagesState {
    languages: Language[];
    loading: boolean;
    selectedLanguage?: Language | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LanguagesState = {
    languages: [],
    loading: false,
    status: 'idle',
    error: null
}

export const fetchLanguages = createAsyncThunk<Language[]>(
    "languages/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getLanguages();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch languages');
        }
    }
)   

export const fetchLanguage = createAsyncThunk<Language, number>(
    "languages/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getLanguage(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch language');
        }
    }

)

export const addLanguage = createAsyncThunk<Language, any>(
    "languages/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createLanguage(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create language');
        }
    }
)

export const updateLanguageById = createAsyncThunk<Language, {id: number, data: any}>(
    "languages/updateById",
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await updateLanguage(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update language');
        }
    }
)

export const deleteLanguageById = createAsyncThunk<{id: number}, number>(
    "languages/deleteById",
    async (id, { rejectWithValue }) => {
        try {
            await deleteLanguage(id);
            return {id};
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete language');
        }
    }
)

export const languagesSlice = createSlice({
    name: 'languages',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedLanguage = action.payload;
        },
        clearSelected(state) {
            state.selectedLanguage = null;
        }
    },
    extraReducers(builder) {
        builder 
            .addCase(fetchLanguages.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLanguages.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.languages = action.payload;
            })
            .addCase(fetchLanguages.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchLanguage.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLanguage.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.selectedLanguage = action.payload;
            })
            .addCase(fetchLanguage.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addLanguage.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addLanguage.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.languages.push(action.payload);
            })
            .addCase(addLanguage.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateLanguageById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateLanguageById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.languages.findIndex(lang => lang.id === action.payload.id);
                if (index !== -1) {
                    state.languages[index] = action.payload;
                }
            })
            .addCase(updateLanguageById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteLanguageById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteLanguageById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.languages = state.languages.filter(lang => lang.id !== action.payload.id);
            })
            .addCase(deleteLanguageById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
})

export const { setSelected, clearSelected } = languagesSlice.actions;

export default languagesSlice.reducer;