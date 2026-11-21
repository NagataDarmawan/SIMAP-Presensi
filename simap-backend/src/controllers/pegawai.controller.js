const pegawaiService = require('../services/pegawai.service');

// GET /api/pegawai
const getAll = async (req, res) => {
  try {
    const data = await pegawaiService.getAllPegawai(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/pegawai/:id
const getById = async (req, res) => {
  try {
    const data = await pegawaiService.getPegawaiById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 404).json({ success: false, message: error.message });
  }
};

// POST /api/pegawai
const create = async (req, res) => {
  try {
    const data = await pegawaiService.createPegawai(req.body);
    return res.status(201).json({
      success: true,
      message: 'Pegawai berhasil ditambahkan.',
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/pegawai/:id
const update = async (req, res) => {
  try {
    const data = await pegawaiService.updatePegawai(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Data pegawai berhasil diperbarui.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// PATCH /api/pegawai/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const data = await pegawaiService.updateStatusPegawai(req.params.id, status);
    return res.status(200).json({
      success: true,
      message: `Status pegawai berhasil diubah menjadi ${status}.`,
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// DELETE /api/pegawai/:id
const remove = async (req, res) => {
  try {
    const data = await pegawaiService.deletePegawai(req.params.id);
    return res.status(200).json({
      success: true,
      message: `Pegawai '${data.nama}' berhasil dihapus.`,
      data,
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
  updateStatus,
  remove,
};