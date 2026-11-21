import { api } from '@/lib/axios';
import { IzinCuti, CreateIzinCutiDto, IzinCutiQueryParams } from '@/types/izin-cuti';
import { ApiResponse } from '@/types/response'; // Jika ada, atau gunakan interface lokal di bawah

export const izinCutiService = {
  // 1. GET /api/izin-cuti (Ambil seluruh catatan ketidakhadiran)
  getAll: async (params?: IzinCutiQueryParams): Promise<ApiResponse<IzinCuti[]>> => {
    const response = await api.get('/izin-cuti', { params });
    return response.data;
  },

  // 2. GET /api/izin-cuti/:id (Detail catatan ketidakhadiran)
  getById: async (id: number): Promise<ApiResponse<IzinCuti>> => {
    const response = await api.get(`/izin-cuti/${id}`);
    return response.data;
  },

  // 3. POST /api/izin-cuti (Mencatat izin, sakit, atau cuti baru)
  create: async (payload: CreateIzinCutiDto): Promise<ApiResponse<IzinCuti>> => {
    const response = await api.post('/izin-cuti', payload);
    return response.data;
  },

  update: async (
    id: number,
    payload: CreateIzinCutiDto
  ): Promise<ApiResponse<IzinCuti>> => {
    const response = await api.put(`/izin-cuti/${id}`, payload);
    return response.data;
  },

  // 4. PATCH /api/izin-cuti/:id/batal (Membatalkan catatan ketidakhadiran)
  cancel: async (id: number): Promise<ApiResponse<{ id: number; status: string }>> => {
    const response = await api.patch(`/izin-cuti/${id}/batal`);
    return response.data;
  },

  extend: async (
    id: number,
    tanggal_selesai: string
  ): Promise<ApiResponse<{ id: number; tanggal_selesai: string; status: string }>> => {
    const response = await api.patch(`/izin-cuti/${id}/perpanjang`, { tanggal_selesai });
    return response.data;
  },

  complete: async (id: number): Promise<ApiResponse<{ id: number; status: string }>> => {
    const response = await api.patch(`/izin-cuti/${id}/selesai`);
    return response.data;
  },
};