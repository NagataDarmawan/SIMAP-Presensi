export type StatusAbsensi = 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'CUTI' | 'ALPHA';

export interface Absensi {
  id: number;
  pegawai_id: number;
  tanggal: string;
  jam_masuk?: string;
  jam_pulang?: string;
  status: StatusAbsensi;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
  pegawai?: {
    kode_pegawai: string;
    nama: string;
    jabatan: string;
  };
}

export interface ScanQrPayload {
  kode_qr: string;
  jenis: 'MASUK' | 'PULANG';
}

export interface ScanResultData {
  pegawai: string;
  kode_pegawai: string;
  jabatan?: string;
  jenis: 'ABSEN MASUK' | 'ABSEN PULANG';
  jam_masuk?: string | null;
  jam_pulang?: string | null;
  status: StatusAbsensi;
  menit_terlambat?: number;
  status_pulang?: 'PULANG_CEPAT' | 'TEPAT_WAKTU' | string | null;
  menit_pulang_cepat?: number | null;
  keterangan?: string;
}

export interface KoreksiAbsensiDto {
  status: StatusAbsensi;
  jam_masuk?: string;
  jam_pulang?: string;
  keterangan?: string;
}