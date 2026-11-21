'use client';

import Link from 'next/link';
import { PresensiHarianItem } from '@/types/presensiHarian';
import { StatusBadge } from '@/components/riwayat/StatusBadge';
import { Button } from '@/components/ui/Button';
import { UserPlus, Pencil, ClockAlert, FileCheck2 } from 'lucide-react';

interface PresensiHarianTableProps {
  data: PresensiHarianItem[];
  loading: boolean;
  onAction: (item: PresensiHarianItem) => void;
}

const IZIN_CUTI_STATUSES = new Set(['IZIN', 'SAKIT', 'CUTI']);
const HADIR_FISIK_STATUSES = new Set(['HADIR', 'TERLAMBAT']);

export function PresensiHarianTable({
  data,
  loading,
  onAction,
}: PresensiHarianTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="border-b border-[var(--border-color)] bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5">Pegawai</th>
              <th className="whitespace-nowrap px-4 py-3.5">Jadwal Kerja</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">Jam Masuk</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">Jam Pulang</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">Status</th>
              <th className="whitespace-nowrap px-4 py-3.5">Keterangan</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Memuat daftar presensi harian pegawai...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Tidak ada data pegawai pada kategori ini.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const isManagedByIzinCuti =
                  item.catatan_izin_cuti_id !== null || IZIN_CUTI_STATUSES.has(item.status);
                const isBelumPulang =
                  item.sudah_presensi &&
                  HADIR_FISIK_STATUSES.has(item.status) &&
                  !item.jam_pulang;

                return (
                  <tr key={item.pegawai_id} className="transition-colors hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="font-semibold text-[var(--text-main)]">{item.nama}</div>
                      <div className="text-xs text-slate-400">
                        {item.kode_pegawai} • {item.jabatan}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-xs">
                      <div className="font-medium text-slate-700">{item.nama_jadwal}</div>
                      <div className="tabular-nums text-slate-400">
                        {item.jam_masuk_jadwal} - {item.jam_pulang_jadwal}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-medium tabular-nums text-slate-700">
                      {item.jam_masuk || '-'}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-medium tabular-nums text-slate-700">
                      {item.jam_pulang ? (
                        item.jam_pulang
                      ) : isBelumPulang ? (
                        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                          Belum Pulang
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                      {item.sudah_presensi ? (
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <StatusBadge status={item.status} />
                          {item.menit_terlambat > 0 && (
                            <span className="text-[10px] font-bold tabular-nums text-[var(--color-terlambat)]">
                              +{item.menit_terlambat} mnt
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                          <ClockAlert className="h-3 w-3 shrink-0" />
                          Belum Presensi
                        </span>
                      )}
                    </td>

                    <td className="min-w-[220px] max-w-[300px] px-4 py-3.5 text-xs leading-relaxed text-slate-500">
                      {item.keterangan ||
                        (item.lewat_batas_pulang
                          ? 'Melewati batas jam pulang tanpa kabar'
                          : '-')}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      {isManagedByIzinCuti ? (
                        <Link
                          href="/izin-cuti"
                          title="Dikelola melalui modul Izin & Cuti"
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[var(--brand)]"
                        >
                          <FileCheck2 className="h-3.5 w-3.5 shrink-0" />
                          Via Izin & Cuti
                        </Link>
                      ) : item.sudah_presensi ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => onAction(item)}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5 shrink-0" /> Koreksi
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => onAction(item)}
                        >
                          <UserPlus className="mr-1.5 h-3.5 w-3.5 shrink-0" /> Input Manual
                        </Button>
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