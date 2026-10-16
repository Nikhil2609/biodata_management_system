import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth.types';
import { authService } from '../../services/authService';

const initialToken = localStorage.getItem('biodata_token');
const initialUserJson = localStorage.getItem('biodata_user');
let parsedUser: User | null = null;

try {
  if (initialUserJson) {
    parsedUser = JSON.parse(initialUserJson);
  }
} catch (e) {
  parsedUser = null;
}

const initialState: AuthState = {
  user: parsedUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ identifier, password }: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(identifier, password);
      localStorage.setItem('biodata_token', data.token);
      localStorage.setItem('biodata_user', JSON.stringify(data.user));
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  }
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getMe();
    localStorage.setItem('biodata_user', JSON.stringify(user));
    return user;
  } catch (err: any) {
    localStorage.removeItem('biodata_token');
    localStorage.removeItem('biodata_user');
    return rejectWithValue('Session expired');
  }
});

export const logoutAdmin = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Check auth
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
