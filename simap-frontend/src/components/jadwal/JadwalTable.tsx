'use client';

import { JadwalKerja } from '@/types/jadwal';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

interface JadwalTableProps {
  data: JadwalKerja[];
  onEdit: (jadwal: JadwalKerja) => void;
  onDelete: (jadwal: JadwalKerja) => void;
}

export const JadwalTable = ({ data, onEdit, onDelete }: JadwalTableProps) => {
  return (
    <Table
      headers={[
        'Nama Jadwal',
        'Hari Kerja',
        'Jam Masuk',
        'Jam Pulang',
        'Toleransi Terlambat',
        'Aksi',
      ]}
      isEmpty={data.length === 0}
      emptyMessage="Data jadwal kerja belum tersedia."
    >
      {data.map((item) => (
        <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
          <td className="px-6 py-4 font-medium text-[var(--text-main)]">{item.nama_jadwal}</td>
          <td className="px-6 py-4 text-slate-700">{item.hari_kerja || 'Senin - Jumat'}</td>
          <td className="px-6 py-4 font-medium tabular-nums text-emerald-700">
            {item.jam_masuk}
          </td>
          <td className="px-6 py-4 font-medium tabular-nums text-rose-700">
            {item.jam_pulang}
          </td>
          <td className="px-6 py-4 tabular-nums text-[var(--text-main)]">
            {item.toleransi_terlambat} Menit
          </td>
          <td className="space-x-2 whitespace-nowrap px-6 py-4">
            <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus
            </Button>
          </td>
        </tr>
      ))}
    </Table>
  );
};