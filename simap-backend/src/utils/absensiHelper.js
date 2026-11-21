const { parseHariKerja, parseDateOnly } = require('./izinCutiHelper');

const DEFAULT_JADWAL_MASUK = '08:00:00';
const DEFAULT_JADWAL_PULANG = '17:00:00';
const MIN_JEDA_PULANG_MENIT = 30;
const NON_HADIR_STATUSES = ['IZIN', 'SAKIT', 'CUTI', 'ALPHA'];
const IZIN_CUTI_STATUSES = ['IZIN', 'SAKIT', 'CUTI'];
const MANUAL_ALLOWED_STATUSES = ['HADIR', 'TERLAMBAT', 'ALPHA'];
const DAYS_INDO = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];

const getWibDateTime = (dateInput = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(dateInput)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  const hour = parts.hour === '24' ? '00' : parts.hour;
  return {
    tanggal: `${parts.year}-${parts.month}-${parts.day}`,
    jam: `${hour}:${parts.minute}:${parts.second}`,
  };
};

const isScheduledOnDate = (hariKerjaSet, dateStr) => {
  const hariKerjaList = parseHariKerja(hariKerjaSet);
  if (hariKerjaList.length === 0) return false;
  const parsedDate = parseDateOnly(dateStr);
  const dayName = DAYS_INDO[parsedDate.getUTCDay()];
  return hariKerjaList.includes(dayName);
};

const parseTimeToSeconds = (timeStr) => {
  const [h = 0, m = 0, s = 0] = String(timeStr).split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

const evaluateMasukStatus = (jamAktual, jamJadwal, toleransiMenit) => {
  const jadwal = jamJadwal || DEFAULT_JADWAL_MASUK;
  const batasMenit = Math.floor(parseTimeToSeconds(jadwal) / 60) + (Number(toleransiMenit) || 0);
  const aktualMenit = Math.floor(parseTimeToSeconds(jamAktual) / 60);

  if (aktualMenit > batasMenit) {
    const menitTerlambat = aktualMenit - batasMenit;
    return {
      status: 'TERLAMBAT',
      menit_terlambat: menitTerlambat,
      keterangan: `Terlambat +${menitTerlambat} menit (Jadwal: ${jadwal})`,
    };
  }

  return {
    status: 'HADIR',
    menit_terlambat: 0,
    keterangan: `Hadir tepat waktu (Jadwal: ${jadwal})`,
  };
};

const evaluatePulangStatus = (jamAktual, jamJadwal) => {
  const jadwal = jamJadwal || DEFAULT_JADWAL_PULANG;
  const jadwalMenit = Math.floor(parseTimeToSeconds(jadwal) / 60);
  const aktualMenit = Math.floor(parseTimeToSeconds(jamAktual) / 60);

  if (aktualMenit < jadwalMenit) {
    const menitPulangCepat = jadwalMenit - aktualMenit;
    return {
      status_pulang: 'PULANG_CEPAT',
      menit_pulang_cepat: menitPulangCepat,
      keterangan: `Pulang lebih awal ${menitPulangCepat} menit (Jadwal: ${jadwal})`,
    };
  }

  return {
    status_pulang: 'PULANG_TEPAT_WAKTU',
    menit_pulang_cepat: 0,
    keterangan: `Pulang tepat waktu (Jadwal: ${jadwal})`,
  };
};

const validateJedaPulang = (jamMasuk, jamPulang) => {
  const selisihDetik = parseTimeToSeconds(jamPulang) - parseTimeToSeconds(jamMasuk);
  const minJedaDetik = MIN_JEDA_PULANG_MENIT * 60;

  if (selisihDetik < minJedaDetik) {
    const sisaMenit = Math.ceil((minJedaDetik - Math.max(selisihDetik, 0)) / 60);
    throw new Error(
      `Presensi pulang belum dapat dilakukan. Minimal jeda ${MIN_JEDA_PULANG_MENIT} menit setelah presensi masuk pukul ${jamMasuk} (tunggu ${sisaMenit} menit lagi).`
    );
  }
};

const buildManualEntryPayload = (jadwal, { status, jam_masuk, jam_pulang, keterangan }) => {
  const normalizedStatus = String(status || '').trim().toUpperCase();
  if (!MANUAL_ALLOWED_STATUSES.includes(normalizedStatus)) {
    throw new Error(
      `Status input manual harus salah satu dari: ${MANUAL_ALLOWED_STATUSES.join(', ')}. Untuk IZIN/SAKIT/CUTI gunakan modul Izin & Cuti.`
    );
  }

  const customNote = typeof keterangan === 'string' && keterangan.trim() ? keterangan.trim() : '';

  if (normalizedStatus === 'ALPHA') {
    return {
      jam_masuk: null,
      jam_pulang: null,
      status: 'ALPHA',
      menit_terlambat: 0,
      keterangan: customNote || 'Tanpa keterangan (Input Manual Admin)',
    };
  }

  const jamMasukFinal = jam_masuk ? String(jam_masuk).trim() : jadwal.jam_masuk_jadwal || DEFAULT_JADWAL_MASUK;
  const jamPulangFinal = jam_pulang ? String(jam_pulang).trim() : null;

  if (jamPulangFinal && parseTimeToSeconds(jamPulangFinal) <= parseTimeToSeconds(jamMasukFinal)) {
    throw new Error('Jam pulang tidak boleh lebih awal atau sama dengan jam masuk.');
  }

  const evalMasuk = evaluateMasukStatus(
    jamMasukFinal,
    jadwal.jam_masuk_jadwal,
    jadwal.toleransi_terlambat
  );

  const notes = [evalMasuk.keterangan];
  if (jamPulangFinal) {
    const evalPulang = evaluatePulangStatus(jamPulangFinal, jadwal.jam_pulang_jadwal);
    notes.push(evalPulang.keterangan);
  }

  const baseNote = `${notes.join(' | ')} (Input Manual Admin)`;

  return {
    jam_masuk: jamMasukFinal,
    jam_pulang: jamPulangFinal,
    status: evalMasuk.status,
    menit_terlambat: evalMasuk.menit_terlambat,
    keterangan: customNote ? `${baseNote} - ${customNote}` : baseNote,
  };
};

const buildCorrectionPayload = (existing, jadwal, { jam_masuk, jam_pulang, status }) => {
  const normalizedStatus = String(status).trim().toUpperCase();
  if (!MANUAL_ALLOWED_STATUSES.includes(normalizedStatus)) {
    throw new Error(
      `Status koreksi presensi harus salah satu dari: ${MANUAL_ALLOWED_STATUSES.join(', ')}. Untuk IZIN/SAKIT/CUTI kelola melalui modul Izin & Cuti.`
    );
  }

  if (normalizedStatus === 'ALPHA') {
    return {
      jam_masuk: null,
      jam_pulang: null,
      status: 'ALPHA',
      menit_terlambat: 0,
      status_pulang: null,
      menit_pulang_cepat: 0,
      keterangan: 'Tanpa keterangan (Dikoreksi Admin)',
    };
  }

  const jamMasukFinal = jam_masuk !== undefined ? jam_masuk || null : existing.jam_masuk;
  const jamPulangFinal = jam_pulang !== undefined ? jam_pulang || null : existing.jam_pulang;

  if (
    jamMasukFinal &&
    jamPulangFinal &&
    parseTimeToSeconds(jamPulangFinal) <= parseTimeToSeconds(jamMasukFinal)
  ) {
    throw new Error('Jam pulang tidak boleh lebih awal atau sama dengan jam masuk.');
  }

  let statusFinal = normalizedStatus;
  let menitTerlambat = 0;
  let menitPulangCepat = 0;
  let statusPulang = null;
  const notes = [];

  if (jamMasukFinal) {
    const evalMasuk = evaluateMasukStatus(jamMasukFinal, jadwal.jam_masuk_jadwal, jadwal.toleransi_terlambat);
    statusFinal = evalMasuk.status;
    menitTerlambat = evalMasuk.menit_terlambat;
    notes.push(evalMasuk.keterangan);
  } else {
    throw new Error('Jam masuk wajib diisi untuk status HADIR atau TERLAMBAT.');
  }

  if (jamPulangFinal) {
    const evalPulang = evaluatePulangStatus(jamPulangFinal, jadwal.jam_pulang_jadwal);
    statusPulang = evalPulang.status_pulang;
    menitPulangCepat = evalPulang.menit_pulang_cepat;
    notes.push(evalPulang.keterangan);
  }

  return {
    jam_masuk: jamMasukFinal,
    jam_pulang: jamPulangFinal,
    status: statusFinal,
    menit_terlambat: menitTerlambat,
    status_pulang: statusPulang,
    menit_pulang_cepat: menitPulangCepat,
    keterangan: `${notes.join(' | ')} (Dikoreksi Admin)`,
  };
};

module.exports = {
  NON_HADIR_STATUSES,
  IZIN_CUTI_STATUSES,
  DEFAULT_JADWAL_PULANG,
  getWibDateTime,
  parseTimeToSeconds,
  isScheduledOnDate,
  evaluateMasukStatus,
  evaluatePulangStatus,
  validateJedaPulang,
  buildManualEntryPayload,
  buildCorrectionPayload,
};