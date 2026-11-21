'use client';

import { ScanResultData } from '@/types/absensi';
import { getStatusBadgeClass } from '@/lib/statusBadge';
import {
  CheckCircle2,
  Clock,
  User,
  QrCode,
  AlertTriangle,
  LogIn,
  LogOut,
  Info,
} from 'lucide-react';

interface ScanResultCardProps {
  result: ScanResultData | null;
  error: string | null;
  loading?: boolean;
}

function getStatusLabel(status: string, menitTerlambat?: number | null): string {
  if (status === 'HADIR') return 'HADIR TEPAT WAKTU';
  if (status === 'TERLAMBAT') {
    return menitTerlambat && menitTerlambat > 0
      ? `TERLAMBAT ${menitTerlambat} MENIT`
      : 'TERLAMBAT';
  }
  return status;
}

export default function ScanResultCard({ result, error, loading }: ScanResultCardProps) {
  // 1. State Loading
  if (loading) {
    return (
      <div className="flex min-h-[195px] w-full flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-white p-4 text-center shadow-sm">
        <div className="mb-2.5 flex h-11 w-11 animate-pulse items-center justify-center rounded-full bg-[var(--brand-light)] text-[var(--brand)]">
          <QrCode className="h-5 w-5 animate-spin" />
        </div>
        <h3 className="text-sm font-bold text-[var(--text-main)]">Memproses QR Code...</h3>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
          Sistem sedang memverifikasi data presensi pegawai.
        </p>
      </div>
    );
  }

  // 2. State Error
  if (error) {
    return (
      <div className="animate-in fade-in zoom-in flex min-h-[195px] w-full flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-center shadow-sm duration-200">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-inner">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800">
            Scan Gagal
          </span>
        </div>
        <h3 className="text-sm font-bold text-[var(--text-main)]">Scan Absensi Ditolak</h3>
        <p className="mt-1.5 max-w-sm rounded-xl border border-rose-200/60 bg-white/80 px-3 py-2 text-xs font-medium text-rose-700 shadow-sm">
          {error}
        </p>
      </div>
    );
  }

  // 3. State Standby
  if (!result) {
    return (
      <div className="flex min-h-[195px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-slate-50/50 p-4 text-center">
        <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-white text-slate-400 shadow-sm">
          <QrCode className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">Siap Melakukan Scan</h3>
        <p className="mt-1 max-w-xs text-[11px] text-[var(--text-muted)]">
          Arahkan QR Code ID Card pegawai ke kamera scanner atau masukkan kode secara manual untuk mencatat presensi.
        </p>
      </div>
    );
  }

  // 4. State Sukses
  const isMasuk = result.jenis === 'ABSEN MASUK';
  const isPulangCepat = result.status_pulang === 'PULANG_CEPAT';
  const isWarningKeterangan =
    (isMasuk && result.status === 'TERLAMBAT') || (!isMasuk && isPulangCepat);

  const waktuList = [
    { label: 'Jam Masuk', value: result.jam_masuk },
    { label: 'Jam Pulang', value: result.jam_pulang },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex w-full flex-col justify-between space-y-3 rounded-2xl border border-[var(--border-color)] bg-white p-4 shadow-sm duration-300">
      <div className="space-y-2.5">
        {/* Header Jenis Presensi & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isMasuk ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {isMasuk ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Jenis Presensi
              </span>
              <h4
                className={`mt-0.5 text-xs font-extrabold leading-none ${
                  isMasuk ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.jenis}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-2xs ${getStatusBadgeClass(result.status)}`}
            >
              {getStatusLabel(result.status, result.menit_terlambat)}
            </span>

            {!isMasuk && result.status_pulang && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-2xs ${
                  isPulangCepat ? 'badge-terlambat' : 'badge-hadir'
                }`}
              >
                {isPulangCepat
                  ? `PULANG CEPAT ${result.menit_pulang_cepat} MNT`
                  : 'PULANG TEPAT WAKTU'}
              </span>
            )}
          </div>
        </div>

        {/* Profil Pegawai */}
        <div className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)] text-sm font-bold uppercase text-white shadow-2xs">
            {result.pegawai ? result.pegawai.charAt(0) : <User className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-[var(--text-main)]">
              {result.pegawai}
            </h3>
            <p className="truncate text-[11px] font-medium text-slate-500">
              <span className="font-semibold text-slate-700">{result.kode_pegawai}</span>
              {result.jabatan ? ` • ${result.jabatan}` : ''}
            </p>
          </div>
        </div>

        {/* Jam Masuk & Jam Pulang */}
        <div className="grid grid-cols-2 gap-2.5">
          {waktuList.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2"
            >
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </span>
              <div className="mt-0.5 flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-bold tabular-nums text-slate-800">
                  {value || '-'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Keterangan Tambahan */}
        {result.keterangan && (
          <div
            className={`flex items-start space-x-2 rounded-xl border px-3 py-2 text-[11px] ${
              isWarningKeterangan
                ? 'border-amber-200 bg-amber-50/70 text-amber-900'
                : 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
            }`}
          >
            <Info
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                isWarningKeterangan ? 'text-amber-600' : 'text-emerald-600'
              }`}
            />
            <p className="break-words font-medium leading-relaxed">{result.keterangan}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1 font-medium text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> Data Presensi Berhasil Dicatat
        </span>
        <span className="text-[10px] text-slate-400">SIMAP Absensi</span>
      </div>
    </div>
  );
}