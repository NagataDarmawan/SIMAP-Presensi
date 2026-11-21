'use client';

import { IzinCuti } from '@/types/izin-cuti';
import { Button } from '@/components/ui/Button';

interface ExtendIzinCutiModalProps {
  target: IzinCuti | null;
  extendedEndDate: string;
  setExtendedEndDate: (date: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function getNextDateIso(dateStr: string): string {
  const baseDate = dateStr.split('T')[0];
  const nextDate = new Date(`${baseDate}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return nextDate.toISOString().split('T')[0];
}

export function ExtendIzinCutiModal({
  target,
  extendedEndDate,
  setExtendedEndDate,
  submitting,
  onClose,
  onSubmit,
}: ExtendIzinCutiModalProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-bold text-[var(--text-main)]">Perpanjang izin/cuti</h2>
        <p className="mb-4 text-sm text-slate-600">
          Tentukan tanggal selesai baru untuk {target.nama_pegawai || 'pegawai ini'}.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-700">
              Tanggal selesai baru
            </label>
            <input
              type="date"
              className="simap-input-focus w-full rounded-md border border-[var(--border-color)] bg-white p-2 text-sm tabular-nums text-[var(--text-main)]"
              value={extendedEndDate}
              onChange={(e) => setExtendedEndDate(e.target.value)}
              min={getNextDateIso(target.tanggal_selesai)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Simpan perpanjangan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}