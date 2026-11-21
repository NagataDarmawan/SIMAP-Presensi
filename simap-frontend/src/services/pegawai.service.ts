import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/response';
import { Pegawai, CreatePegawaiDto, UpdatePegawaiDto } from '@/types/pegawai';

export const pegawaiService = {
  // GET /pegawai (Menampilkan semua pegawai)
  getAll: async (): Promise<ApiResponse<Pegawai[]>> => {
    const response = await api.get('/pegawai');
    return response.data;
  },

  // GET /pegawai/:id (Detail pegawai)
  getById: async (id: number): Promise<ApiResponse<Pegawai>> => {
    const response = await api.get(`/pegawai/${id}`);
    return response.data;
  },

  // POST /pegawai (Menambahkan pegawai)
  create: async (payload: CreatePegawaiDto): Promise<ApiResponse<Pegawai>> => {
    const response = await api.post('/pegawai', payload);
    return response.data;
  },

  // PUT /pegawai/:id (Mengubah pegawai)
  update: async (id: number, payload: UpdatePegawaiDto): Promise<ApiResponse<Pegawai>> => {
    const response = await api.put(`/pegawai/${id}`, payload);
    return response.data;
  },

  // PATCH /pegawai/:id/status (Mengubah status pegawai)
  updateStatus: async (id: number, status: 'AKTIF' | 'NONAKTIF'): Promise<ApiResponse<Pegawai>> => {
    const response = await api.patch(`/pegawai/${id}/status`, { status });
    return response.data;
  },

  // DELETE /pegawai/:id (Menghapus pegawai secara permanen)
  delete: async (id: number): Promise<ApiResponse<{ id: number; nama: string }>> => {
    const response = await api.delete(`/pegawai/${id}`);
    return response.data;
  },
};