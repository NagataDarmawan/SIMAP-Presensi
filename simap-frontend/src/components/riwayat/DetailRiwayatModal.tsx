'use client';

import { RiwayatAbsensi } from '@/types/riwayat';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './StatusBadge';
import { X } from 'lucide-react';

type RiwayatDetailItem = RiwayatAbsensi & { keterangan?: string | null };

interface DetailRiwayatModalProps {
  data: RiwayatDetailItem | null;
  onClose: () => void;
}

export function DetailRiwayatModal({
  data,
  onClose,
}: DetailRiwayatModalProps) {
  if (!data) return null;

  const perbandinganJadwal = [
    { label: 'Jam Masuk Aktual:', value: data.jam_masuk, isActual: true },
    { label: 'Jadwal Masuk:', value: data.jam_masuk_jadwal, isActual: false },
    { label: 'Jam Pulang Aktual:', value: data.jam_pulang, isActual: true },
    { label: 'Jadwal Pulang:', value: data.jam_pulang_jadwal, isActual: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Detail Audit Presensi</h3>
            <p className="text-xs text-slate-500">ID Transaksi #{data.absensi_id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] text-slate-400">Informasi Pegawai</p>
            <p className="text-sm font-bold text-[var(--text-main)]">{data.nama_pegawai}</p>
            <p className="text-slate-600">
              {data.kode_pegawai} • {data.jabatan}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Tanggal Absen</p>
              <p className="mt-0.5 text-xs font-bold tabular-nums text-slate-800">{data.tanggal}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Status Presensi</p>
              <div className="mt-0.5">
                <StatusBadge status={data.status} />
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-semibold uppercase text-slate-400">
              Perbandingan Scan vs Jadwal
            </p>
            <div className="grid grid-cols-2 gap-2">
              {perbandinganJadwal.map(({ label, value, isActual }) => (
                <div key={label}>
                  <span className="block text-[11px] text-slate-500">{label}</span>
                  <span
                    className={`tabular-nums ${
                      isActual ? 'font-bold text-[var(--text-main)]' : 'font-medium text-slate-600'
                    }`}
                  >
                    {value || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {data.menit_terlambat > 0 && (
            <div className="badge-terlambat flex items-center justify-between rounded-lg p-3">
              <span className="font-semibold">Keterlambatan:</span>
              <span className="font-bold tabular-nums">{data.menit_terlambat} Menit</span>
            </div>
          )}

          {data.keterangan && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <span className="block text-[10px] font-semibold uppercase text-slate-400">
                Keterangan Sistem
              </span>
              <p className="mt-0.5 text-xs font-medium">{data.keterangan}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}