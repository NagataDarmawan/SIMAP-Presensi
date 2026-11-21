const jadwalService = require('../services/jadwal.service');

// GET /api/jadwal
const getAll = async (req, res) => {
  try {
    const data = await jadwalService.getAllJadwal();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jadwal/:id
const getById = async (req, res) => {
  try {
    const data = await jadwalService.getJadwalById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 404).json({ success: false, message: error.message });
  }
};

// POST /api/jadwal
const create = async (req, res) => {
  try {
    const data = await jadwalService.createJadwal(req.body);
    return res.status(201).json({
      success: true,
      message: 'Jadwal kerja berhasil ditambahkan.',
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/jadwal/:id
const update = async (req, res) => {
  try {
    const data = await jadwalService.updateJadwal(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Jadwal kerja berhasil diperbarui.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// DELETE /api/jadwal/:id
const remove = async (req, res) => {
  try {
    await jadwalService.deleteJadwal(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Jadwal kerja berhasil dihapus.',
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};