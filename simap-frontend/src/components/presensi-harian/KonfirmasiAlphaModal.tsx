'use client';

import { UserX, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KonfirmasiAlphaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tanggal: string;
  jumlahPegawai: number;
  loading?: boolean;
}

export function KonfirmasiAlphaModal({
  isOpen,
  onClose,
  onConfirm,
  tanggal,
  jumlahPegawai,
  loading = false,
}: KonfirmasiAlphaModalProps) {
  if (!isOpen || jumlahPegawai <= 0) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white p-6 text-center shadow-xl">
        {/* Tombol Close Pojok Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Tutup dialog"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Ikon di Tengah */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <UserX className="h-6 w-6" />
        </div>

        {/* Judul Rata Tengah */}
        <h3 className="text-base font-bold text-[var(--text-main)]">
          Tandai Semua Pegawai ALPHA
        </h3>

        {/* Deskripsi & Ringkasan Target Rata Tengah */}
        <div className="mt-2 space-y-3 text-sm text-[var(--text-muted)]">
          <p>
            Apakah Anda yakin ingin menandai seluruh pegawai yang belum melakukan presensi sebagai{' '}
            <span className="font-semibold text-rose-600">ALPHA</span>? Data yang sudah ditandai masih
            dapat dikoreksi per pegawai jika diperlukan.
          </p>

          <div className="rounded-xl border border-rose-100 bg-rose-50/70 px-3.5 py-2.5 text-center text-xs font-semibold text-rose-900">
            <span className="block font-bold">{jumlahPegawai} Pegawai Belum Presensi</span>
            <span className="mt-0.5 block tabular-nums text-[11px] opacity-80">
              Tanggal: {tanggal}
            </span>
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
            variant="danger"
            onClick={onConfirm}
            isLoading={loading}
            className="min-w-[140px] text-xs font-bold shadow-sm"
          >
            {loading ? 'Memproses...' : `Ya, Tandai ALPHA (${jumlahPegawai})`}
          </Button>
        </div>
      </div>
    </div>
  );
}