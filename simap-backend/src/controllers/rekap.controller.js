const rekapService = require('../services/rekap.service');

// GET /api/rekap/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await rekapService.getRekapSummary(startDate, endDate);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil ringkasan rekap kehadiran.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/rekap/pegawai?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getPerPegawai = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await rekapService.getRekapPerPegawai(startDate, endDate);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil rekapitulasi presensi per pegawai.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/rekap/keterlambatan?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getKeterlambatan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await rekapService.getMonitoringKeterlambatan(startDate, endDate);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data monitoring keterlambatan.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/rekap/dashboard-today?tanggal=YYYY-MM-DD
const getDashboardToday = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const data = await rekapService.getDashboardSummaryToday(tanggal);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil ringkasan dashboard hari ini.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/rekap/keterlambatan/:pegawaiId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getDetailKeterlambatan = async (req, res) => {
  try {
    const { pegawaiId } = req.params;
    const { startDate, endDate } = req.query;
    const data = await rekapService.getDetailKeterlambatanPegawai(pegawaiId, startDate, endDate);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail histori keterlambatan.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSummary,
  getPerPegawai,
  getKeterlambatan,
  getDashboardToday,
  getDetailKeterlambatan,
};