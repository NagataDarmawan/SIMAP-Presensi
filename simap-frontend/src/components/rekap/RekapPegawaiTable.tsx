'use client';

import { RekapPegawai, DateRangeFilter } from '@/types/rekap';
import { ClipboardList } from 'lucide-react';

interface RekapPegawaiTableProps {
  data: RekapPegawai[];
  loading: boolean;
  filter: DateRangeFilter;
}

export function RekapPegawaiTable({ data, loading, filter }: RekapPegawaiTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-[var(--border-color)] bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
          <ClipboardList className="h-4 w-4 text-[var(--brand)]" />
          Rekapitulasi Kehadiran Per Pegawai
        </h2>
        <span className="text-xs font-medium tabular-nums text-[var(--text-muted)]">
          Periode: {filter.startDate} s/d {filter.endDate}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="whitespace-nowrap border-b border-[var(--border-color)] bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3.5">Pegawai</th>
              <th className="px-3 py-3.5 text-center text-emerald-700">Hadir</th>
              <th className="px-3 py-3.5 text-center text-amber-700">Terlambat</th>
              <th className="px-3 py-3.5 text-center text-indigo-700">Izin</th>
              <th className="px-3 py-3.5 text-center text-rose-700">Sakit</th>
              <th className="px-3 py-3.5 text-center text-purple-700">Cuti</th>
              <th className="px-3 py-3.5 text-center text-red-700">Alpha</th>
              <th className="px-4 py-3.5 text-center">Total Menit Terlambat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-sm text-slate-400">
                  Memuat data rekapitulasi...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-sm text-slate-400">
                  Tidak ada data rekapitulasi pada periode ini.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const totalTerlambat = Number(item.total_terlambat);
                const menitTerlambat = Number(item.total_menit_terlambat);

                return (
                  <tr
                    key={item.pegawai_id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="min-w-[200px] px-4 py-3.5">
                      <div className="font-semibold text-[var(--text-main)]">{item.nama}</div>
                      <div className="text-xs text-slate-400">
                        {item.kode_pegawai} • {item.jabatan}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center tabular-nums">
                      <span className="inline-flex min-w-[28px] items-center justify-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        {item.total_hadir}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center tabular-nums">
                      <span
                        className={`inline-flex min-w-[28px] items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          totalTerlambat > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.total_terlambat}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold tabular-nums text-indigo-600">
                      {item.total_izin}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold tabular-nums text-rose-600">
                      {item.total_sakit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold tabular-nums text-purple-600">
                      {item.total_cuti}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold tabular-nums text-red-600">
                      {item.total_alpha}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-semibold tabular-nums">
                      {menitTerlambat > 0 ? (
                        <span className="text-amber-700">{item.total_menit_terlambat} mnt</span>
                      ) : (
                        <span className="text-slate-400">0 mnt</span>
                      )}
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