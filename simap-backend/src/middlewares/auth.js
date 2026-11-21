/**
 * Middleware untuk memproteksi endpoint yang membutuhkan autentikasi Admin.
 * Memeriksa apakah data session user tersedia.
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan login terlebih dahulu.'
    });
  }

  // Sesi valid, lanjutkan ke controller/middleware berikutnya
  next();
};

module.exports = {
  requireAuth
};