const izinCutiService = require('../services/izin-cuti.service');

const getAdminId = (req) => req.session?.user?.id || req.user?.id || 1;

// GET /api/izin-cuti
const getAll = async (req, res) => {
  try {
    const data = await izinCutiService.getAllIzinCuti(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/izin-cuti/:id
const getById = async (req, res) => {
  try {
    const data = await izinCutiService.getIzinCutiById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 404).json({ success: false, message: error.message });
  }
};

// POST /api/izin-cuti
const create = async (req, res) => {
  try {
    const data = await izinCutiService.createIzinCuti(req.body, getAdminId(req));
    return res.status(201).json({
      success: true,
      message: 'Catatan ketidakhadiran berhasil disimpan dan terintegrasi ke presensi.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// PUT /api/izin-cuti/:id
const update = async (req, res) => {
  try {
    const data = await izinCutiService.updateIzinCuti(req.params.id, req.body, getAdminId(req));
    return res.status(200).json({
      success: true,
      message: 'Catatan izin/cuti berhasil diperbarui.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// PATCH /api/izin-cuti/:id/batal
const cancel = async (req, res) => {
  try {
    const data = await izinCutiService.cancelIzinCuti(req.params.id, getAdminId(req));
    return res.status(200).json({
      success: true,
      message: 'Catatan ketidakhadiran berhasil dibatalkan.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// PATCH /api/izin-cuti/:id/perpanjang
const extend = async (req, res) => {
  try {
    const data = await izinCutiService.extendIzinCuti(
      req.params.id,
      req.body?.tanggal_selesai,
      getAdminId(req)
    );
    return res.status(200).json({
      success: true,
      message: 'Tanggal izin/cuti berhasil diperpanjang.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// PATCH /api/izin-cuti/:id/selesai
const complete = async (req, res) => {
  try {
    const data = await izinCutiService.completeIzinCuti(req.params.id, getAdminId(req));
    return res.status(200).json({
      success: true,
      message: 'Pengajuan izin/cuti berhasil ditandai selesai.',
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
  cancel,
  extend,
  complete,
};