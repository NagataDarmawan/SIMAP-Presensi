import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/response';
import { JadwalKerja, CreateJadwalDto, UpdateJadwalDto } from '@/types/jadwal';

export const jadwalService = {
  // GET /jadwal
  getAll: async (): Promise<ApiResponse<JadwalKerja[]>> => {
    const response = await api.get('/jadwal');
    return response.data;
  },

  // GET /jadwal/:id
  getById: async (id: number): Promise<ApiResponse<JadwalKerja>> => {
    const response = await api.get(`/jadwal/${id}`);
    return response.data;
  },

  // POST /jadwal
  create: async (payload: CreateJadwalDto): Promise<ApiResponse<JadwalKerja>> => {
    const response = await api.post('/jadwal', payload);
    return response.data;
  },

  // PUT /jadwal/:id
  update: async (id: number, payload: UpdateJadwalDto): Promise<ApiResponse<JadwalKerja>> => {
    const response = await api.put(`/jadwal/${id}`, payload);
    return response.data;
  },

  // DELETE /jadwal/:id (Hanya untuk jadwal yang belum digunakan)
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/jadwal/${id}`);
    return response.data;
  },
};