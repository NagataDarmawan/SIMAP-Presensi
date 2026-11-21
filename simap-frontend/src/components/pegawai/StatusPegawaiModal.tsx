'use client';

import { Pegawai } from '@/types/pegawai';
import { UserX, UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StatusPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pegawai: Pegawai | null;
  loading?: boolean;
}

export function StatusPegawaiModal({
  isOpen,
  onClose,
  onConfirm,
  pegawai,
  loading = false,
}: StatusPegawaiModalProps) {
  if (!isOpen || !pegawai) return null;

  const isCurrentlyActive = pegawai.status === 'AKTIF';

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white p-6 text-center shadow-xl">
        {/* Tombol Close Pojok Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Ikon di Tengah */}
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
            isCurrentlyActive
              ? 'bg-amber-50 text-amber-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isCurrentlyActive ? (
            <UserX className="h-6 w-6" />
          ) : (
            <UserCheck className="h-6 w-6" />
          )}
        </div>

        {/* Judul Rata Tengah */}
        <h3 className="text-base font-bold text-[var(--text-main)]">
          {isCurrentlyActive ? 'Nonaktifkan Pegawai' : 'Aktifkan Kembali Pegawai'}
        </h3>

        {/* Deskripsi & Info Pegawai Rata Tengah */}
        <div className="mt-2 space-y-3 text-sm text-[var(--text-muted)]">
          <p>
            {isCurrentlyActive
              ? 'Apakah Anda yakin ingin menonaktifkan pegawai ini? Pegawai yang nonaktif tidak dapat melakukan pemindaian presensi.'
              : 'Apakah Anda yakin ingin mengaktifkan kembali pegawai ini agar dapat melakukan presensi harian?'}
          </p>

          <div
            className={`rounded-xl border px-3.5 py-2.5 text-center text-xs font-semibold ${
              isCurrentlyActive
                ? 'border-amber-100 bg-amber-50/70 text-amber-900'
                : 'border-emerald-100 bg-emerald-50/70 text-emerald-900'
            }`}
          >
            <span className="block font-bold">{pegawai.nama}</span>
            {pegawai.kode_pegawai && (
              <span className="mt-0.5 block text-[11px] opacity-80">
                Kode: {pegawai.kode_pegawai} {pegawai.jabatan ? `• ${pegawai.jabatan}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Tombol Aksi Rata Tengah */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px] text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            isLoading={loading}
            className={`min-w-[130px] text-xs font-bold text-white shadow-sm ${
              isCurrentlyActive
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading
              ? 'Memproses...'
              : isCurrentlyActive
              ? 'Ya, Nonaktifkan'
              : 'Ya, Aktifkan'}
          </Button>
        </div>
      </div>
    </div>
  );
}