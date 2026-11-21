'use client';

import { useState, useMemo, useCallback } from 'react';
import { usePegawai } from '@/hooks/usePegawai';

export type PrintMode = 'grid' | 'single';

export function useCetakQr() {
  const { loading, error, filteredPegawai, setSearchQuery } = usePegawai();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [printMode, setPrintMode] = useState<PrintMode>('grid');

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const isAllSelected =
    filteredPegawai.length > 0 && selectedIds.length === filteredPegawai.length;

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPegawai.map((p) => p.id));
    }
  }, [isAllSelected, filteredPegawai]);

  const pegawaiToPrint = useMemo(() => {
    if (selectedIds.length === 0) return filteredPegawai;
    return filteredPegawai.filter((p) => selectedIds.includes(p.id));
  }, [filteredPegawai, selectedIds]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    loading,
    error,
    filteredPegawai,
    setSearchQuery,
    selectedIds,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    printMode,
    setPrintMode,
    pegawaiToPrint,
    handlePrint,
  };
}