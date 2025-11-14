// store/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'professional';
}

const initialState: UIState = { theme: 'dark' };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'professional'>) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
