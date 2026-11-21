'use client';

import { useState, useCallback } from 'react';
import { RiwayatAbsensi, RiwayatFilter } from '@/types/riwayat';

export interface KoreksiAbsensiPayload {
  status: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getDefaultFilter(): RiwayatFilter {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
  return {
    startDate: `${today.slice(0, 8)}01`,
    endDate: today,
    status: '',
    search: '',
  };
}

export function useRiwayat() {
  const [filter, setFilter] = useState<RiwayatFilter>(getDefaultFilter);
  const [riwayatData, setRiwayatData] = useState<RiwayatAbsensi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRiwayat = useCallback(async (activeFilter: RiwayatFilter) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (activeFilter.startDate) params.append('startDate', activeFilter.startDate);
      if (activeFilter.endDate) params.append('endDate', activeFilter.endDate);
      if (activeFilter.status) params.append('status', activeFilter.status);
      if (activeFilter.search) params.append('search', activeFilter.search);

      const response = await fetch(`${API_BASE_URL}/riwayat?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Gagal memuat data riwayat absensi.');
      }

      setRiwayatData(resData.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil riwayat absensi.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilter: Partial<RiwayatFilter>) => {
      const updated = { ...filter, ...newFilter };
      setFilter(updated);
      void fetchRiwayat(updated);
    },
    [filter, fetchRiwayat]
  );

  const updateKoreksiAbsensi = useCallback(
    async (absensiId: number, payload: KoreksiAbsensiPayload) => {
      const response = await fetch(`${API_BASE_URL}/absensi/${absensiId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Gagal menyimpan koreksi absensi.');
      }

      return resData;
    },
    []
  );

  return {
    filter,
    loading,
    error,
    riwayatData,
    fetchRiwayat,
    handleFilterChange,
    updateKoreksiAbsensi,
  };
}