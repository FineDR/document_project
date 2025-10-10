import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    login,
    register,
    logout,
    getProfile,
    signUpOrSignInWithGoogle,
    updateProfile
} from '../../api/services/authApi';

import { type User } from '../../types/cv/cv';
interface AuthState {
    user: User | null;
    access: string | null;
    refresh: string | null;
    loading: boolean;
    selectedUser?: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    access: null,
    refresh: null,
    loading: false,
    status: 'idle',
    error: null,
    selectedUser: null
};

interface LoginResponse {
    user: User;
    access: string;
    refresh: string;
}




export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string }>(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            const data = response.data;

            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            return data; // data has { user, access, refresh }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to login');
        }
    }
)

export const googleAuthUser = createAsyncThunk<
    User,                    // return type
    { token: string },       // argument type
    { rejectValue: string }  // reject type
>("auth/googleAuth", async ({ token }, { rejectWithValue }) => {
    try {
        const response = await signUpOrSignInWithGoogle({ token });
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        return response.data.user;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Google Auth failed");
    }
});



export const registerUser = createAsyncThunk<User, { name: string; email: string; password: string }>(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await register(userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to register');
        }
    }
)

export const fetchUserProfile = createAsyncThunk<User>(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProfile();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
)

export const updateUserProfile = createAsyncThunk<User, any>(
    "auth/updateProfile",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await updateProfile(userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
)
export const logoutUser = createAsyncThunk<void>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await logout();
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || "Logout failed");
        }
    }
);


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearSelected(state) {
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.user = action.payload.user; // your backend should return { user, access, refresh }
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;

                // Optionally persist in localStorage
                localStorage.setItem('token', state.access!);
                localStorage.setItem('refreshToken', state.refresh!);
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
                state.error = null;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            })
            .addCase(googleAuthUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';

            })
            .addCase(googleAuthUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status="succeeded";
            })
            .addCase(googleAuthUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.status="failed";
            });

        ;
    }
})

export const { clearSelected } = authSlice.actions;

export default authSlice.reducer;