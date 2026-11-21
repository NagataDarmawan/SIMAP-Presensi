'use client';

import { JadwalKerja, CreateJadwalDto } from '@/types/jadwal';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface JadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJadwal: JadwalKerja | null;
  formData: CreateJadwalDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateJadwalDto>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const JadwalModal = ({
  isOpen,
  onClose,
  editingJadwal,
  formData,
  setFormData,
  onSubmit,
  submitting,
}: JadwalModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingJadwal ? 'Edit Jadwal Kerja' : 'Tambah Jadwal Kerja'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Nama Jadwal"
          required
          placeholder="contoh: Non-Shift Regular / Shift Pagi"
          value={formData.nama_jadwal}
          onChange={(e) => setFormData({ ...formData, nama_jadwal: e.target.value })}
        />

        {/* Input Hari Kerja (Wajib) */}
        <Input
          label="Hari Kerja"
          required
          placeholder="contoh: Senin - Jumat / Senin - Sabtu"
          value={formData.hari_kerja}
          onChange={(e) => setFormData({ ...formData, hari_kerja: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Jam Masuk"
            type="time"
            required
            value={formData.jam_masuk}
            onChange={(e) => setFormData({ ...formData, jam_masuk: e.target.value })}
          />
          <Input
            label="Jam Pulang"
            type="time"
            required
            value={formData.jam_pulang}
            onChange={(e) => setFormData({ ...formData, jam_pulang: e.target.value })}
          />
        </div>

        <Input
          label="Toleransi Keterlambatan (Menit)"
          type="number"
          required
          min={0}
          placeholder="15"
          value={formData.toleransi_terlambat}
          onChange={(e) =>
            setFormData({ ...formData, toleransi_terlambat: Number(e.target.value) })
          }
        />

        <div className="flex justify-end space-x-2 border-t border-[var(--border-color)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            {editingJadwal ? 'Perbarui Jadwal' : 'Simpan Jadwal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};