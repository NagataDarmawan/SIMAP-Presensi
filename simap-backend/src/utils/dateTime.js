/**
 * Mendapatkan tanggal (YYYY-MM-DD) dan jam (HH:mm:ss) saat ini dalam timezone Asia/Jakarta (WIB)
 * tanpa bergantung pada konfigurasi timezone server/OS.
 */
const getWibDateTime = (dateInput = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(dateInput).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const hour = parts.hour === '24' ? '00' : parts.hour;

  return {
    tanggal: `${parts.year}-${parts.month}-${parts.day}`,
    jam: `${hour}:${parts.minute}:${parts.second}`,
  };
};

/**
 * Mengonversi string waktu 'HH:mm' atau 'HH:mm:ss' menjadi total detik sejak 00:00:00
 */
const parseTimeToSeconds = (timeStr) => {
  const [hours = 0, minutes = 0, seconds = 0] = String(timeStr).split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

module.exports = {
  getWibDateTime,
  parseTimeToSeconds,
};