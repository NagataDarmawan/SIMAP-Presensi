export interface DashboardStats {
  pegawai: {
    total_aktif: number;
    total_nonaktif: number;
  };
  presensi_hari_ini: {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    cuti: number;
    belum_absen: number;
  };
  recent_absensi: Array<{
    absensi_id: number;
    nama_pegawai: string;
    kode_pegawai: string;
    jabatan: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status: string;
    menit_terlambat: number;
  }>;
  terlambat_today: Array<{
    absensi_id: number;
    nama_pegawai: string;
    kode_pegawai: string;
    jabatan: string;
    jam_masuk: string;
    menit_terlambat: number;
  }>;
}