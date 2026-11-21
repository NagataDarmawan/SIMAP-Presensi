'use client';

import { Pegawai, CreatePegawaiDto } from '@/types/pegawai';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface JadwalOption {
  id: number;
  nama_jadwal: string;
}

interface PegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPegawai: Pegawai | null;
  formData: CreatePegawaiDto;
  setFormData: React.Dispatch<React.SetStateAction<CreatePegawaiDto>>;
  jadwalOptions: JadwalOption[];
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const PegawaiModal = ({
  isOpen,
  onClose,
  editingPegawai,
  formData,
  setFormData,
  jadwalOptions,
  onSubmit,
  submitting,
}: PegawaiModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPegawai ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {editingPegawai && (
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-600">Kode Pegawai</span>
            <span className="font-mono text-xs font-bold tracking-wider text-slate-900">
              {editingPegawai.kode_pegawai}
            </span>
          </div>
        )}

        <Input
          label="Nama Lengkap"
          required
          placeholder="Masukkan nama pegawai"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-800">
              Jenis Kelamin
            </label>
            <select
              value={formData.jenis_kelamin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jenis_kelamin: e.target.value as Pegawai['jenis_kelamin'],
                })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <Input
            label="Jabatan"
            required
            placeholder="Staff / Admin"
            value={formData.jabatan}
            onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="No. Telepon"
            required
            placeholder="08123456789"
            value={formData.no_telepon}
            onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
          />
          <Input
            label="Tanggal Masuk"
            type="date"
            required
            value={formData.tanggal_masuk}
            onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-800">
            Jadwal Kerja
          </label>
          <select
            value={formData.jadwal_kerja_id}
            onChange={(e) =>
              setFormData({ ...formData, jadwal_kerja_id: Number(e.target.value) })
            }
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            {jadwalOptions.length === 0 ? (
              <option value={0}>Belum ada data jadwal kerja</option>
            ) : (
              jadwalOptions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama_jadwal}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-800">Alamat</label>
          <textarea
            required
            rows={2}
            placeholder="Alamat tempat tinggal"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="flex justify-end space-x-2 border-t border-slate-200 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            {editingPegawai ? 'Perbarui Data' : 'Simpan Pegawai'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};