import { api } from '@/lib/axios'; // Client Axios milikmu
import {
    ApiResponse,
    DashboardTodaySummary,
    RekapGlobalSummary,
    RekapPegawai,
    MonitoringKeterlambatan,
    DateRangeFilter,
    DetailKeterlambatan,
} from '@/types/rekap';

export const rekapService = {
    // GET /api/rekap/dashboard-today?tanggal=YYYY-MM-DD
    getDashboardToday: async (tanggal?: string): Promise<ApiResponse<DashboardTodaySummary>> => {
        const response = await api.get('/rekap/dashboard-today', {
            params: { tanggal },
        });
        return response.data;
    },

    // GET /api/rekap/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    getSummary: async (filter: DateRangeFilter): Promise<ApiResponse<RekapGlobalSummary>> => {
        const response = await api.get('/rekap/summary', { params: filter });
        return response.data;
    },

    // GET /api/rekap/pegawai?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    getPerPegawai: async (filter: DateRangeFilter): Promise<ApiResponse<RekapPegawai[]>> => {
        const response = await api.get('/rekap/pegawai', { params: filter });
        return response.data;
    },

    // GET /api/rekap/keterlambatan?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    getKeterlambatan: async (filter: DateRangeFilter): Promise<ApiResponse<MonitoringKeterlambatan[]>> => {
        const response = await api.get('/rekap/keterlambatan', { params: filter });
        return response.data;
    },

    getDetailKeterlambatan: async (
        pegawaiId: number,
        filter: DateRangeFilter
    ): Promise<ApiResponse<DetailKeterlambatan[]>> => {
        const response = await api.get(`/rekap/keterlambatan/${pegawaiId}`, { params: filter });
        return response.data;
    },
};