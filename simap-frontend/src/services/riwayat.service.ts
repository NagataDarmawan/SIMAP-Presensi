import {api} from '@/lib/axios';
import { ApiResponse } from '@/types/rekap';
import { RiwayatAbsensi, RiwayatFilter } from '@/types/riwayat';

export const riwayatService = {
  // GET /api/riwayat?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&status=...&search=...
  getRiwayat: async (filter: RiwayatFilter): Promise<ApiResponse<RiwayatAbsensi[]>> => {
    const response = await api.get('/riwayat', { params: filter });
    return response.data;
  },

  // GET /api/riwayat/:id
  getRiwayatById: async (id: number): Promise<ApiResponse<RiwayatAbsensi>> => {
    const response = await api.get(`/riwayat/${id}`);
    return response.data;
  },
};