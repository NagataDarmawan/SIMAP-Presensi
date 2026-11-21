const crypto = require('crypto');
const QRCode = require('qrcode');

const generateQrPayload = async (pegawai) => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const qrImageBase64 = await QRCode.toDataURL(rawToken);

  return {
    tokenHash,
    response: {
      pegawai_id: pegawai.id,
      kode_pegawai: pegawai.kode_pegawai,
      nama: pegawai.nama,
      raw_token: rawToken,
      qr_image: qrImageBase64,
    },
  };
};

module.exports = { generateQrPayload };