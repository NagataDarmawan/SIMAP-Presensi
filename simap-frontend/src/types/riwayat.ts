import { ApiResponse, DateRangeFilter } from '@/types/rekap';

export interface RiwayatAbsensi {
  absensi_id: number;
  tanggal: string;
  pegawai_id: number;
  kode_pegawai: string;
  nama_pegawai: string;
  jabatan: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
  status: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'CUTI' | 'ALPHA';
  menit_terlambat: number;
  nama_jadwal: string | null;
  jam_masuk_jadwal: string | null;
  jam_pulang_jadwal: string | null;
}

export interface RiwayatFilter extends DateRangeFilter {
  status?: string;
  search?: string;
}