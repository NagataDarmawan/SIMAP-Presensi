export interface Pegawai {
  id: number;
  kode_pegawai: string;
  kode_qr: string; // Token QR Code statis permanen
  nama: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat?: string;
  no_telepon?: string;
  jabatan?: string;
  tanggal_masuk: string;
  jadwal_kerja_id: number;
  status: 'AKTIF' | 'NONAKTIF';
  created_at?: string;
  updated_at?: string;
  nama_jadwal?: string;
}

// Omit kode_qr & kode_pegawai karena di-generate otomatis oleh server saat registrasi
export type CreatePegawaiDto = Omit<Pegawai, 'id' | 'status' | 'kode_qr' | 'kode_pegawai'> & {
  kode_pegawai?: string;
};
export type UpdatePegawaiDto = Partial<CreatePegawaiDto>;