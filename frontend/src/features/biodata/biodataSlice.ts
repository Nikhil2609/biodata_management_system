import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Biodata, BiodataFilterQuery, PaginationMeta } from '../../types/biodata.types';
import { biodataService } from '../../services/biodataService';

interface BiodataState {
  // Public
  publicList: Biodata[];
  publicPagination: PaginationMeta;
  publicFilters: BiodataFilterQuery;
  currentBiodata: Biodata | null;
  relatedBiodata: Biodata[];

  // Admin
  adminList: Biodata[];
  adminPagination: PaginationMeta;
  adminFilters: BiodataFilterQuery;
  dashboardStats: any | null;

  // Global loading / error
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialPagination: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
};

const initialState: BiodataState = {
  publicList: [],
  publicPagination: initialPagination,
  publicFilters: {
    gender: '',
    talukaId: '',
    gamId: '',
    search: '',
    minAge: '',
    maxAge: '',
    page: 1,
    limit: 12,
    sort: 'newest',
  },
  currentBiodata: null,
  relatedBiodata: [],

  adminList: [],
  adminPagination: { ...initialPagination, limit: 15 },
  adminFilters: {
    status: '',
    gender: '',
    talukaId: '',
    gamId: '',
    search: '',
    page: 1,
    limit: 15,
  },
  dashboardStats: null,

  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

// Async Thunks
export const fetchPublicBiodata = createAsyncThunk(
  'biodata/fetchPublicList',
  async (filters: BiodataFilterQuery, { rejectWithValue }) => {
    try {
      return await biodataService.getPublicList(filters);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch biodata records');
    }
  }
);

export const fetchPublicBiodataDetail = createAsyncThunk(
  'biodata/fetchPublicDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      return await biodataService.getPublicDetail(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Biodata not found or is private');
    }
  }
);

export const fetchAdminBiodata = createAsyncThunk(
  'biodata/fetchAdminList',
  async (filters: BiodataFilterQuery, { rejectWithValue }) => {
    try {
      return await biodataService.getAdminList(filters);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin biodata list');
    }
  }
);

export const fetchAdminBiodataDetail = createAsyncThunk(
  'biodata/fetchAdminDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      return await biodataService.getAdminDetail(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Biodata not found');
    }
  }
);

export const toggleBiodataStatus = createAsyncThunk(
  'biodata/toggleStatus',
  async ({ id, status }: { id: number; status?: 'enabled' | 'disabled' }, { rejectWithValue }) => {
    try {
      return await biodataService.toggleStatus(id, status);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

export const deleteBiodataRecord = createAsyncThunk(
  'biodata/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await biodataService.deleteBiodata(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete record');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'biodata/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await biodataService.getDashboardStats();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard metrics');
    }
  }
);

const biodataSlice = createSlice({
  name: 'biodata',
  initialState,
  reducers: {
    setPublicFilters: (state, action: PayloadAction<Partial<BiodataFilterQuery>>) => {
      state.publicFilters = { ...state.publicFilters, ...action.payload };
    },
    resetPublicFilters: (state) => {
      state.publicFilters = {
        gender: '',
        talukaId: '',
        gamId: '',
        search: '',
        minAge: '',
        maxAge: '',
        page: 1,
        limit: 12,
        sort: 'newest',
      };
    },
    setAdminFilters: (state, action: PayloadAction<Partial<BiodataFilterQuery>>) => {
      state.adminFilters = { ...state.adminFilters, ...action.payload };
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Public List
      .addCase(fetchPublicBiodata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicBiodata.fulfilled, (state, action) => {
        state.loading = false;
        state.publicList = action.payload.records;
        state.publicPagination = action.payload.pagination;
      })
      .addCase(fetchPublicBiodata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Public Detail
      .addCase(fetchPublicBiodataDetail.pending, (state) => {
        state.loading = true;
        state.currentBiodata = null;
        state.relatedBiodata = [];
      })
      .addCase(fetchPublicBiodataDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBiodata = action.payload.biodata;
        state.relatedBiodata = action.payload.related;
      })
      .addCase(fetchPublicBiodataDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Admin List
      .addCase(fetchAdminBiodata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBiodata.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload.records;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(fetchAdminBiodata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Admin Detail
      .addCase(fetchAdminBiodataDetail.pending, (state) => {
        state.loading = true;
        state.currentBiodata = null;
      })
      .addCase(fetchAdminBiodataDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBiodata = action.payload;
      })
      .addCase(fetchAdminBiodataDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle status
      .addCase(toggleBiodataStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.adminList.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          state.adminList[index].status = updated.status;
        }
        if (state.currentBiodata?.id === updated.id) {
          state.currentBiodata.status = updated.status;
        }
        state.successMessage = `Biodata status updated to ${updated.status}.`;
      })
      // Delete
      .addCase(deleteBiodataRecord.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((b) => b.id !== action.payload);
        state.successMessage = 'Biodata removed successfully.';
      })
      // Dashboard Stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export const { setPublicFilters, resetPublicFilters, setAdminFilters, clearMessages } = biodataSlice.actions;
export default biodataSlice.reducer;
