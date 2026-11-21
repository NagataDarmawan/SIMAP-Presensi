import {api} from '@/lib/axios';
import { ApiResponse } from '@/types/rekap';
import { DashboardStats } from '@/types/dashboard';

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};