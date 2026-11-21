'use client';

import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { getStatusBadgeClass } from '@/lib/statusBadge';
import {
  Users,
  UserX,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
} from 'lucide-react';

export default function DashboardPage() {
  const { loading, error, stats, refetch } = useDashboard();

  const totalAktif = stats?.pegawai.total_aktif ?? 0;
  const totalHadirFisik =
    (stats?.presensi_hari_ini.hadir ?? 0) + (stats?.presensi_hari_ini.terlambat ?? 0);
  const persentaseKehadiran =
    totalAktif > 0 ? Math.min(100, Math.round((totalHadirFisik / totalAktif) * 100)) : 0;

  const pegawaiCards = [
    {
      label: 'Total Pegawai Aktif',
      value: totalAktif,
      valueClass: 'text-[var(--text-main)]',
      iconWrapperClass: 'bg-[var(--brand-light)] text-[var(--brand)]',
      Icon: Users,
    },
    {
      label: 'Pegawai Nonaktif',
      value: stats?.pegawai.total_nonaktif ?? 0,
      valueClass: 'text-slate-700',
      iconWrapperClass: 'bg-slate-100 text-slate-500',
      Icon: UserX,
    },
    {
      label: 'Belum Presensi Hari Ini',
      value: stats?.presensi_hari_ini.belum_absen ?? 0,
      valueClass: 'text-rose-600',
      iconWrapperClass: 'bg-rose-50 text-rose-600',
      Icon: AlertCircle,
      spanClass: 'sm:col-span-2 lg:col-span-1',
    },
  ];

  const kehadiranCards = [
    { label: 'HADIR', value: stats?.presensi_hari_ini.hadir ?? 0, badgeClass: 'badge-hadir' },
    { label: 'TERLAMBAT', value: stats?.presensi_hari_ini.terlambat ?? 0, badgeClass: 'badge-terlambat' },
    { label: 'IZIN', value: stats?.presensi_hari_ini.izin ?? 0, badgeClass: 'badge-izin' },
    { label: 'SAKIT', value: stats?.presensi_hari_ini.sakit ?? 0, badgeClass: 'badge-sakit' },
    {
      label: 'CUTI',
      value: stats?.presensi_hari_ini.cuti ?? 0,
      badgeClass: 'badge-cuti',
      spanClass: 'col-span-2 sm:col-span-1',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Dashboard Utama</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Ringkasan ketersediaan pegawai dan status presensi harian real-time
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/scan"
            className="flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-hover)]"
          >
            <ScanLine className="h-3.5 w-3.5" />
            <span>Scan Presensi</span>
          </Link>

          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="badge-alpha flex items-center gap-2 rounded-lg p-4 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Stat Cards Ringkasan Pegawai */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pegawaiCards.map(({ label, value, valueClass, iconWrapperClass, Icon, spanClass }) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${spanClass ?? ''}`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className={`mt-2 text-3xl font-extrabold tabular-nums ${valueClass}`}>
                {loading ? '...' : value}
              </p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconWrapperClass}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Stat Cards Ringkasan Presensi Hari Ini + Progress Tingkat Kehadiran */}
      <div className="space-y-4 rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ringkasan Kehadiran Hari Ini
          </h2>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-[var(--text-muted)]">
              Tingkat Kehadiran Fisik:{' '}
              <strong className="font-bold tabular-nums text-[var(--text-main)]">
                {loading ? '...' : `${totalHadirFisik}/${totalAktif} (${persentaseKehadiran}%)`}
              </strong>
            </span>
          </div>
        </div>

        {/* Progress Bar Tingkat Kehadiran */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
            style={{ width: `${loading ? 0 : persentaseKehadiran}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {kehadiranCards.map(({ label, value, badgeClass, spanClass }) => (
            <div
              key={label}
              className={`${badgeClass} rounded-lg p-3.5 text-center ${spanClass ?? ''}`}
            >
              <p className="text-xs font-semibold">{label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {loading ? '...' : value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Grid Dua Kolom: Log Presensi Terbaru & Daftar Terlambat */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Aktivitas Presensi Terbaru */}
        <div className="space-y-4 rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--brand)]" />
              Log Presensi Terbaru Hari Ini
            </h2>
            <Link href="/riwayat" className="link-brand text-xs font-semibold">
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              <p className="p-4 text-center text-xs text-slate-400">Memuat transaksi terbaru...</p>
            ) : !stats?.recent_absensi?.length ? (
              <p className="p-4 text-center text-xs text-slate-400">
                Belum ada aktivitas presensi hari ini.
              </p>
            ) : (
              stats.recent_absensi.map((item) => (
                <div
                  key={item.absensi_id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate font-semibold text-[var(--text-main)]">
                      {item.nama_pegawai}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {item.kode_pegawai} • {item.jabatan}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block font-bold tabular-nums text-slate-700">
                      {item.jam_masuk || '-'}
                    </span>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pegawai Terlambat Hari Ini */}
        <div className="space-y-4 rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
              <Clock className="h-4 w-4 text-warning" />
              Catatan Terlambat Hari Ini
            </h2>
            <Link
              href="/monitoring"
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Monitoring →
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              <p className="p-4 text-center text-xs text-slate-400">
                Memuat data keterlambatan...
              </p>
            ) : !stats?.terlambat_today?.length ? (
              <p className="p-4 text-center text-xs text-slate-400">
                Tidak ada pegawai yang terlambat hari ini.
              </p>
            ) : (
              stats.terlambat_today.map((item) => (
                <div
                  key={item.absensi_id}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/30 p-3 text-xs transition-colors hover:bg-amber-50/60"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate font-semibold text-[var(--text-main)]">
                      {item.nama_pegawai}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {item.kode_pegawai} • {item.jabatan}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block font-bold tabular-nums text-amber-700">
                      +{item.menit_terlambat} Menit
                    </span>
                    <span className="text-[11px] tabular-nums text-slate-500">
                      Scan: {item.jam_masuk}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}