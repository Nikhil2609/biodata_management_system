import { api } from './api';
import { Taluka, Gam } from '../types/master.types';

export const masterService = {
  async getTalukas(): Promise<Taluka[]> {
    const res = await api.get('/talukas');
    return res.data.data;
  },

  async getGams(talukaId?: number, search?: string): Promise<Gam[]> {
    const params: any = {};
    if (talukaId) params.talukaId = talukaId;
    if (search) params.search = search;
    const res = await api.get('/gams', { params });
    return res.data.data;
  },

  async createGam(data: { talukaId: number; nameGu: string; nameEn: string; orderNo?: number }): Promise<Gam> {
    const res = await api.post('/admin/gams', data);
    return res.data.data;
  },
};
