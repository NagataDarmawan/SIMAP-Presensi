'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRiwayat } from '@/hooks/useRiwayat';
import { RiwayatAbsensi } from '@/types/riwayat';
import { SearchBar } from '@/components/ui/SearchBar';
import { Filter } from '@/components/ui/Filter';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { RiwayatTable } from '@/components/riwayat/RiwayatTable';
import { DetailRiwayatModal } from '@/components/riwayat/DetailRiwayatModal';

const STATUS_FILTER_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Hadir', value: 'HADIR' },
  { label: 'Terlambat', value: 'TERLAMBAT' },
  { label: 'Izin', value: 'IZIN' },
  { label: 'Sakit', value: 'SAKIT' },
  { label: 'Cuti', value: 'CUTI' },
  { label: 'Alpha', value: 'ALPHA' },
];

const DATE_INPUT_CLASS =
  'simap-input-focus rounded-lg border border-[var(--border-color)] bg-white px-3 py-1.5 text-xs font-medium tabular-nums text-[var(--text-main)]';

export default function RiwayatAbsensiPage() {
  const {
    filter,
    loading,
    error,
    riwayatData,
    fetchRiwayat,
    handleFilterChange,
  } = useRiwayat();

  const [selectedDetail, setSelectedDetail] = useState<RiwayatAbsensi | null>(null);
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  useEffect(() => {
    void fetchRiwayat(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseToast = useCallback(() => {
    setDismissedError(error);
  }, [error]);

  const visibleError = error && error !== dismissedError ? error : null;

  return (
    <div className="space-y-6">
      <ToastNotification
        message={visibleError}
        type="error"
        onClose={handleCloseToast}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Riwayat Presensi</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Arsip log transaksi harian catatan presensi jam masuk dan jam pulang seluruh pegawai
        </p>
      </div>

      {/* Control Bar: Search, Filter Status & Filter Periode */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            placeholder="Cari nama atau kode pegawai..."
            onSearch={(val) => handleFilterChange({ search: val })}
          />
          <Filter
            label="Status"
            value={filter.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            aria-label="Tanggal Mulai"
            value={filter.startDate}
            onChange={(e) => handleFilterChange({ startDate: e.target.value })}
            className={DATE_INPUT_CLASS}
          />
          <span className="text-xs text-slate-400">s/d</span>
          <input
            type="date"
            aria-label="Tanggal Selesai"
            value={filter.endDate}
            onChange={(e) => handleFilterChange({ endDate: e.target.value })}
            className={DATE_INPUT_CLASS}
          />
        </div>
      </div>

      {/* Tabel Riwayat Absensi (Read-Only) */}
      <RiwayatTable
        data={riwayatData}
        loading={loading}
        onViewDetail={setSelectedDetail}
      />

      {/* Modal Detail Audit Log */}
      <DetailRiwayatModal
        data={selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />
    </div>
  );
}