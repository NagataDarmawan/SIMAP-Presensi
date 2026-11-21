const monitoringService = require('../services/monitoring.service');

// GET /api/monitoring?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
const getMonitoring = async (req, res) => {
  try {
    const startDate = req.query.start_date || req.query.startDate;
    const endDate = req.query.end_date || req.query.endDate;

    const data = await monitoringService.getMonitoringKeterlambatan(startDate, endDate);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMonitoring,
};