import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCertificate,
    getCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate
} from '../../api/services/certificateApi';
import { type Certificate } from '../../types/cv/cv';

interface CertificatesState {
    certificates: Certificate[];
    loading: boolean;
    selectedCertificate?: Certificate | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CertificatesState = {
    certificates: [],
    loading: false,
    status: 'idle',
    error: null
};

export const fetchCertificates = createAsyncThunk<Certificate[]>(
    "certificates/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCertificates();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
        }
    }
);

export const fetchCertificate = createAsyncThunk<Certificate, number>(
    "certificates/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getCertificate(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificate');
        }
    }
);

export const addCertificate = createAsyncThunk<Certificate, any>(
    "certificates/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createCertificate(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create certificate');
        }
    }
);

export const updateCertificat = createAsyncThunk<Certificate, { id: number; data: any }>(
    "certificates/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateCertificate(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update certificate');
        }
    }
);

export const deleteCertificat = createAsyncThunk<number, number>(
    "certificates/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCertificate(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete certificate');
        }
    }
);

export const certificatesSlice = createSlice({
    name: 'certificates',
    initialState,
    reducers: {
        setSelected(state, action) {
            state.selectedCertificate = action.payload;
        },
        clearSelected(state) {
            state.selectedCertificate = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchCertificates.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCertificates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.certificates = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchCertificates.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })

            // FETCH SINGLE
            .addCase(fetchCertificate.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCertificate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.selectedCertificate = action.payload;
            })
            .addCase(fetchCertificate.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })

            // ADD
            .addCase(addCertificate.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(addCertificate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                if (!Array.isArray(state.certificates)) state.certificates = [];
                state.certificates.push(action.payload);
            })
            .addCase(addCertificate.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })

            // UPDATE
            .addCase(updateCertificat.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCertificat.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                if (!Array.isArray(state.certificates)) state.certificates = [];
                const index = state.certificates.findIndex(cert => cert.id === action.payload.id);
                if (index !== -1) {
                    state.certificates[index] = action.payload;
                } else {
                    state.certificates.push(action.payload); // optional fallback
                }
            })
            .addCase(updateCertificat.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })

            // DELETE
            .addCase(deleteCertificat.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCertificat.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                if (!Array.isArray(state.certificates)) state.certificates = [];
                state.certificates = state.certificates.filter(cert => cert.id !== action.payload);
            })
            .addCase(deleteCertificat.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setSelected, clearSelected } = certificatesSlice.actions;
export default certificatesSlice.reducer;
