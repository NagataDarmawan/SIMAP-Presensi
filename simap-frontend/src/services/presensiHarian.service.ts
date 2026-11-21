import {api} from '@/lib/axios';
import {
  PresensiHarianResponse,
  CreateManualPresensiPayload,
  KoreksiPresensiHarianPayload,
} from '@/types/presensiHarian';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const presensiHarianService = {
  async getHarian(tanggal?: string, search?: string): Promise<PresensiHarianResponse> {
    const res = await api.get<ApiResponse<PresensiHarianResponse>>('/absensi/harian', {
      params: {
        tanggal: tanggal || undefined,
        search: search || undefined,
      },
    });
    return res.data.data;
  },

  async createManual(payload: CreateManualPresensiPayload): Promise<ApiResponse<unknown>> {
    const res = await api.post<ApiResponse<unknown>>('/absensi/manual', payload);
    return res.data;
  },

  async correct(
    absensiId: number,
    payload: KoreksiPresensiHarianPayload
  ): Promise<ApiResponse<unknown>> {
    const res = await api.put<ApiResponse<unknown>>(`/absensi/${absensiId}`, payload);
    return res.data;
  },

  async autoAlpha(
    tanggal: string,
    force = false
  ): Promise<ApiResponse<{ tanggal: string; total_ditandai_alpha: number }>> {
    const res = await api.post<
      ApiResponse<{ tanggal: string; total_ditandai_alpha: number }>
    >('/absensi/auto-alpha', { tanggal, force });
    return res.data;
  },
};