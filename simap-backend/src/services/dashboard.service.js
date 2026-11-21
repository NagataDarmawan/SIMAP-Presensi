const pool = require('../config/database');
const { reportAndDashboardQueries } = require('../database/queries');
const { getWibDateTime } = require('../utils/absensiHelper');

const getDashboardStats = async (todayDate) => {
  const targetDate = todayDate || getWibDateTime().tanggal;

  const [[[summary]], [recentAbsensi], [terlambatToday]] = await Promise.all([
    pool.execute(reportAndDashboardQueries.dashboardSummaryToday, [targetDate, targetDate]),
    pool.execute(reportAndDashboardQueries.recentAbsensiToday, [targetDate]),
    pool.execute(reportAndDashboardQueries.terlambatToday, [targetDate]),
  ]);

  return {
    pegawai: {
      total_aktif: Number(summary?.total_pegawai_aktif) || 0,
      total_nonaktif: Number(summary?.total_pegawai_nonaktif) || 0,
    },
    presensi_hari_ini: {
      hadir: Number(summary?.total_hadir) || 0,
      terlambat: Number(summary?.total_terlambat) || 0,
      izin: Number(summary?.total_izin) || 0,
      sakit: Number(summary?.total_sakit) || 0,
      cuti: Number(summary?.total_cuti) || 0,
      belum_absen: Number(summary?.total_belum_absen) || 0,
    },
    recent_absensi: recentAbsensi,
    terlambat_today: terlambatToday,
  };
};

module.exports = {
  getDashboardStats,
};