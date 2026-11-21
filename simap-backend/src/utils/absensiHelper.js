const DEFAULT_JADWAL_MASUK = '08:00:00';
const DEFAULT_JADWAL_PULANG = '17:00:00';
const MIN_JEDA_PULANG_MENIT = 30;
const NON_HADIR_STATUSES = ['IZIN', 'SAKIT', 'CUTI', 'ALPHA'];
const VALID_STATUSES = ['HADIR', 'TERLAMBAT', 'IZIN', 'SAKIT', 'CUTI', 'ALPHA'];

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
      `Absensi pulang belum dapat dilakukan. Minimal jeda ${MIN_JEDA_PULANG_MENIT} menit setelah absen masuk pukul ${jamMasuk} (tunggu ${sisaMenit} menit lagi).`
    );
  }
};

const buildCorrectionPayload = (existing, jadwal, { jam_masuk, jam_pulang, status }) => {
  const normalizedStatus = String(status).trim().toUpperCase();
  if (!VALID_STATUSES.includes(normalizedStatus)) {
    throw new Error(`Status absensi tidak valid. Pilih dari: ${VALID_STATUSES.join(', ')}`);
  }

  const isNonHadir = NON_HADIR_STATUSES.includes(normalizedStatus);
  const jamMasukFinal = isNonHadir ? null : (jam_masuk !== undefined ? jam_masuk || null : existing.jam_masuk);
  const jamPulangFinal = isNonHadir ? null : (jam_pulang !== undefined ? jam_pulang || null : existing.jam_pulang);

  if (isNonHadir) {
    return {
      jam_masuk: null,
      jam_pulang: null,
      status: normalizedStatus,
      menit_terlambat: 0,
      status_pulang: null,
      menit_pulang_cepat: 0,
      keterangan: `Status ${normalizedStatus} (Dikoreksi Admin)`,
    };
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
  } else if (statusFinal === 'TERLAMBAT') {
    throw new Error('Jam masuk wajib diisi jika status absensi adalah TERLAMBAT.');
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
    keterangan: notes.length > 0 ? `${notes.join(' | ')} (Dikoreksi Admin)` : `Status ${statusFinal} (Dikoreksi Admin)`,
  };
};

module.exports = {
  NON_HADIR_STATUSES,
  getWibDateTime,
  evaluateMasukStatus,
  evaluatePulangStatus,
  validateJedaPulang,
  buildCorrectionPayload,
};