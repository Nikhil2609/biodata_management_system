import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Taluka, Gam } from '../../types/master.types';
import { masterService } from '../../services/masterService';

interface GamState {
  talukas: Taluka[];
  gams: Gam[]; // Gams filtered by currently selected taluka
  selectedTalukaId: number | null;
  loadingTalukas: boolean;
  loadingGams: boolean;
  error: string | null;
}

const initialState: GamState = {
  talukas: [],
  gams: [],
  selectedTalukaId: null,
  loadingTalukas: false,
  loadingGams: false,
  error: null,
};

export const fetchTalukas = createAsyncThunk('master/fetchTalukas', async (_, { rejectWithValue }) => {
  try {
    return await masterService.getTalukas();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load Talukas');
  }
});

export const fetchGamsByTaluka = createAsyncThunk(
  'master/fetchGamsByTaluka',
  async ({ talukaId, search }: { talukaId?: number; search?: string }, { rejectWithValue }) => {
    try {
      return await masterService.getGams(talukaId, search);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load Gams');
    }
  }
);

const gamSlice = createSlice({
  name: 'gams',
  initialState,
  reducers: {
    setSelectedTalukaId: (state, action: PayloadAction<number | null>) => {
      state.selectedTalukaId = action.payload;
      if (!action.payload) {
        state.gams = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTalukas.pending, (state) => {
        state.loadingTalukas = true;
      })
      .addCase(fetchTalukas.fulfilled, (state, action) => {
        state.loadingTalukas = false;
        state.talukas = action.payload;
      })
      .addCase(fetchTalukas.rejected, (state, action) => {
        state.loadingTalukas = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGamsByTaluka.pending, (state) => {
        state.loadingGams = true;
      })
      .addCase(fetchGamsByTaluka.fulfilled, (state, action) => {
        state.loadingGams = false;
        state.gams = action.payload;
      })
      .addCase(fetchGamsByTaluka.rejected, (state, action) => {
        state.loadingGams = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTalukaId } = gamSlice.actions;
export default gamSlice.reducer;
