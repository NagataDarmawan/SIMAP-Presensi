'use client';

import { RekapGlobalSummary } from '@/types/rekap';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  FileText,
  HeartPulse,
  CalendarOff,
} from 'lucide-react';

interface RekapSummaryCardsProps {
  summary: RekapGlobalSummary | null;
}

export function RekapSummaryCards({ summary }: RekapSummaryCardsProps) {
  const totalIzin = Number(summary?.total_izin ?? 0);
  const totalSakit = Number(summary?.total_sakit ?? 0);
  const totalCuti = Number(summary?.total_cuti ?? 0);
  const totalTidakHadir = totalIzin + totalSakit + totalCuti;

  const rincianTidakHadir = [
    { label: 'Izin', value: totalIzin, icon: FileText, colorClass: 'text-indigo-600' },
    { label: 'Sakit', value: totalSakit, icon: HeartPulse, colorClass: 'text-rose-600' },
    { label: 'Cuti', value: totalCuti, icon: Calendar, colorClass: 'text-purple-600' },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Blok 1: Kehadiran Fisik */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm lg:col-span-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kehadiran Fisik
            </span>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--brand-light)] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--brand)]">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>{summary?.total_pegawai_aktif ?? 0} Aktif</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold tabular-nums text-emerald-700">
            {summary?.total_hadir ?? 0}
            <span className="ml-1.5 text-xs font-medium text-slate-400">hari hadir</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Total kehadiran fisik (termasuk hadir terlambat)
          </p>
        </div>
      </div>

      {/* Blok 2: Keterlambatan */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm lg:col-span-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Keterlambatan
            </span>
          </div>

          <div className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold tabular-nums text-amber-700">
            {Number(summary?.total_menit_terlambat || 0)} Mnt Total
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold tabular-nums text-amber-600">
            {summary?.total_terlambat ?? 0}
            <span className="ml-1.5 text-xs font-medium text-slate-400">kali terlambat</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Frekuensi masuk melewati toleransi jadwal
          </p>
        </div>
      </div>

      {/* Blok 3: Ketidakhadiran */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm lg:col-span-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <CalendarOff className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ketidakhadiran
            </span>
          </div>

          <span className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-slate-400">
            Total {totalTidakHadir} Hari
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/80 py-2.5">
          {rincianTidakHadir.map(({ label, value, icon: Icon, colorClass }) => (
            <div key={label} className="px-2 text-center">
              <div className={`inline-flex items-center gap-1 text-[11px] font-semibold ${colorClass}`}>
                <Icon className="h-3 w-3 shrink-0" />
                <span>{label}</span>
              </div>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-[var(--text-main)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}