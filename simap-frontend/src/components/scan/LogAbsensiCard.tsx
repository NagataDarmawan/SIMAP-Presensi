'use client';

import { useState, useMemo } from 'react';
import { getStatusBadgeClass } from '@/lib/statusBadge';
import { History, RefreshCw, Loader2 } from 'lucide-react';

export interface LogAbsensiItem {
  absensi_id: number | string;
  nama_pegawai: string;
  kode_pegawai: string;
  jabatan?: string | null;
  jam_masuk?: string | null;
  jam_pulang?: string | null;
  status: string;
}

interface LogAbsensiCardProps {
  logs?: LogAbsensiItem[];
  loading: boolean;
  onRefresh: () => Promise<unknown> | void;
}

export default function LogAbsensiCard({
  logs,
  loading,
  onRefresh,
}: LogAbsensiCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || loading) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        onRefresh(),
        new Promise((resolve) => setTimeout(resolve, 550)),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Urutkan berdasarkan aktivitas scan paling terakhir (jam_pulang jika ada, lalu jam_masuk)
  const recentLogs = useMemo(() => {
    if (!logs?.length) return [];

    return [...logs]
      .filter((item) => Boolean(item.jam_pulang || item.jam_masuk))
      .sort((a, b) => {
        const lastScanA = a.jam_pulang || a.jam_masuk || '';
        const lastScanB = b.jam_pulang || b.jam_masuk || '';
        return lastScanB.localeCompare(lastScanA);
      })
      .slice(0, 5);
  }, [logs]);

  const isBusy = isRefreshing || loading;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-2.5 flex shrink-0 items-center justify-between border-b border-[var(--border-color)] pb-2">
        <div className="flex items-center gap-1.5">
          <History className="h-4 w-4 text-[var(--brand)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            Log Absensi
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isBusy}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--brand)] active:scale-95 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3 w-3 ${isBusy ? 'animate-spin text-[var(--brand)]' : ''}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Wrapper Tinggi Tetap Sejajar Kolom Kiri */}
      <div className="relative h-[280px] min-h-0 md:h-0 md:flex-1">
        {isRefreshing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-white/75 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
            <span className="text-[11px] font-semibold text-slate-600">
              Memuat log absensi...
            </span>
          </div>
        )}

        <div
          className={`h-full space-y-2 overflow-y-auto pr-1 transition-opacity duration-200 ${
            isRefreshing ? 'pointer-events-none select-none opacity-40' : 'opacity-100'
          }`}
        >
          {loading && !logs ? (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" />
              <span className="text-xs">Memuat log absensi...</span>
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-xs text-slate-400">
              Belum ada log absensi hari ini.
            </div>
          ) : (
            recentLogs.map((item) => {
              const isPulang = Boolean(item.jam_pulang);
              const lastTime = item.jam_pulang || item.jam_masuk || '--:--';
              const lastLabel = isPulang ? 'PULANG' : item.status;
              const badgeClass = isPulang ? 'badge-cuti' : getStatusBadgeClass(item.status);

              return (
                <div
                  key={item.absensi_id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs transition-colors hover:bg-slate-100/60"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate font-semibold text-[var(--text-main)]">
                      {item.nama_pegawai}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">{item.kode_pegawai}</span>
                      {item.jabatan ? ` • ${item.jabatan}` : ''}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      title={isPulang ? 'Jam Scan Pulang' : 'Jam Scan Masuk'}
                      className="block text-[11px] font-bold tabular-nums text-slate-700"
                    >
                      {lastTime}
                    </span>

                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}
                    >
                      {lastLabel}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}