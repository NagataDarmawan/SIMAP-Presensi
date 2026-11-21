'use client';

import { useEffect } from 'react';
import { useMonitoring } from '@/hooks/useMonitoring';
import { SearchBar } from '@/components/ui/SearchBar';
import { MonitoringTable } from '@/components/monitoring/MonitoringTable';
import { DetailKeterlambatanModal } from '@/components/monitoring/DetailKeterlambatanModal';
import { AlertTriangle } from 'lucide-react';

export default function MonitoringKedisiplinanPage() {
  const {
    filter,
    loading,
    error,
    filteredData,
    setSearchQuery,
    selectedPegawai,
    detailHistory,
    loadingDetail,
    fetchRekapData,
    handleFilterChange,
    handleOpenDetail,
    handleCloseDetail,
  } = useMonitoring();

  useEffect(() => {
    void fetchRekapData(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">
            Monitoring Kedisiplinan
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Pemantauan khusus rekam jejak keterlambatan dan kedisiplinan jam kerja pegawai SIMAP
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="badge-alpha flex items-center gap-2 rounded-lg p-4 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Bar: Search & Filter Periode */}
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

      {/* Tabel Monitoring Keterlambatan */}
      <MonitoringTable
        data={filteredData}
        loading={loading}
        filter={filter}
        onOpenDetail={handleOpenDetail}
      />

      {/* Modal Detail Histori Keterlambatan */}
      <div className="!mt-0">
        <DetailKeterlambatanModal
          pegawai={selectedPegawai}
          history={detailHistory}
          loading={loadingDetail}
          onClose={handleCloseDetail}
        />
      </div>
    </div>
  );
}