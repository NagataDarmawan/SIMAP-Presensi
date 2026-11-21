'use client';

import { MonitoringKeterlambatan, DateRangeFilter } from '@/types/rekap';
import { Button } from '@/components/ui/Button';
import { Clock, Eye } from 'lucide-react';

interface MonitoringTableProps {
  data: MonitoringKeterlambatan[];
  loading: boolean;
  filter: DateRangeFilter;
  onOpenDetail: (item: MonitoringKeterlambatan) => void;
}

export function MonitoringTable({
  data,
  loading,
  filter,
  onOpenDetail,
}: MonitoringTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-[var(--border-color)] bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
          <Clock className="h-4 w-4 text-amber-600" />
          Peringkat Keterlambatan Pegawai
        </h2>
        <span className="text-xs tabular-nums text-[var(--text-muted)]">
          Periode: {filter.startDate} s/d {filter.endDate}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="whitespace-nowrap border-b border-[var(--border-color)] bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="w-12 px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Pegawai</th>
              <th className="px-4 py-3 text-center">Frekuensi</th>
              <th className="px-4 py-3 text-center">Total Menit</th>
              <th className="px-4 py-3 text-center">Rata-rata / Kasus</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Memuat data monitoring kedisiplinan...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Tidak ada catatan keterlambatan pegawai pada periode ini.
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const totalMenit = Number(item.total_menit_terlambat);
                const avgMinutes =
                  item.frekuensi_terlambat > 0
                    ? Math.round(totalMenit / item.frekuensi_terlambat)
                    : 0;

                return (
                  <tr
                    key={item.pegawai_id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3 text-center tabular-nums">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--text-main)]">{item.nama}</div>
                      <div className="text-xs text-slate-400">
                        {item.kode_pegawai} • {item.jabatan}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center tabular-nums">
                      <span className="badge-terlambat inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {item.frekuensi_terlambat} Kali
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center font-bold tabular-nums text-amber-600">
                      {totalMenit} Menit
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-xs tabular-nums text-slate-600">
                      ± {avgMinutes} Menit
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onOpenDetail(item)}
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Detail Histori
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}