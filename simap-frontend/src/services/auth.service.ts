import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/response';
import { Admin, LoginPayload } from '@/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<Admin>> => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<Admin>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};