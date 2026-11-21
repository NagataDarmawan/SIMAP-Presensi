'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRekap } from '@/hooks/useRekap';
import { rekapService } from '@/services/rekap.service';
import { MonitoringKeterlambatan, DetailKeterlambatan } from '@/types/rekap';

export function useMonitoring() {
  const {
    filter,
    loading,
    error,
    setError,
    keterlambatan,
    fetchRekapData,
    handleFilterChange,
  } = useRekap();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPegawai, setSelectedPegawai] =
    useState<MonitoringKeterlambatan | null>(null);
  const [detailHistory, setDetailHistory] = useState<DetailKeterlambatan[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return keterlambatan.filter(
      (item) =>
        item.nama.toLowerCase().includes(q) ||
        item.kode_pegawai.toLowerCase().includes(q) ||
        item.jabatan.toLowerCase().includes(q)
    );
  }, [keterlambatan, searchQuery]);

  const handleOpenDetail = useCallback(
    async (item: MonitoringKeterlambatan) => {
      setSelectedPegawai(item);
      setDetailHistory([]);
      try {
        setLoadingDetail(true);
        const res = await rekapService.getDetailKeterlambatan(item.pegawai_id, filter);
        setDetailHistory(res.data || []);
      } catch (err) {
        console.error('Gagal mengambil detail keterlambatan:', err);
      } finally {
        setLoadingDetail(false);
      }
    },
    [filter]
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedPegawai(null);
  }, []);

  return {
    filter,
    loading,
    error,
    setError,
    filteredData,
    setSearchQuery,
    selectedPegawai,
    detailHistory,
    loadingDetail,
    fetchRekapData,
    handleFilterChange,
    handleOpenDetail,
    handleCloseDetail,
  };
}