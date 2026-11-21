'use client';

import { useState } from 'react';
import { usePresensiHarian, HarianTabFilter } from '@/hooks/usePresensiHarian';
import { PresensiHarianItem } from '@/types/presensiHarian';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { PresensiHarianTable } from '@/components/presensi-harian/PresensiHarianTable';
import { PresensiManualModal } from '@/components/presensi-harian/PresensiManualModal';
import { KonfirmasiAlphaModal } from '@/components/presensi-harian/KonfirmasiAlphaModal';
import { Users, CheckCircle2, Clock, UserX, LogOut } from 'lucide-react';

export default function PresensiHarianPage() {
  const {
    tanggal,
    setTanggal,
    setSearchQuery,
    activeTab,
    setActiveTab,
    onlyBelumPulang,
    setOnlyBelumPulang,
    belumPulangCount,
    summary,
    filteredItems,
    loading,
    processingAutoAlpha,
    toast,
    closeToast,
    submitManual,
    submitCorrection,
    runAutoAlpha,
  } = usePresensiHarian();

  const [selectedItem, setSelectedItem] = useState<PresensiHarianItem | null>(null);
  const [confirmAlphaOpen, setConfirmAlphaOpen] = useState(false);

  const tabs: { key: HarianTabFilter; label: string; count: number }[] = [
    { key: 'BELUM', label: 'Belum Presensi', count: summary.belum_presensi },
    { key: 'SUDAH', label: 'Sudah Presensi', count: summary.sudah_presensi },
    { key: 'ALL', label: 'Semua Terjadwal', count: summary.total_terjadwal },
  ];

  const handleConfirmAutoAlpha = async () => {
    await runAutoAlpha(true);
    setConfirmAlphaOpen(false);
  };

  return (
    <div className="space-y-6">
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Presensi Harian</h1>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            Pantau status kehadiran pegawai harian, input presensi manual, koreksi waktu, dan penetapan ketidakhadiran
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:flex-nowrap">
          <input
            type="date"
            aria-label="Tanggal Presensi Harian"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="simap-input-focus h-9 rounded-lg border border-[var(--border-color)] bg-white px-3 text-xs font-semibold tabular-nums text-[var(--text-main)] shadow-xs"
          />

          {summary.belum_presensi > 0 && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="h-9 shrink-0 whitespace-nowrap px-3.5"
              isLoading={processingAutoAlpha}
              onClick={() => setConfirmAlphaOpen(true)}
            >
              <UserX className="mr-1.5 h-4 w-4 shrink-0" />
              Tandai Semua ALPHA ({summary.belum_presensi})
            </Button>
          )}
        </div>
      </div>

      {/* Ringkasan Statistik Harian */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Pegawai Terjadwal</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--text-main)]">
              {summary.total_terjadwal}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-500">Sudah Presensi / Tercatat</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-600">
              {summary.sudah_presensi}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-500">Belum Presensi</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-amber-600">
              {summary.belum_presensi}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Tab Switcher, Filter Cepat Belum Pulang & Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-[var(--border-color)] bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-[var(--brand)] shadow-sm'
                    : 'text-slate-600 hover:text-[var(--text-main)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-[var(--brand)]'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'SUDAH' && belumPulangCount > 0 && (
            <button
              type="button"
              onClick={() => setOnlyBelumPulang((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                onlyBelumPulang
                  ? 'border-orange-300 bg-orange-50 text-orange-700 shadow-xs'
                  : 'border-[var(--border-color)] bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LogOut className="h-3.5 w-3.5 text-orange-600" />
              <span>Belum Scan Pulang</span>
              <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-orange-700">
                {belumPulangCount}
              </span>
            </button>
          )}
        </div>

        <SearchBar
          placeholder="Cari nama, kode, atau jabatan..."
          onSearch={(val) => setSearchQuery(val)}
        />
      </div>

      {/* Tabel Daftar Pegawai Harian */}
      <PresensiHarianTable
        data={filteredItems}
        loading={loading}
        onAction={setSelectedItem}
      />

      {/* Modal Input Manual & Koreksi */}
      <div className="!mt-0">
        <PresensiManualModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSubmitManual={submitManual}
          onSubmitCorrection={submitCorrection}
        />
      </div>

      {/* Modal Konfirmasi Tandai Semua ALPHA */}
      <div className="!mt-0">
        <KonfirmasiAlphaModal
          isOpen={confirmAlphaOpen}
          onClose={() => setConfirmAlphaOpen(false)}
          onConfirm={() => void handleConfirmAutoAlpha()}
          tanggal={tanggal}
          jumlahPegawai={summary.belum_presensi}
          loading={processingAutoAlpha}
        />
      </div>
    </div>
  );
}