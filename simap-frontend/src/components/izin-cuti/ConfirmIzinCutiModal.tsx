'use client';

import { IzinCuti } from '@/types/izin-cuti';
import { Button } from '@/components/ui/Button';
import { Ban, CheckCircle2, X } from 'lucide-react';

export type IzinCutiActionType = 'BATAL' | 'SELESAI';

interface ConfirmIzinCutiModalProps {
  target: IzinCuti | null;
  actionType: IzinCutiActionType;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmIzinCutiModal({
  target,
  actionType,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmIzinCutiModalProps) {
  if (!target) return null;

  const isCancel = actionType === 'BATAL';
  const namaPegawai = target.nama_pegawai || `Pegawai #${target.pegawai_id}`;
  const tglMulai = target.tanggal_mulai?.split('T')[0] || '-';
  const tglSelesai = target.tanggal_selesai?.split('T')[0] || '-';

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white p-6 text-center shadow-xl">
        {/* Tombol Close */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Ikon Tengah */}
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
            isCancel ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isCancel ? (
            <Ban className="h-6 w-6" />
          ) : (
            <CheckCircle2 className="h-6 w-6" />
          )}
        </div>

        {/* Judul */}
        <h3 className="text-base font-bold text-[var(--text-main)]">
          {isCancel ? 'Batalkan Pengajuan Izin / Cuti' : 'Tandai Pengajuan Selesai'}
        </h3>

        {/* Deskripsi & Detail Pengajuan */}
        <div className="mt-2 space-y-3 text-sm text-[var(--text-muted)]">
          <p>
            {isCancel
              ? 'Apakah Anda yakin ingin membatalkan pengajuan izin/cuti ini? Status pengajuan akan diubah menjadi dibatalkan.'
              : 'Tandai pengajuan ini selesai setelah pegawai dikonfirmasi sudah kembali bekerja?'}
          </p>

          <div
            className={`rounded-xl border px-3.5 py-2.5 text-center text-xs font-semibold ${
              isCancel
                ? 'border-rose-100 bg-rose-50/70 text-rose-900'
                : 'border-emerald-100 bg-emerald-50/70 text-emerald-900'
            }`}
          >
            <span className="block font-bold">{namaPegawai}</span>
            <span className="mt-0.5 block text-[11px] opacity-80">
              {target.jenis} • {tglMulai} s/d {tglSelesai}
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px] text-xs"
          >
            Tutup
          </Button>
          <Button
            type="button"
            variant={isCancel ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={loading}
            className="min-w-[140px] text-xs font-bold shadow-sm"
          >
            {isCancel ? 'Ya, Batalkan' : 'Ya, Tandai Selesai'}
          </Button>
        </div>
      </div>
    </div>
  );
}