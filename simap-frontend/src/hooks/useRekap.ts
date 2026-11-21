'use client';

import { useState, useMemo, useCallback } from 'react';
import { rekapService } from '@/services/rekap.service';
import {
  DashboardTodaySummary,
  RekapGlobalSummary,
  RekapPegawai,
  MonitoringKeterlambatan,
  DateRangeFilter,
} from '@/types/rekap';

function getDefaultDateRange(): DateRangeFilter {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  return {
    startDate: `${year}-${month}-01`,
    endDate: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
  };
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
}

export function useRekap() {
  const [filter, setFilter] = useState<DateRangeFilter>(getDefaultDateRange);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dashboardToday, setDashboardToday] = useState<DashboardTodaySummary | null>(null);
  const [globalSummary, setGlobalSummary] = useState<RekapGlobalSummary | null>(null);
  const [rekapPegawai, setRekapPegawai] = useState<RekapPegawai[]>([]);
  const [keterlambatan, setKeterlambatan] = useState<MonitoringKeterlambatan[]>([]);

  const filteredRekapPegawai = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return rekapPegawai;
    return rekapPegawai.filter(
      (item) =>
        item.nama.toLowerCase().includes(q) ||
        item.kode_pegawai.toLowerCase().includes(q) ||
        (item.jabatan && item.jabatan.toLowerCase().includes(q))
    );
  }, [rekapPegawai, searchQuery]);

  const fetchDashboardToday = useCallback(async (tanggal?: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await rekapService.getDashboardToday(tanggal);
      setDashboardToday(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat dashboard hari ini.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRekapData = useCallback(async (currentFilter: DateRangeFilter) => {
    try {
      setLoading(true);
      setError(null);

      const [resSummary, resPegawai, resTerlambat] = await Promise.all([
        rekapService.getSummary(currentFilter),
        rekapService.getPerPegawai(currentFilter),
        rekapService.getKeterlambatan(currentFilter),
      ]);

      setGlobalSummary(resSummary.data);
      setRekapPegawai(resPegawai.data);
      setKeterlambatan(resTerlambat.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data rekapitulasi.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilter: Partial<DateRangeFilter>) => {
      const updated = { ...filter, ...newFilter };
      setFilter(updated);
      void fetchRekapData(updated);
    },
    [filter, fetchRekapData]
  );

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    setError,
    dashboardToday,
    globalSummary,
    rekapPegawai,
    filteredRekapPegawai,
    keterlambatan,
    fetchDashboardToday,
    fetchRekapData,
    handleFilterChange,
  };
}