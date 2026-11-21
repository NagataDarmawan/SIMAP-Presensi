const { getWibDateTime } = require('./absensiHelper');

const DAYS_INDO = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
const VALID_JENIS_IZIN = ['IZIN', 'SAKIT', 'CUTI'];

const parseHariKerja = (hariKerjaSet) => {
  if (!hariKerjaSet || typeof hariKerjaSet !== 'string') return [];
  const selectedDays = new Set();

  for (const entry of hariKerjaSet.split(/[,;]/)) {
    const range = entry.trim().toUpperCase().split(/\s*[-–—]\s*/);
    const start = DAYS_INDO.indexOf(range[0]);
    if (start === -1) continue;

    if (range.length === 1) {
      selectedDays.add(range[0]);
      continue;
    }

    const end = range.length === 2 ? DAYS_INDO.indexOf(range[1]) : -1;
    if (end === -1) continue;

    for (let day = start; ; day = (day + 1) % DAYS_INDO.length) {
      selectedDays.add(DAYS_INDO[day]);
      if (day === end) break;
    }
  }

  return DAYS_INDO.filter((day) => selectedDays.has(day));
};

const parseDateOnly = (value) => {
  const dateString = String(value).slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) throw new Error('Format tanggal harus YYYY-MM-DD.');

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('Tanggal tidak valid.');
  }
  return date;
};

const formatDateOnly = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getJakartaDate = () => getWibDateTime().tanggal;

const getWorkDates = (startDate, endDate, hariKerjaList) => {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (start > end) throw new Error('Tanggal mulai tidak boleh lebih besar dari tanggal selesai.');

  const dates = [];
  for (const current = new Date(start); current <= end; current.setUTCDate(current.getUTCDate() + 1)) {
    if (hariKerjaList.includes(DAYS_INDO[current.getUTCDay()])) {
      dates.push(formatDateOnly(current));
    }
  }
  return dates;
};

const validateIzinCutiInput = ({ pegawai_id, jenis, tanggal_mulai, tanggal_selesai } = {}) => {
  const employeeId = Number(pegawai_id);
  if (!Number.isInteger(employeeId) || employeeId <= 0 || !jenis || !tanggal_mulai || !tanggal_selesai) {
    throw new Error('Pegawai, jenis ketidakhadiran, tanggal mulai, dan tanggal selesai wajib diisi.');
  }

  const normalizedJenis = String(jenis).trim().toUpperCase();
  if (!VALID_JENIS_IZIN.includes(normalizedJenis)) {
    throw new Error("Jenis ketidakhadiran harus 'IZIN', 'SAKIT', atau 'CUTI'.");
  }

  return {
    employeeId,
    normalizedJenis,
    startFormatted: formatDateOnly(parseDateOnly(tanggal_mulai)),
    endFormatted: formatDateOnly(parseDateOnly(tanggal_selesai)),
  };
};

module.exports = {
  parseHariKerja,
  parseDateOnly,
  formatDateOnly,
  getJakartaDate,
  getWorkDates,
  validateIzinCutiInput,
};