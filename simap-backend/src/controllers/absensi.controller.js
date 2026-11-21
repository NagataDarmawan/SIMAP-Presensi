const absensiService = require('../services/absensi.service');

// POST /api/absensi/scan
const scanQR = async (req, res) => {
  try {
    const rawToken = req.body.kode_qr || req.body.token;
    const { jenis } = req.body;

    const result = await absensiService.processScanAbsensi(rawToken, jenis);

    return res.status(200).json({
      success: true,
      message: `Berhasil mencatat ${result.jenis} untuk ${result.pegawai}.`,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/absensi/harian?tanggal=YYYY-MM-DD&search=
const getHarian = async (req, res) => {
  try {
    const data = await absensiService.getHarianAbsensi(req.query);
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data presensi harian pegawai.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// POST /api/absensi/manual
const createManual = async (req, res) => {
  try {
    const data = await absensiService.createManualAbsensi(req.body);
    return res.status(201).json({
      success: true,
      message: `Presensi manual (${data.status}) untuk ${data.nama} berhasil disimpan.`,
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// POST /api/absensi/auto-alpha
const autoAlpha = async (req, res) => {
  try {
    const data = await absensiService.markAutoAlpha(req.body);
    return res.status(200).json({
      success: true,
      message:
        data.total_ditandai_alpha > 0
          ? `${data.total_ditandai_alpha} pegawai berhasil ditandai ALPHA.`
          : 'Tidak ada pegawai baru yang perlu ditandai ALPHA.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// GET /api/absensi
const getHistory = async (req, res) => {
  try {
    const data = await absensiService.getHistoryAbsensi(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/absensi/:id
const getById = async (req, res) => {
  try {
    const data = await absensiService.getAbsensiById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 404).json({ success: false, message: error.message });
  }
};

// PUT /api/absensi/:id
const correct = async (req, res) => {
  try {
    const data = await absensiService.correctAbsensi(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Koreksi data presensi berhasil disimpan.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = {
  scanQR,
  getHarian,
  createManual,
  autoAlpha,
  getHistory,
  getById,
  correct,
};