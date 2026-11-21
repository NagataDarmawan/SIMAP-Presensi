export type StatusPresensiHarian =
  | 'BELUM_PRESENSI'
  | 'HADIR'
  | 'TERLAMBAT'
  | 'IZIN'
  | 'SAKIT'
  | 'CUTI'
  | 'ALPHA';

export interface PresensiHarianItem {
  pegawai_id: number;
  kode_pegawai: string;
  nama: string;
  jabatan: string;
  nama_jadwal: string;
  hari_kerja: string;
  jam_masuk_jadwal: string;
  jam_pulang_jadwal: string;
  toleransi_terlambat: number;
  absensi_id: number | null;
  tanggal: string;
  sudah_presensi: boolean;
  lewat_batas_pulang: boolean;
  status: StatusPresensiHarian;
  jam_masuk: string | null;
  jam_pulang: string | null;
  menit_terlambat: number;
  keterangan: string | null;
  catatan_izin_cuti_id: number | null;
}

export interface PresensiHarianSummary {
  total_terjadwal: number;
  sudah_presensi: number;
  belum_presensi: number;
  lewat_batas_pulang: number;
}

export interface PresensiHarianResponse {
  tanggal: string;
  summary: PresensiHarianSummary;
  items: PresensiHarianItem[];
}

export interface CreateManualPresensiPayload {
  pegawai_id: number;
  tanggal: string;
  status: 'HADIR' | 'TERLAMBAT' | 'ALPHA';
  jam_masuk?: string | null;
  jam_pulang?: string | null;
  keterangan?: string;
}

export interface KoreksiPresensiHarianPayload {
  status: Exclude<StatusPresensiHarian, 'BELUM_PRESENSI'>;
  jam_masuk?: string | null;
  jam_pulang?: string | null;
}