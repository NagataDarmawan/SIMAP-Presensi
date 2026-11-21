'use client';

import { IzinCuti } from '@/types/izin-cuti';
import { Button } from '@/components/ui/Button';
import { getStatusBadgeClass } from '@/lib/statusBadge';
import { Ban, CalendarPlus, Check, Pencil } from 'lucide-react';

interface IzinCutiTableProps {
  data: IzinCuti[];
  actionSubmitting: boolean;
  onEdit: (item: IzinCuti) => void;
  onOpenExtend: (item: IzinCuti) => void;
  onSelesai: (item: IzinCuti) => void;
  onBatal: (item: IzinCuti) => void;
}

const TABLE_HEADERS = [
  { label: 'Pegawai', align: 'text-left' },
  { label: 'Jenis', align: 'text-left' },
  { label: 'Tanggal Mulai', align: 'text-left' },
  { label: 'Tanggal Selesai', align: 'text-left' },
  { label: 'Alasan', align: 'text-left' },
  { label: 'Status', align: 'text-left' },
  { label: 'Aksi', align: 'text-right' },
] as const;

function getPengajuanStatusBadge(status?: string): string {
  switch (status) {
    case 'DIBATALKAN':
      return 'border border-slate-200 bg-slate-100 text-slate-600';
    case 'SELESAI':
      return 'badge-cuti';
    case 'MENUNGGU_KONFIRMASI':
      return 'badge-terlambat';
    default:
      return 'badge-hadir';
  }
}

function formatIsoDate(dateStr?: string): string {
  return dateStr ? dateStr.split('T')[0] : '-';
}

export function IzinCutiTable({
  data,
  actionSubmitting,
  onEdit,
  onOpenExtend,
  onSelesai,
  onBatal,
}: IzinCutiTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
      <table className="w-full whitespace-nowrap text-left text-sm text-slate-600">
        <thead className="border-b border-[var(--border-color)] bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {TABLE_HEADERS.map((col) => (
              <th key={col.label} className={`px-6 py-3 font-semibold ${col.align}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((item) => {
              const targetLabel = item.nama_pegawai || `pegawai ${item.pegawai_id}`;
              const isWaiting = item.status === 'MENUNGGU_KONFIRMASI';
              const isActive = item.status === 'AKTIF';

              return (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-[var(--text-main)]">
                    {item.nama_pegawai || `Pegawai #${item.pegawai_id}`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(item.jenis)}`}
                    >
                      {item.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-4 tabular-nums">{formatIsoDate(item.tanggal_mulai)}</td>
                  <td className="px-6 py-4 tabular-nums">{formatIsoDate(item.tanggal_selesai)}</td>
                  <td className="max-w-xs truncate px-6 py-4 text-slate-500">
                    {item.alasan || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPengajuanStatusBadge(item.status)}`}
                    >
                      {item.status?.replaceAll('_', ' ') || 'AKTIF'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isWaiting && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="!p-2"
                            onClick={() => onOpenExtend(item)}
                            title="Perpanjang pengajuan"
                            aria-label={`Perpanjang pengajuan ${targetLabel}`}
                          >
                            <CalendarPlus aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            className="!p-2"
                            onClick={() => onSelesai(item)}
                            disabled={actionSubmitting}
                            title="Tandai selesai"
                            aria-label={`Tandai selesai pengajuan ${targetLabel}`}
                          >
                            <Check aria-hidden="true" className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="!p-2"
                          onClick={() => onEdit(item)}
                          title="Edit pengajuan"
                          aria-label={`Edit pengajuan ${targetLabel}`}
                        >
                          <Pencil aria-hidden="true" className="h-4 w-4" />
                        </Button>
                      )}

                      {(isActive || isWaiting) && (
                        <Button
                          size="sm"
                          variant="danger"
                          className="!p-2"
                          onClick={() => onBatal(item)}
                          title="Batalkan pengajuan"
                          aria-label={`Batalkan pengajuan ${targetLabel}`}
                        >
                          <Ban aria-hidden="true" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                Belum ada data pengajuan izin/cuti.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}