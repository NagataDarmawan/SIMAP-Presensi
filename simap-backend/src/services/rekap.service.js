const pool = require('../config/database');
const { reportAndDashboardQueries } = require('../database/queries');
const { getWibDateTime } = require('../utils/absensiHelper');

const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    const err = new Error('Parameter startDate dan endDate wajib diisi.');
    err.status = 400;
    throw err;
  }

  if (startDate > endDate) {
    const err = new Error('Tanggal mulai (startDate) tidak boleh melebihi tanggal akhir (endDate).');
    err.status = 400;
    throw err;
  }
};

const getRekapSummary = async (startDate, endDate) => {
  validateDateRange(startDate, endDate);
  const [rows] = await pool.execute(reportAndDashboardQueries.rekapKehadiranSummary, [
    startDate,
    endDate,
  ]);
  return rows[0] || {};
};

const getRekapPerPegawai = async (startDate, endDate) => {
  validateDateRange(startDate, endDate);
  const [rows] = await pool.execute(reportAndDashboardQueries.rekapPerPegawai, [
    startDate,
    endDate,
  ]);
  return rows;
};

const getMonitoringKeterlambatan = async (startDate, endDate) => {
  validateDateRange(startDate, endDate);
  const [rows] = await pool.execute(reportAndDashboardQueries.monitoringKeterlambatan, [
    startDate,
    endDate,
  ]);
  return rows;
};

const getDashboardSummaryToday = async (tanggal) => {
  const targetDate = tanggal || getWibDateTime().tanggal;
  const [rows] = await pool.execute(reportAndDashboardQueries.dashboardSummaryToday, [
    targetDate,
    targetDate,
  ]);
  return rows[0] || {};
};

const getDetailKeterlambatanPegawai = async (pegawaiId, startDate, endDate) => {
  validateDateRange(startDate, endDate);
  const [rows] = await pool.execute(reportAndDashboardQueries.detailKeterlambatanPegawai, [
    pegawaiId,
    startDate,
    endDate,
  ]);
  return rows || [];
};

module.exports = {
  getRekapSummary,
  getRekapPerPegawai,
  getMonitoringKeterlambatan,
  getDashboardSummaryToday,
  getDetailKeterlambatanPegawai,
};