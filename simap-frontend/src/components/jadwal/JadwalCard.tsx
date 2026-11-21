'use client';

import { JadwalKerja } from '@/types/jadwal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, LogIn, LogOut, AlertCircle, Pencil, Trash2, Calendar } from 'lucide-react';

interface JadwalCardProps {
  item: JadwalKerja;
  onEdit: (jadwal: JadwalKerja) => void;
  onDelete: (jadwal: JadwalKerja) => void;
}

export const JadwalCard = ({ item, onEdit, onDelete }: JadwalCardProps) => {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-light)] text-[var(--brand)]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">{item.nama_jadwal}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Calendar className="h-3 w-3" /> {item.hari_kerja || 'Senin - Jumat'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-[var(--text-muted)]">
          <div className="flex items-center justify-between rounded-md border border-[var(--border-color)] bg-slate-50 p-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <LogIn className="h-3.5 w-3.5 text-emerald-600" /> Jam Masuk
            </span>
            <span className="font-semibold tabular-nums text-[var(--text-main)]">
              {item.jam_masuk}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-[var(--border-color)] bg-slate-50 p-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <LogOut className="h-3.5 w-3.5 text-rose-600" /> Jam Pulang
            </span>
            <span className="font-semibold tabular-nums text-[var(--text-main)]">
              {item.jam_pulang}
            </span>
          </div>

          <div className="flex items-center justify-between px-1 pt-1">
            <span className="flex items-center gap-1.5 text-slate-600">
              <AlertCircle className="h-3.5 w-3.5 text-warning" /> Toleransi Terlambat
            </span>
            <span className="font-semibold tabular-nums text-[var(--text-main)]">
              {item.toleransi_terlambat} menit
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 border-t border-[var(--border-color)] pt-3">
        <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
          <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus
        </Button>
      </div>
    </Card>
  );
};