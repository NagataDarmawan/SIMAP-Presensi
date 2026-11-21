export interface JadwalKerja {
  id: number;
  nama_jadwal: string;
  hari_kerja: string; // misal: "Senin - Jumat" atau "Senin - Sabtu"
  jam_masuk: string;
  jam_pulang: string;
  toleransi_terlambat: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateJadwalDto = Omit<JadwalKerja, 'id' | 'created_at' | 'updated_at'>;
export type UpdateJadwalDto = Partial<CreateJadwalDto>;