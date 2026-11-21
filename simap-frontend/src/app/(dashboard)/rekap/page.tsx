'use client';

import { useEffect } from 'react';
import { useRekap } from '@/hooks/useRekap';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { RekapSummaryCards } from '@/components/rekap/RekapSummaryCards';
import { RekapPegawaiTable } from '@/components/rekap/RekapPegawaiTable';
import { exportRekapToExcel } from '@/utils/exportRekapExcel';
import { AlertTriangle, FileSpreadsheet } from 'lucide-react';

export default function RekapPresensiPage() {
  const {
    filter,
    setSearchQuery,
    loading,
    error,
    globalSummary,
    rekapPegawai,
    filteredRekapPegawai,
    fetchRekapData,
    handleFilterChange,
  } = useRekap();

  useEffect(() => {
    void fetchRekapData(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportExcel = () => {
    exportRekapToExcel(rekapPegawai, globalSummary, filter);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header & Tombol Export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            Rekapitulasi Kehadiran
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Ringkasan kehadiran fisik, keterlambatan, dan catatan izin/sakit/cuti seluruh pegawai
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleExportExcel}
          disabled={loading || rekapPegawai.length === 0}
          className="shrink-0 self-start px-5 py-2.5 text-sm font-semibold shadow-sm sm:self-auto"
        >
          <FileSpreadsheet className="mr-1.5 h-4 w-4" />
          Export Excel (.xls)
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="badge-alpha flex items-center gap-2.5 rounded-xl p-4 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Ringkasan Bento */}
      <RekapSummaryCards summary={globalSummary} />

      {/* 3. Control Bar: Search & Filter Periode (Identik dengan Monitoring) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Cari nama, kode, atau jabatan..."
          onSearch={(val) => setSearchQuery(val)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Periode:</span>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => handleFilterChange({ startDate: e.target.value })}
            className="simap-input-focus rounded-lg border border-[var(--border-color)] bg-white px-3 py-1.5 text-xs font-medium tabular-nums text-slate-700"
          />
          <span className="text-xs text-slate-400">s/d</span>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => handleFilterChange({ endDate: e.target.value })}
            className="simap-input-focus rounded-lg border border-[var(--border-color)] bg-white px-3 py-1.5 text-xs font-medium tabular-nums text-slate-700"
          />
        </div>
      </div>

      {/* 4. Tabel Rekapitulasi Per Pegawai */}
      <RekapPegawaiTable data={filteredRekapPegawai} loading={loading} filter={filter} />
    </div>
  );
}