import { api } from './api';
import { User } from '../types/auth.types';

export const authService = {
  async login(identifier: string, password: string): Promise<{ token: string; user: User }> {
    const res = await api.post('/auth/login', { identifier, password });
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('biodata_token');
      localStorage.removeItem('biodata_user');
    }
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
