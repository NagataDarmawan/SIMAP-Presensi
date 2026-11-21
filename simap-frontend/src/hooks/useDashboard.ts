'use client';

import { useState, useCallback, useEffect } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardStats } from '@/types/dashboard';

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
}

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getStats();
      setStats(res.data ?? null);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat statistik dashboard.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialStats = async () => {
      try {
        const res = await dashboardService.getStats();
        if (!active) return;
        setStats(res.data ?? null);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err, 'Gagal memuat statistik dashboard.'));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialStats();
    return () => {
      active = false;
    };
  }, []);

  return { loading, error, stats, refetch };
}