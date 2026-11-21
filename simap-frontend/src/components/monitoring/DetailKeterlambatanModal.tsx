'use client';

import { MonitoringKeterlambatan, DetailKeterlambatan } from '@/types/rekap';
import { Button } from '@/components/ui/Button';
import { CalendarDays, X } from 'lucide-react';

interface DetailKeterlambatanModalProps {
  pegawai: MonitoringKeterlambatan | null;
  history: DetailKeterlambatan[];
  loading: boolean;
  onClose: () => void;
}

export function DetailKeterlambatanModal({
  pegawai,
  history,
  loading,
  onClose,
}: DetailKeterlambatanModalProps) {
  if (!pegawai) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">
              Histori Keterlambatan
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {pegawai.nama} ({pegawai.kode_pegawai})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <p className="p-4 text-center text-xs text-slate-400">
              Memuat rincian tanggal...
            </p>
          ) : history.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-400">
              Tidak ada rincian tanggal.
            </p>
          ) : (
            history.map((detail) => (
              <div
                key={detail.absensi_id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold tabular-nums text-[var(--text-main)]">
                      {detail.tanggal}
                    </p>
                    <p className="text-[11px] tabular-nums text-slate-500">
                      Scan:{' '}
                      <span className="font-medium text-rose-600">
                        {detail.jam_masuk_aktual || '-'}
                      </span>{' '}
                      | Jadwal: {detail.jam_masuk_jadwal || '-'}
                    </p>
                  </div>
                </div>
                <span className="badge-terlambat rounded px-2 py-1 text-xs font-bold tabular-nums">
                  +{detail.menit_terlambat} Menit
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}