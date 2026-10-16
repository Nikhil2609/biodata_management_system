export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'superadmin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
