export type JenisKetidakhadiran = 'IZIN' | 'SAKIT' | 'CUTI';
export type StatusIzinCuti = 'AKTIF' | 'MENUNGGU_KONFIRMASI' | 'SELESAI' | 'DIBATALKAN';

export interface IzinCuti {
  id: number;
  pegawai_id: number;
  kode_pegawai?: string;
  nama_pegawai?: string;
  jabatan?: string;
  jenis: JenisKetidakhadiran;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan?: string;
  status?: StatusIzinCuti;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIzinCutiDto {
  pegawai_id: number;
  jenis: JenisKetidakhadiran;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan?: string;
}

export interface IzinCutiQueryParams {
  jenis?: string;
  pegawai_id?: number;
}