const pool = require('../config/database');
const { reportAndDashboardQueries } = require('../database/queries');

const getMonitoringKeterlambatan = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    const err = new Error('Tanggal mulai (startDate) dan tanggal selesai (endDate) wajib diisi.');
    err.status = 400;
    throw err;
  }

  if (startDate > endDate) {
    const err = new Error('Tanggal mulai (startDate) tidak boleh melebihi tanggal akhir (endDate).');
    err.status = 400;
    throw err;
  }

  const [rows] = await pool.execute(reportAndDashboardQueries.monitoringKeterlambatan, [
    startDate,
    endDate,
  ]);

  return {
    periode: { start_date: startDate, end_date: endDate },
    peringkat_terlambat: rows,
  };
};

module.exports = {
  getMonitoringKeterlambatan,
};