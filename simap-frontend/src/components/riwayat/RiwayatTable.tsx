'use client';

import { RiwayatAbsensi } from '@/types/riwayat';
import { StatusBadge } from './StatusBadge';
import { History, Eye, Pencil } from 'lucide-react';

interface RiwayatTableProps {
  data: RiwayatAbsensi[];
  loading: boolean;
  onEdit: (item: RiwayatAbsensi) => void;
  onViewDetail: (item: RiwayatAbsensi) => void;
}

export function RiwayatTable({
  data,
  loading,
  onEdit,
  onViewDetail,
}: RiwayatTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-slate-50/50 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
          <History className="h-4 w-4 text-[var(--brand)]" />
          Daftar Log Presensi Harian
        </h2>
        <span className="text-xs text-slate-500">
          Total: <span className="font-semibold text-[var(--text-main)]">{data.length}</span> Transaksi Log
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-[var(--border-color)] bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Pegawai</th>
              <th className="px-3 py-3 text-center">Scan Masuk</th>
              <th className="px-3 py-3 text-center">Scan Pulang</th>
              <th className="px-3 py-3 text-center">Status</th>
              <th className="px-3 py-3 text-center">Keterlambatan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Memuat log riwayat absensi...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Tidak ada riwayat absensi yang sesuai filter.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.absensi_id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-xs font-medium tabular-nums text-[var(--text-main)]">
                    {item.tanggal}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--text-main)]">{item.nama_pegawai}</div>
                    <div className="text-xs text-slate-400">
                      {item.kode_pegawai} • {item.jabatan}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-xs font-medium tabular-nums text-slate-700">
                    {item.jam_masuk || '-'}
                  </td>
                  <td className="px-3 py-3 text-center text-xs font-medium tabular-nums text-slate-700">
                    {item.jam_pulang || '-'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-3 text-center text-xs tabular-nums">
                    {item.menit_terlambat > 0 ? (
                      <span className="font-bold text-[var(--color-terlambat)]">
                        +{item.menit_terlambat} mnt
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Koreksi Data Presensi"
                        aria-label="Koreksi Data Presensi"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-white text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewDetail(item)}
                        title="Lihat Detail Presensi"
                        aria-label="Lihat Detail Presensi"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-slate-50 text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[var(--brand)]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}