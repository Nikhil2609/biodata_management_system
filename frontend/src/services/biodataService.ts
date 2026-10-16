import { api } from './api';
import { Biodata, BiodataFilterQuery, PaginationMeta, BiodataPhoto } from '../types/biodata.types';

export const biodataService = {
  // Public
  async getPublicList(filters: BiodataFilterQuery): Promise<{ records: Biodata[]; pagination: PaginationMeta }> {
    const res = await api.get('/biodata', { params: filters });
    return {
      records: res.data.data,
      pagination: res.data.pagination,
    };
  },

  async getPublicDetail(id: number): Promise<{ biodata: Biodata; related: Biodata[] }> {
    const res = await api.get(`/biodata/${id}`);
    return {
      biodata: res.data.data,
      related: res.data.related || [],
    };
  },

  // Admin
  async getAdminList(filters: BiodataFilterQuery): Promise<{ records: Biodata[]; pagination: PaginationMeta }> {
    const res = await api.get('/admin/biodata', { params: filters });
    return {
      records: res.data.data,
      pagination: res.data.pagination,
    };
  },

  async getAdminDetail(id: number): Promise<Biodata> {
    const res = await api.get(`/admin/biodata/${id}`);
    return res.data.data;
  },

  async createBiodata(data: Partial<Biodata>): Promise<Biodata> {
    const res = await api.post('/admin/biodata', data);
    return res.data.data;
  },

  async updateBiodata(id: number, data: Partial<Biodata>): Promise<Biodata> {
    const res = await api.put(`/admin/biodata/${id}`, data);
    return res.data.data;
  },

  async toggleStatus(id: number, status?: 'enabled' | 'disabled'): Promise<Biodata> {
    const res = await api.patch(`/admin/biodata/${id}/status`, { status });
    return res.data.data;
  },

  async deleteBiodata(id: number): Promise<void> {
    await api.delete(`/admin/biodata/${id}`);
  },

  async uploadPhotos(id: number, formData: FormData): Promise<BiodataPhoto[]> {
    const res = await api.post(`/admin/biodata/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async setPrimaryPhoto(biodataId: number, photoId: number): Promise<BiodataPhoto> {
    const res = await api.patch(`/admin/biodata/${biodataId}/photos/${photoId}/primary`);
    return res.data.data;
  },

  async deletePhoto(biodataId: number, photoId: number): Promise<void> {
    await api.delete(`/admin/biodata/${biodataId}/photos/${photoId}`);
  },

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    const res = await api.get('/admin/dashboard/stats');
    return res.data.data;
  },
};
