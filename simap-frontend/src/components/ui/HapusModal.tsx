'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HapusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
}

export function HapusModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus Data',
  description = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  itemName,
  loading = false,
}: HapusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
        {/* Tombol Close Pojok Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Ikon Peringatan di Tengah */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Judul Rata Tengah */}
        <h3 className="text-base font-bold text-slate-900">{title}</h3>

        {/* Deskripsi & Info Data Terpilih Rata Tengah */}
        <div className="mt-2 space-y-3 text-sm text-slate-600">
          <p>{description}</p>
          {itemName && (
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-3.5 py-2.5 text-center text-xs font-semibold text-rose-800">
              Data terpilih: <span className="font-bold">{itemName}</span>
            </div>
          )}
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
            className="min-w-[110px] bg-rose-600 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
          >
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}