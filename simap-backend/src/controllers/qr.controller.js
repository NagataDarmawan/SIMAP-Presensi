const qrService = require('../services/qr.service');

// GET /api/qr
const getAll = async (req, res) => {
  try {
    const data = await qrService.getAllQR();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/qr/:pegawaiId
const getByPegawaiId = async (req, res) => {
  try {
    const data = await qrService.getQRByPegawaiId(req.params.pegawaiId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 404).json({ success: false, message: error.message });
  }
};

// POST /api/qr/:pegawaiId/generate
const generate = async (req, res) => {
  try {
    const data = await qrService.generateQR(req.params.pegawaiId);
    return res.status(201).json({
      success: true,
      message: 'QR Code berhasil dibuat.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// POST /api/qr/:pegawaiId/regenerate
const regenerate = async (req, res) => {
  try {
    const data = await qrService.regenerateQR(req.params.pegawaiId);
    return res.status(200).json({
      success: true,
      message: 'QR Code berhasil diperbarui (QR lama sudah tidak berlaku).',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getByPegawaiId,
  generate,
  regenerate,
};