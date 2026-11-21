const riwayatService = require('../services/riwayat.service');

// GET /api/riwayat?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&status=HADIR&search=
const getRiwayat = async (req, res) => {
  try {
    const { startDate, endDate, status, search } = req.query;
    const data = await riwayatService.getRiwayatAbsensi(startDate, endDate, status, search);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data riwayat presensi.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/riwayat/:id
const getRiwayatById = async (req, res) => {
  try {
    const data = await riwayatService.getRiwayatAbsensiById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail riwayat presensi.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRiwayat,
  getRiwayatById,
};