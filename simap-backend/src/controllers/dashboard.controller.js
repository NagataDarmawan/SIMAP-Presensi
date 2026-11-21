const dashboardService = require('../services/dashboard.service');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats(req.query.tanggal);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik dashboard.',
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStats,
};