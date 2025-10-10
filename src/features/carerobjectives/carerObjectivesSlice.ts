import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import {

    getCareerObjective,
    getCareerObjectives,
    createCareerObjective,
    updateCareerObjective,
    deleteCareerObjective
} from '../../api/services/carerobjectiveApi';

import {  type CareerObjective } from '../../types/cv/cv';

interface CareerObjectivesState {
    CareerObjectives: CareerObjective[];
    loading: boolean;
    selectedCareerObjective?: CareerObjective | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CareerObjectivesState = {
    CareerObjectives: [],
    loading: false,
    status: 'idle',
    error: null
}
export const fetchCareerObjectives = createAsyncThunk<CareerObjective[]>(
    "CareerObjectives/fetchAll",
    async (_, {rejectWithValue}) => {
        try {
            const response = await getCareerObjectives();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch carer objectives');
        }
    }
)

export const fetchCareerObjective = createAsyncThunk<CareerObjective, number>(
    "CareerObjectives/fetchById",
    async (id, {rejectWithValue}) => {
        try {
            const response = await getCareerObjective(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch carer objective');
        }
    }

)

export const addCareerObjective = createAsyncThunk<CareerObjective, any>(
    "CareerObjectives/add",
    async (data, {rejectWithValue}) => {
        try {
            const response = await createCareerObjective(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create carer objective');
        }
    }
)


export const updateCareerObjectiveById = createAsyncThunk<CareerObjective, {id: number, data: any}>(
    "CareerObjectives/updateById",
    async ({id, data}, {rejectWithValue}) => {
        try {
            const response = await updateCareerObjective(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update carer objective');
        }
    }
)

export const deleteCareerObjectiveById = createAsyncThunk<number, number>(
    "CareerObjectives/deleteById",
    async (id, {rejectWithValue}) => {
        try {
            await deleteCareerObjective(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete carer objective');
        }
    }
)

export const CareerObjectivesSlice = createSlice({
    name: 'CareerObjectives',
    initialState,
    reducers: {
        selectedCareerObjective(state, action) {
            state.selectedCareerObjective = action.payload;
        },
        clearSelected(state) {
            state.selectedCareerObjective = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCareerObjectives.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;         
            })
            .addCase(fetchCareerObjectives.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.CareerObjectives = action.payload;
            })
            .addCase(fetchCareerObjectives.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCareerObjective.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;         
            }) 
            .addCase(fetchCareerObjective.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.selectedCareerObjective = action.payload;
            })
            .addCase(fetchCareerObjective.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addCareerObjective.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;         
            }) 
            .addCase(addCareerObjective.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.CareerObjectives.push(action.payload);
            })
            .addCase(addCareerObjective.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCareerObjectiveById.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;         
            }) 
            .addCase(updateCareerObjectiveById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const index = state.CareerObjectives.findIndex(co => co.id === action.payload.id);
                if (index !== -1) {
                    state.CareerObjectives[index] = action.payload;
                }
            })
            .addCase(updateCareerObjectiveById.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCareerObjectiveById.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;         
            }) 
            .addCase(deleteCareerObjectiveById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.CareerObjectives = state.CareerObjectives.filter(co => co.id !== action.payload);
            })
            .addCase(deleteCareerObjectiveById.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string; 
        
            })
        }})

export const { selectedCareerObjective, clearSelected } = CareerObjectivesSlice.actions;

export default CareerObjectivesSlice.reducer;