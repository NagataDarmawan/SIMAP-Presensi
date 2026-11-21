import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/response';
import { QRCodeData } from '@/types/qr';

export const qrService = {
  // GET /qr
  getAll: async (): Promise<ApiResponse<QRCodeData[]>> => {
    const response = await api.get('/qr');
    return response.data;
  },

  // POST /qr/:pegawaiId/generate
  generate: async (pegawaiId: number): Promise<ApiResponse<QRCodeData>> => {
    const response = await api.post(`/qr/${Number(pegawaiId)}/generate`, {});
    return response.data;
  },

  // POST /qr/:pegawaiId/regenerate
  regenerate: async (pegawaiId: number): Promise<ApiResponse<QRCodeData>> => {
    const response = await api.post(`/qr/${Number(pegawaiId)}/regenerate`, {});
    return response.data;
  },
};