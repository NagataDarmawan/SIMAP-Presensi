'use client';

import { Button } from '@/components/ui/Button';

export type JenisIzinCuti = 'IZIN' | 'SAKIT' | 'CUTI';

export interface IzinCutiFormBase {
  pegawai_id: number;
  jenis: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan?: string;
}

interface PegawaiOption {
  id: number;
  nama: string;
  kode_pegawai: string;
}

interface IzinCutiFormModalProps<T extends IzinCutiFormBase> {
  isOpen: boolean;
  editingId: number | null;
  pegawaiList: PegawaiOption[];
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const JENIS_OPTIONS: JenisIzinCuti[] = ['IZIN', 'SAKIT', 'CUTI'];

const FIELD_CLASS =
  'simap-input-focus w-full rounded-md border border-[var(--border-color)] bg-white p-2 text-sm text-[var(--text-main)]';

export function IzinCutiFormModal<T extends IzinCutiFormBase>({
  isOpen,
  editingId,
  pegawaiList,
  formData,
  setFormData,
  submitting,
  onClose,
  onSubmit,
}: IzinCutiFormModalProps<T>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-[var(--text-main)]">
          {editingId === null
            ? 'Tambah Catatan Izin / Sakit / Cuti'
            : 'Edit Catatan Izin / Sakit / Cuti'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-700">
              Pegawai
            </label>
            <select
              className={FIELD_CLASS}
              value={formData.pegawai_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pegawai_id: Number(e.target.value) }))
              }
              required
            >
              {pegawaiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} ({p.kode_pegawai})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-700">
              Jenis Ketidakhadiran
            </label>
            <select
              className={FIELD_CLASS}
              value={formData.jenis}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, jenis: e.target.value as T['jenis'] }))
              }
            >
              {JENIS_OPTIONS.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-700">
                Tgl Mulai
              </label>
              <input
                type="date"
                className={`${FIELD_CLASS} tabular-nums`}
                value={formData.tanggal_mulai}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tanggal_mulai: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-700">
                Tgl Selesai
              </label>
              <input
                type="date"
                className={`${FIELD_CLASS} tabular-nums`}
                value={formData.tanggal_selesai}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tanggal_selesai: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-700">
              Alasan
            </label>
            <textarea
              className={FIELD_CLASS}
              rows={3}
              value={formData.alasan ?? ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, alasan: e.target.value }))}
              placeholder="Keterangan atau alasan..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingId === null ? 'Simpan' : 'Simpan perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}