// Response standar dari API Express backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// 1. Stat Card Dashboard Hari Ini
export interface DashboardTodaySummary {
  total_pegawai_aktif: number;
  total_pegawai_nonaktif: number;
  total_hadir: number;
  total_terlambat: number;
  total_izin: number;
  total_sakit: number;
  total_cuti: number;
}

// 2. Ringkasan Rekap Global Periode
export interface RekapGlobalSummary {
  total_pegawai_aktif: number;
  total_hadir: number;
  total_terlambat: number;
  total_izin: number;
  total_sakit: number;
  total_cuti: number;
  total_menit_terlambat: number;
}

// 3. Detail Rekapitulasi Per Pegawai
export interface RekapPegawai {
  pegawai_id: number;
  kode_pegawai: string;
  nama: string;
  jabatan: string;
  total_hadir: number;
  total_terlambat: number;
  total_izin: number;
  total_sakit: number;
  total_cuti: number;
  total_alpha: number;
  total_menit_terlambat: number;
}

// 4. Monitoring Keterlambatan Pegawai
export interface MonitoringKeterlambatan {
  pegawai_id: number;
  kode_pegawai: string;
  nama: string;
  jabatan: string;
  frekuensi_terlambat: number;
  total_menit_terlambat: number;
}

export interface DetailKeterlambatan {
  absensi_id: number;
  tanggal: string;
  jam_masuk_aktual: string;
  jam_masuk_jadwal: string;
  menit_terlambat: number;
}

// Query Parameter untuk Filter Tanggal
export interface DateRangeFilter {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}