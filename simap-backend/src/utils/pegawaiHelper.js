const crypto = require('crypto');

const SAFE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const KODE_LENGTH = 6;

const normalizeJenisKelamin = (value) => {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized === 'L' || normalized === 'LAKI-LAKI') return 'Laki-laki';
  if (normalized === 'P' || normalized === 'PEREMPUAN') return 'Perempuan';
  throw new Error("Jenis kelamin harus 'Laki-laki' atau 'Perempuan'.");
};

const generateRandomKodePegawai = () => {
  const bytes = crypto.randomBytes(KODE_LENGTH);
  let kode = '';
  for (let i = 0; i < KODE_LENGTH; i++) {
    kode += SAFE_CHARSET[bytes[i] % SAFE_CHARSET.length];
  }
  return kode;
};

module.exports = {
  normalizeJenisKelamin,
  generateRandomKodePegawai,
};