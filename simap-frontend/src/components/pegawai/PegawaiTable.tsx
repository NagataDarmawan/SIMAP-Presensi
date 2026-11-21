'use client';

import { Pegawai } from '@/types/pegawai';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Pencil, UserX, UserCheck, Trash2 } from 'lucide-react';

interface PegawaiTableProps {
  data: Pegawai[];
  getJadwalNama: (id: number) => string;
  onEdit: (pegawai: Pegawai) => void;
  onToggleStatus: (pegawai: Pegawai) => void;
  onDelete: (pegawai: Pegawai) => void;
}

export const PegawaiTable = ({
  data,
  getJadwalNama,
  onEdit,
  onToggleStatus,
  onDelete,
}: PegawaiTableProps) => {
  return (
    <div className="[&_th]:whitespace-nowrap">
      <Table
        headers={[
          'Kode',
          'Nama',
          'Jenis Kelamin',
          'Jabatan',
          'No. Telepon',
          'Jadwal Kerja',
          'Tgl Masuk',
          'Alamat',
          'Status',
          'Aksi',
        ]}
        isEmpty={data.length === 0}
        emptyMessage="Data pegawai tidak ditemukan."
      >
        {data.map((item) => {
          const isAktif = item.status === 'AKTIF';

          return (
            <tr key={item.id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold tracking-wider text-slate-700">
                {item.kode_pegawai}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-900">
                {item.nama}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-700">
                {item.jenis_kelamin || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-700">
                {item.jabatan || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                {item.no_telepon || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                {getJadwalNama(item.jadwal_kerja_id)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                {item.tanggal_masuk ? item.tanggal_masuk.split('T')[0] : '-'}
              </td>
              <td
                className="max-w-[200px] truncate px-4 py-3 text-xs text-slate-600"
                title={item.alamat || '-'}
              >
                {item.alamat || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isAktif
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isAktif ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {item.status || 'AKTIF'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={isAktif ? 'secondary' : 'primary'}
                    onClick={() => onToggleStatus(item)}
                  >
                    {isAktif ? (
                      <>
                        <UserX className="mr-1 h-3.5 w-3.5 text-amber-600" /> Nonaktifkan
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-1 h-3.5 w-3.5" /> Aktifkan
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(item)}
                    title="Hapus Pegawai Permanen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};