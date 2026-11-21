'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PresensiHarianItem,
  CreateManualPresensiPayload,
  KoreksiPresensiHarianPayload,
  StatusPresensiHarian,
} from '@/types/presensiHarian';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface PresensiManualModalProps {
  item: PresensiHarianItem | null;
  onClose: () => void;
  onSubmitManual: (payload: CreateManualPresensiPayload) => Promise<void>;
  onSubmitCorrection: (
    absensiId: number,
    namaPegawai: string,
    payload: KoreksiPresensiHarianPayload
  ) => Promise<void>;
}

const PRESENSI_STATUS_OPTIONS = ['HADIR', 'ALPHA'] as const;

const INPUT_CLASS =
  'simap-input-focus w-full rounded-lg border border-[var(--border-color)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-main)]';

function formatTimeWithSeconds(val: string): string | null {
  if (!val) return null;
  return val.length === 5 ? `${val}:00` : val;
}

function PresensiForm({
  item,
  onClose,
  onSubmitManual,
  onSubmitCorrection,
}: {
  item: PresensiHarianItem;
  onClose: () => void;
  onSubmitManual: (payload: CreateManualPresensiPayload) => Promise<void>;
  onSubmitCorrection: (
    absensiId: number,
    namaPegawai: string,
    payload: KoreksiPresensiHarianPayload
  ) => Promise<void>;
}) {
  const isEditMode = item.sudah_presensi && item.absensi_id !== null;
  const initialStatus = isEditMode && item.status === 'ALPHA' ? 'ALPHA' : 'HADIR';

  const [status, setStatus] = useState<'HADIR' | 'ALPHA'>(initialStatus);
  const [jamMasuk, setJamMasuk] = useState<string>(
    isEditMode ? item.jam_masuk || item.jam_masuk_jadwal || '08:00:00' : item.jam_masuk_jadwal || '08:00:00'
  );
  const [jamPulang, setJamPulang] = useState<string>(
    isEditMode ? item.jam_pulang || '' : ''
  );
  const [keterangan, setKeterangan] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const isAlphaSelected = status === 'ALPHA';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode && item.absensi_id !== null) {
        await onSubmitCorrection(item.absensi_id, item.nama, {
          status: status as Exclude<StatusPresensiHarian, 'BELUM_PRESENSI'>,
          jam_masuk: isAlphaSelected ? null : formatTimeWithSeconds(jamMasuk),
          jam_pulang: isAlphaSelected ? null : formatTimeWithSeconds(jamPulang),
        });
      } else {
        await onSubmitManual({
          pegawai_id: item.pegawai_id,
          tanggal: item.tanggal,
          status,
          jam_masuk: isAlphaSelected ? null : formatTimeWithSeconds(jamMasuk),
          jam_pulang: isAlphaSelected ? null : formatTimeWithSeconds(jamPulang),
          keterangan: keterangan.trim() || undefined,
        });
      }
      onClose();
    } catch {
      // Error sudah ditangani melalui toast di hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600">Jadwal Kerja ({item.nama_jadwal})</span>
          <span className="font-bold tabular-nums text-[var(--text-main)]">
            {item.jam_masuk_jadwal} - {item.jam_pulang_jadwal}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Toleransi keterlambatan: {item.toleransi_terlambat} menit
        </p>
      </div>

      <div>
        <label className="mb-1 block font-semibold text-slate-700">
          Status Kehadiran <span className="text-rose-500">*</span>
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'HADIR' | 'ALPHA')}
          className={INPUT_CLASS}
        >
          {PRESENSI_STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'HADIR'
                ? 'HADIR / TERLAMBAT (Otomatis sesuai jam masuk)'
                : 'ALPHA (Tanpa Keterangan)'}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-slate-400">
          Untuk pengajuan <span className="font-semibold text-slate-600">Izin, Sakit, atau Cuti</span>, silakan input melalui menu{' '}
          <Link href="/izin-cuti" className="font-semibold text-[var(--brand)] underline">
            Izin & Cuti
          </Link>
          .
        </p>
      </div>

      {!isAlphaSelected && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Jam Masuk Aktual <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              step="1"
              required
              value={jamMasuk}
              onChange={(e) => setJamMasuk(e.target.value)}
              className={`${INPUT_CLASS} tabular-nums`}
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Jam Pulang Aktual
            </label>
            <input
              type="time"
              step="1"
              value={jamPulang}
              onChange={(e) => setJamPulang(e.target.value)}
              className={`${INPUT_CLASS} tabular-nums`}
            />
          </div>
        </div>
      )}

      {!isEditMode && (
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            Catatan / Alasan Input Manual
          </label>
          <input
            type="text"
            placeholder={
              isAlphaSelected
                ? 'Contoh: Tidak hadir tanpa pemberitahuan'
                : 'Contoh: Kartu QR tertinggal / kendala kamera'
            }
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={submitting}>
          {isEditMode ? 'Simpan Koreksi' : 'Simpan Presensi'}
        </Button>
      </div>
    </form>
  );
}

export function PresensiManualModal({
  item,
  onClose,
  onSubmitManual,
  onSubmitCorrection,
}: PresensiManualModalProps) {
  if (!item) return null;

  const isEditMode = item.sudah_presensi && item.absensi_id !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">
              {isEditMode ? 'Koreksi Presensi Harian' : 'Input Presensi Manual'}
            </h3>
            <p className="text-xs text-slate-500">
              {item.nama} ({item.kode_pegawai}) • {item.tanggal}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <PresensiForm
          key={`${item.pegawai_id}-${item.tanggal}-${item.absensi_id ?? 'new'}`}
          item={item}
          onClose={onClose}
          onSubmitManual={onSubmitManual}
          onSubmitCorrection={onSubmitCorrection}
        />
      </div>
    </div>
  );
}