const authService = require('../services/auth.service');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminData = await authService.loginAdmin(username, password);

    req.session.user = {
      id: adminData.id,
      username: adminData.username,
      nama_lengkap: adminData.nama_lengkap,
      nama: adminData.nama_lengkap,
    };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Gagal menyimpan sesi ke database.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        data: req.session.user,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, password, nama_lengkap } = req.body;
    const data = await authService.registerAdmin(username, password, nama_lengkap);

    return res.status(201).json({
      success: true,
      message: 'Registrasi admin berhasil.',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { username, new_password } = req.body;
    await authService.resetPassword(username, new_password);

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diperbarui. Silakan login dengan password baru.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Gagal melakukan logout.',
      });
    }
    res.clearCookie('simap_sid');
    return res.status(200).json({
      success: true,
      message: 'Logout berhasil.',
    });
  });
};

// GET /api/auth/me
const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.session.user,
  });
};

module.exports = {
  login,
  register,
  resetPassword,
  logout,
  getProfile,
};