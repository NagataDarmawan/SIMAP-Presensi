import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/response';
import { Absensi } from '@/types/absensi';

export interface ScanAbsensiPayload {
  kode_qr: string;
  jenis: 'MASUK' | 'PULANG';
}

export type AbsensiQueryParams = Record<string, string | number | boolean | undefined>;

export const absensiService = {
  // POST /api/absensi/scan
  scan: async (payload: ScanAbsensiPayload): Promise<ApiResponse<Absensi>> => {
    const response = await api.post('/absensi/scan', {
      kode_qr: payload.kode_qr.trim(),
      jenis: payload.jenis,
    });
    return response.data;
  },

  // GET /api/absensi
  getAll: async (params?: AbsensiQueryParams): Promise<ApiResponse<Absensi[]>> => {
    const response = await api.get('/absensi', { params });
    return response.data;
  },

  // GET /api/absensi/:id
  getById: async (id: number): Promise<ApiResponse<Absensi>> => {
    const response = await api.get(`/absensi/${id}`);
    return response.data;
  },

  // PUT /api/absensi/:id (Koreksi Absensi)
  update: async (id: number, payload: Partial<Absensi>): Promise<ApiResponse<Absensi>> => {
    const response = await api.put(`/absensi/${id}`, payload);
    return response.data;
  },
};