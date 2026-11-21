"use client";

import { useState } from "react";
import { RiwayatAbsensi } from "@/types/riwayat";
import { KoreksiAbsensiPayload } from "@/hooks/useRiwayat";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface KoreksiRiwayatModalProps {
  item: RiwayatAbsensi | null;
  onClose: () => void;
  onSubmitKoreksi: (
    absensiId: number,
    payload: KoreksiAbsensiPayload,
  ) => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const STATUS_OPTIONS = [
  "HADIR",
  "TERLAMBAT",
  "IZIN",
  "SAKIT",
  "CUTI",
  "ALPHA",
] as const;
const NON_HADIR_STATUSES = new Set(["IZIN", "SAKIT", "CUTI", "ALPHA"]);

const INPUT_CLASS =
  "simap-input-focus w-full rounded-lg border border-[var(--border-color)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-main)]";

function formatTimeWithSeconds(val: string): string | null {
  if (!val) return null;
  return val.length === 5 ? `${val}:00` : val;
}

interface KoreksiFormProps {
  item: RiwayatAbsensi;
  onClose: () => void;
  onSubmitKoreksi: (
    absensiId: number,
    payload: KoreksiAbsensiPayload,
  ) => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

function KoreksiForm({
  item,
  onClose,
  onSubmitKoreksi,
  onSuccess,
  onError,
}: KoreksiFormProps) {
  const [status, setStatus] = useState(item.status || "HADIR");
  const [jamMasuk, setJamMasuk] = useState(item.jam_masuk || "");
  const [jamPulang, setJamPulang] = useState(item.jam_pulang || "");
  const [submitting, setSubmitting] = useState(false);

  const isNonHadirSelected = NON_HADIR_STATUSES.has(status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmitKoreksi(item.absensi_id, {
        status,
        jam_masuk: isNonHadirSelected ? null : formatTimeWithSeconds(jamMasuk),
        jam_pulang: isNonHadirSelected
          ? null
          : formatTimeWithSeconds(jamPulang),
      });

      onClose();
      onSuccess(`Data presensi ${item.nama_pegawai} berhasil dikoreksi.`);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan koreksi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
      <div>
        <label className="mb-1 block font-semibold text-slate-700">
          Status Kehadiran <span className="text-rose-500">*</span>
        </label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as RiwayatAbsensi["status"])
          }
          className={INPUT_CLASS}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {!isNonHadirSelected && (
          <p className="mt-1 text-[11px] text-slate-400">
            Status, menit keterlambatan, dan keterangan akan dihitung ulang
            otomatis oleh sistem berdasarkan jadwal kerja.
          </p>
        )}
      </div>

      {!isNonHadirSelected && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Jam Masuk Aktual
            </label>
            <input
              type="time"
              step="1"
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

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={submitting}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={submitting}>
          Simpan Koreksi
        </Button>
      </div>
    </form>
  );
}

export function KoreksiRiwayatModal({
  item,
  onClose,
  onSubmitKoreksi,
  onSuccess,
  onError,
}: KoreksiRiwayatModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">
              Koreksi Data Presensi
            </h3>
            <p className="text-xs text-slate-500">
              {item.nama_pegawai} ({item.kode_pegawai}) • {item.tanggal}
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

        <KoreksiForm
          key={item.absensi_id}
          item={item}
          onClose={onClose}
          onSubmitKoreksi={onSubmitKoreksi}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </div>
  );
}
