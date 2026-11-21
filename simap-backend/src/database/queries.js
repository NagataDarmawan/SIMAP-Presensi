/**
 * Kumpulan Raw SQL Queries SIMAP (Sistem Informasi Manajemen Absensi dan Ketidakhadiran Pegawai).
 * Disesuaikan penuh dengan DDL MySQL pada PRD SIMAP v1.0.
 * Seluruh query menggunakan Prepared Statements (?) untuk mencegah SQL Injection.
 */

// 1. MODUL AUTENTIKASI (Tabel: users)
const authQueries = {
  findUserByUsername: `
    SELECT id, username, password, nama_lengkap, created_at, updated_at 
    FROM users 
    WHERE username = ? 
    LIMIT 1
  `,
  findUserById: `
    SELECT id, username, nama_lengkap, created_at, updated_at 
    FROM users 
    WHERE id = ? 
    LIMIT 1
  `,
  // Register Admin Baru
  createUser: `
    INSERT INTO users (username, password, nama_lengkap)
    VALUES (?, ?, ?)
  `,
  // Update Password Admin
  updatePassword: `
    UPDATE users
    SET password = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
};

// 2. MODUL MANAJEMEN PEGAWAI (Tabel: pegawai JOIN jadwal_kerja)
const pegawaiQueries = {
  findAll: `
    SELECT 
      p.id, 
      p.kode_pegawai, 
      p.kode_qr,
      p.nama, 
      p.jenis_kelamin, 
      p.alamat, 
      p.no_telepon, 
      p.jabatan, 
      p.tanggal_masuk, 
      p.jadwal_kerja_id, 
      p.status, 
      p.created_at, 
      p.updated_at,
      j.nama_jadwal
    FROM pegawai p
    JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    WHERE (? IS NULL OR p.status = ?)
      AND (? IS NULL OR p.nama LIKE ? OR p.kode_pegawai LIKE ? OR p.kode_qr LIKE ?)
    ORDER BY p.id DESC
  `,
  findById: `
    SELECT 
      p.id, 
      p.kode_pegawai, 
      p.kode_qr,
      p.nama, 
      p.jenis_kelamin, 
      p.alamat, 
      p.no_telepon, 
      p.jabatan, 
      p.tanggal_masuk, 
      p.jadwal_kerja_id, 
      p.status, 
      p.created_at, 
      p.updated_at,
      j.nama_jadwal,
      j.jam_masuk,
      j.jam_pulang,
      j.toleransi_terlambat
    FROM pegawai p
    JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    WHERE p.id = ?
    LIMIT 1
  `,
  findByKode: `
    SELECT id FROM pegawai WHERE kode_pegawai = ? LIMIT 1
  `,
  findByKodeQr: `
    SELECT 
      p.id, 
      p.kode_pegawai, 
      p.kode_qr,
      p.nama,
      p.jabatan,
      p.status, 
      p.jadwal_kerja_id,
      j.jam_masuk,
      j.jam_pulang,
      j.toleransi_terlambat
    FROM pegawai p
    LEFT JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    WHERE p.kode_qr = ?
    LIMIT 1
  `,
  findByIdWithJadwal: `
    SELECT p.id, p.kode_pegawai, p.kode_qr, p.nama, p.status, p.jadwal_kerja_id, j.hari_kerja
    FROM pegawai p
    LEFT JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    WHERE p.id = ?
    LIMIT 1
  `,
  insert: `
    INSERT INTO pegawai 
      (kode_pegawai, kode_qr, nama, jenis_kelamin, alamat, no_telepon, jabatan, tanggal_masuk, jadwal_kerja_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT)
  `,
  update: `
    UPDATE pegawai 
    SET nama = ?, jenis_kelamin = ?, alamat = ?, no_telepon = ?, jabatan = ?, tanggal_masuk = ?, jadwal_kerja_id = ?
    WHERE id = ?
  `,
  updateStatus: `
    UPDATE pegawai SET status = ? WHERE id = ?
  `,
  delete: `
    DELETE FROM pegawai WHERE id = ?
  `,
  deleteAbsensiByPegawaiId: `
    DELETE FROM absensi WHERE pegawai_id = ?
  `,
};

// 3. MODUL MANAJEMEN JADWAL KERJA (Tabel: jadwal_kerja)
const jadwalQueries = {
  findAll: `
    SELECT id, nama_jadwal, hari_kerja, jam_masuk, jam_pulang, toleransi_terlambat, created_at, updated_at
    FROM jadwal_kerja
    ORDER BY id ASC
  `,
  findById: `
    SELECT id, nama_jadwal, hari_kerja, jam_masuk, jam_pulang, toleransi_terlambat, created_at, updated_at
    FROM jadwal_kerja
    WHERE id = ?
    LIMIT 1
  `,
  insert: `
    INSERT INTO jadwal_kerja (nama_jadwal, hari_kerja, jam_masuk, jam_pulang, toleransi_terlambat)
    VALUES (?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE jadwal_kerja
    SET nama_jadwal = ?, hari_kerja = ?, jam_masuk = ?, jam_pulang = ?, toleransi_terlambat = ?
    WHERE id = ?
  `,
  checkUsageInPegawai: `
    SELECT COUNT(*) AS total FROM pegawai WHERE jadwal_kerja_id = ?
  `,
  delete: `
    DELETE FROM jadwal_kerja WHERE id = ?
  `,
};

// 4. MODUL MANAJEMEN QR CODE (Tabel: qr_pegawai JOIN pegawai)
const qrQueries = {
  findAll: `
    SELECT 
      q.id, q.pegawai_id, q.token_hash, q.status, q.created_at, q.updated_at,
      p.kode_pegawai, p.nama, p.status AS status_pegawai
    FROM qr_pegawai q
    JOIN pegawai p ON q.pegawai_id = p.id
    ORDER BY q.id DESC
  `,
  findByPegawaiId: `
    SELECT q.id, q.pegawai_id, q.token_hash, q.status, q.created_at, q.updated_at,
           p.kode_pegawai, p.nama, p.status AS status_pegawai
    FROM qr_pegawai q
    JOIN pegawai p ON q.pegawai_id = p.id
    WHERE q.pegawai_id = ?
    LIMIT 1
  `,
  findByTokenHash: `
    SELECT q.id, q.pegawai_id, q.status AS status_qr,
           p.kode_pegawai, p.nama, p.status AS status_pegawai, p.jadwal_kerja_id
    FROM qr_pegawai q
    JOIN pegawai p ON q.pegawai_id = p.id
    WHERE q.token_hash = ?
    LIMIT 1
  `,
  insert: `
    INSERT INTO qr_pegawai (pegawai_id, token_hash, status)
    VALUES (?, ?, 'AKTIF')
  `,
  updateTokenHash: `
    UPDATE qr_pegawai 
    SET token_hash = ?, status = 'AKTIF', updated_at = CURRENT_TIMESTAMP
    WHERE pegawai_id = ?
  `,
};

// 5. MODUL ABSENSI PEGAWAI (Tabel: absensi JOIN pegawai JOIN jadwal_kerja)
const absensiQueries = {
  findByPegawaiAndTanggalForUpdate: `
    SELECT id, pegawai_id, tanggal, jam_masuk, jam_pulang, status, catatan_izin_cuti_id, keterangan, menit_terlambat
    FROM absensi
    WHERE pegawai_id = ? AND tanggal = ?
    LIMIT 1
    FOR UPDATE
  `,
  insertMasuk: `
    INSERT INTO absensi (pegawai_id, tanggal, jam_masuk, status, keterangan, menit_terlambat)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  insertNonHadir: `
    INSERT INTO absensi (pegawai_id, tanggal, status, catatan_izin_cuti_id, keterangan)
    VALUES (?, ?, ?, ?, ?)
  `,
  updatePulangWithKeterangan: `
    UPDATE absensi
    SET jam_pulang = ?, keterangan = ?
    WHERE id = ? AND jam_pulang IS NULL
  `,
  findAllHistory: `
    SELECT 
      a.id, a.pegawai_id, a.tanggal, a.jam_masuk, a.jam_pulang, a.status, a.keterangan, a.catatan_izin_cuti_id, a.menit_terlambat,
      p.kode_pegawai, p.nama
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    WHERE (? IS NULL OR a.tanggal = ?)
      AND (? IS NULL OR a.status = ?)
      AND (? IS NULL OR p.nama LIKE ? OR p.kode_pegawai LIKE ?)
    ORDER BY a.tanggal DESC, a.id DESC
  `,
  findById: `
    SELECT a.id, a.pegawai_id, a.tanggal, a.jam_masuk, a.jam_pulang, a.status, a.keterangan, a.catatan_izin_cuti_id, a.menit_terlambat,
           p.kode_pegawai, p.nama
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    WHERE a.id = ?
    LIMIT 1
  `,
  findJadwalByAbsensiId: `
    SELECT 
      j.jam_masuk AS jam_masuk_jadwal, 
      j.jam_pulang AS jam_pulang_jadwal, 
      j.toleransi_terlambat
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    LEFT JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    WHERE a.id = ?
    LIMIT 1
  `,
  correction: `
    UPDATE absensi
    SET jam_masuk = ?, jam_pulang = ?, status = ?, keterangan = ?, menit_terlambat = ?
    WHERE id = ?
  `,
  applyIzinCuti: `
    UPDATE absensi
    SET status = ?, keterangan = ?, catatan_izin_cuti_id = ?
    WHERE id = ?
  `,
  findHarianPegawaiByTanggal: `
    SELECT 
      p.id AS pegawai_id,
      p.kode_pegawai,
      p.nama,
      p.jabatan,
      p.jadwal_kerja_id,
      j.nama_jadwal,
      j.hari_kerja,
      j.jam_masuk AS jam_masuk_jadwal,
      j.jam_pulang AS jam_pulang_jadwal,
      j.toleransi_terlambat,
      a.id AS absensi_id,
      a.tanggal,
      a.jam_masuk,
      a.jam_pulang,
      a.status,
      a.keterangan,
      a.catatan_izin_cuti_id,
      COALESCE(a.menit_terlambat, 0) AS menit_terlambat
    FROM pegawai p
    JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    LEFT JOIN absensi a ON p.id = a.pegawai_id AND a.tanggal = ?
    WHERE p.status = 'AKTIF'
    ORDER BY (a.id IS NULL) DESC, p.nama ASC
  `,
  insertManual: `
    INSERT INTO absensi (pegawai_id, tanggal, jam_masuk, jam_pulang, status, keterangan, menit_terlambat)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  findPegawaiWithJadwalById: `
    SELECT 
      p.id,
      p.kode_pegawai,
      p.nama,
      p.jabatan,
      p.status,
      p.jadwal_kerja_id,
      j.nama_jadwal,
      j.hari_kerja,
      j.jam_masuk AS jam_masuk_jadwal,
      j.jam_pulang AS jam_pulang_jadwal,
      j.toleransi_terlambat
    FROM pegawai p
    LEFT JOIN jadwal_kerja j ON p.jadwal_kerja_id = j.id
    WHERE p.id = ?
    LIMIT 1
  `,
};

// 6. MODUL MANAJEMEN IZIN, SAKIT, DAN CUTI (Tabel: catatan_izin_cuti)
const izinCutiQueries = {
  findAll: `
    SELECT 
      ic.id,
      ic.pegawai_id,
      p.kode_pegawai,
      p.nama AS nama_pegawai,
      p.jabatan,
      ic.jenis,
      ic.tanggal_mulai,
      ic.tanggal_selesai,
      ic.alasan,
      CASE
        WHEN ic.status = 'AKTIF'
          AND ic.tanggal_selesai < DATE(UTC_TIMESTAMP() + INTERVAL 7 HOUR)
        THEN 'MENUNGGU_KONFIRMASI'
        ELSE ic.status
      END AS status,
      ic.created_at,
      ic.updated_at
    FROM catatan_izin_cuti ic
    JOIN pegawai p ON ic.pegawai_id = p.id
    WHERE (? IS NULL OR ic.jenis = ?)
      AND (? IS NULL OR ic.pegawai_id = ?)
    ORDER BY ic.id DESC
  `,
  findById: `
    SELECT 
      ic.id,
      ic.pegawai_id,
      p.kode_pegawai,
      p.nama AS nama_pegawai,
      p.jabatan,
      ic.jenis,
      ic.tanggal_mulai,
      ic.tanggal_selesai,
      ic.alasan,
      CASE
        WHEN ic.status = 'AKTIF'
          AND ic.tanggal_selesai < DATE(UTC_TIMESTAMP() + INTERVAL 7 HOUR)
        THEN 'MENUNGGU_KONFIRMASI'
        ELSE ic.status
      END AS status,
      ic.created_at,
      ic.updated_at
    FROM catatan_izin_cuti ic
    JOIN pegawai p ON ic.pegawai_id = p.id
    WHERE ic.id = ?
    LIMIT 1
  `,
  insert: `
    INSERT INTO catatan_izin_cuti (pegawai_id, jenis, tanggal_mulai, tanggal_selesai, alasan, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?, 'AKTIF')
  `,
  updateDetails: `
    UPDATE catatan_izin_cuti
    SET pegawai_id = ?, jenis = ?, tanggal_mulai = ?, tanggal_selesai = ?,
        alasan = ?, updated_by = ?
    WHERE id = ? AND status = 'AKTIF'
  `,
  updateStatusBatal: `
    UPDATE catatan_izin_cuti
    SET status = 'DIBATALKAN', updated_by = ?
    WHERE id = ? AND status = 'AKTIF'
  `,
  findForUpdate: `
    SELECT id, pegawai_id, jenis, tanggal_mulai, tanggal_selesai, alasan, status
    FROM catatan_izin_cuti
    WHERE id = ?
    FOR UPDATE
  `,
  extendEndDate: `
    UPDATE catatan_izin_cuti
    SET tanggal_selesai = ?, updated_by = ?
    WHERE id = ?
      AND status = 'AKTIF'
      AND tanggal_selesai < DATE(UTC_TIMESTAMP() + INTERVAL 7 HOUR)
  `,
  updateStatusSelesai: `
    UPDATE catatan_izin_cuti
    SET status = 'SELESAI', updated_by = ?
    WHERE id = ?
      AND status = 'AKTIF'
      AND tanggal_selesai < DATE(UTC_TIMESTAMP() + INTERVAL 7 HOUR)
  `,
  deleteAbsensiTurunan: `
    DELETE FROM absensi
    WHERE catatan_izin_cuti_id = ?
  `,
};

// 7. MODUL REKAP, MONITORING & DASHBOARD
const reportAndDashboardQueries = {
  // 1. Dashboard Summary Today (Statistik Utama Dashboard Hari Ini - Opsi 1: Hadir = HADIR + TERLAMBAT)
  dashboardSummaryToday: `
    SELECT 
      (SELECT COUNT(*) FROM pegawai WHERE status = 'AKTIF') AS total_pegawai_aktif,
      (SELECT COUNT(*) FROM pegawai WHERE status = 'NONAKTIF') AS total_pegawai_nonaktif,
      COALESCE(SUM(CASE WHEN a.status IN ('HADIR', 'TERLAMBAT') THEN 1 ELSE 0 END), 0) AS total_hadir,
      COALESCE(SUM(CASE WHEN a.status = 'TERLAMBAT' THEN 1 ELSE 0 END), 0) AS total_terlambat,
      COALESCE(SUM(CASE WHEN a.status = 'IZIN' THEN 1 ELSE 0 END), 0) AS total_izin,
      COALESCE(SUM(CASE WHEN a.status = 'SAKIT' THEN 1 ELSE 0 END), 0) AS total_sakit,
      COALESCE(SUM(CASE WHEN a.status = 'CUTI' THEN 1 ELSE 0 END), 0) AS total_cuti,
      (
        SELECT COUNT(p2.id) 
        FROM pegawai p2 
        WHERE p2.status = 'AKTIF' 
          AND p2.jadwal_kerja_id IS NOT NULL 
          AND p2.id NOT IN (SELECT pegawai_id FROM absensi WHERE tanggal = ?)
      ) AS total_belum_absen
    FROM pegawai p
    LEFT JOIN absensi a ON p.id = a.pegawai_id AND a.tanggal = ?
    WHERE p.status = 'AKTIF'
  `,

  // 2. Log Absensi Terbaru Hari Ini (Tabel Dashboard Kiri & Panel Scan)
  recentAbsensiToday: `
    SELECT 
      a.id AS absensi_id,
      p.nama AS nama_pegawai,
      p.kode_pegawai,
      p.jabatan,
      a.jam_masuk,
      a.jam_pulang,
      a.status,
      COALESCE(a.menit_terlambat, 0) AS menit_terlambat
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    WHERE a.tanggal = ?
    ORDER BY a.id DESC
  `,

  // 3. Log Keterlambatan Hari Ini (Tabel Dashboard Kanan)
  terlambatToday: `
    SELECT 
      a.id AS absensi_id,
      p.nama AS nama_pegawai,
      p.kode_pegawai,
      p.jabatan,
      a.jam_masuk,
      COALESCE(a.menit_terlambat, 0) AS menit_terlambat
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    WHERE a.tanggal = ? AND a.status = 'TERLAMBAT'
    ORDER BY a.menit_terlambat DESC
    LIMIT 5
  `,

  // 4. Rekap Kehadiran Summary (Agregat Total Periode - Opsi 1: Hadir = HADIR + TERLAMBAT)
  rekapKehadiranSummary: `
    SELECT 
      COUNT(DISTINCT p.id) AS total_pegawai_aktif,
      COALESCE(SUM(CASE WHEN a.status IN ('HADIR', 'TERLAMBAT') THEN 1 ELSE 0 END), 0) AS total_hadir,
      COALESCE(SUM(CASE WHEN a.status = 'TERLAMBAT' THEN 1 ELSE 0 END), 0) AS total_terlambat,
      COALESCE(SUM(CASE WHEN a.status = 'IZIN' THEN 1 ELSE 0 END), 0) AS total_izin,
      COALESCE(SUM(CASE WHEN a.status = 'SAKIT' THEN 1 ELSE 0 END), 0) AS total_sakit,
      COALESCE(SUM(CASE WHEN a.status = 'CUTI' THEN 1 ELSE 0 END), 0) AS total_cuti,
      COALESCE(SUM(COALESCE(a.menit_terlambat, 0)), 0) AS total_menit_terlambat
    FROM pegawai p
    LEFT JOIN absensi a ON p.id = a.pegawai_id AND a.tanggal BETWEEN ? AND ?
    WHERE p.status = 'AKTIF'
  `,

  // 5. Rekap Per Pegawai (Tabel Agregasi Kehadiran Modul Rekap - Opsi 1)
  rekapPerPegawai: `
    SELECT 
      p.id AS pegawai_id,
      p.kode_pegawai,
      p.nama,
      p.jabatan,
      COALESCE(SUM(CASE WHEN a.status IN ('HADIR', 'TERLAMBAT') THEN 1 ELSE 0 END), 0) AS total_hadir,
      COALESCE(SUM(CASE WHEN a.status = 'TERLAMBAT' THEN 1 ELSE 0 END), 0) AS total_terlambat,
      COALESCE(SUM(CASE WHEN a.status = 'IZIN' THEN 1 ELSE 0 END), 0) AS total_izin,
      COALESCE(SUM(CASE WHEN a.status = 'SAKIT' THEN 1 ELSE 0 END), 0) AS total_sakit,
      COALESCE(SUM(CASE WHEN a.status = 'CUTI' THEN 1 ELSE 0 END), 0) AS total_cuti,
      COALESCE(SUM(CASE WHEN a.status = 'ALPHA' THEN 1 ELSE 0 END), 0) AS total_alpha,
      COALESCE(SUM(COALESCE(a.menit_terlambat, 0)), 0) AS total_menit_terlambat
    FROM pegawai p
    LEFT JOIN absensi a ON p.id = a.pegawai_id AND a.tanggal BETWEEN ? AND ?
    WHERE p.status = 'AKTIF'
    GROUP BY p.id, p.kode_pegawai, p.nama, p.jabatan
    ORDER BY p.nama ASC
  `,

  // 6. Monitoring Keterlambatan Pegawai
  monitoringKeterlambatan: `
    SELECT 
      p.id AS pegawai_id,
      p.kode_pegawai,
      p.nama,
      p.jabatan,
      COUNT(a.id) AS frekuensi_terlambat,
      COALESCE(SUM(COALESCE(a.menit_terlambat, 0)), 0) AS total_menit_terlambat
    FROM pegawai p
    JOIN absensi a ON p.id = a.pegawai_id
    WHERE a.status = 'TERLAMBAT' 
      AND a.tanggal BETWEEN ? AND ?
      AND p.status = 'AKTIF'
    GROUP BY p.id, p.kode_pegawai, p.nama, p.jabatan
    ORDER BY total_menit_terlambat DESC, frekuensi_terlambat DESC
  `,

  // 7. Detail Histori Keterlambatan Pegawai (Modal Detail)
  detailKeterlambatanPegawai: `
    SELECT 
      a.id AS absensi_id,
      a.tanggal,
      a.jam_masuk AS jam_masuk_aktual,
      jk.jam_masuk AS jam_masuk_jadwal,
      COALESCE(a.menit_terlambat, 0) AS menit_terlambat
    FROM absensi a
    JOIN pegawai p ON p.id = a.pegawai_id
    LEFT JOIN jadwal_kerja jk ON p.jadwal_kerja_id = jk.id
    WHERE a.pegawai_id = ? 
      AND a.status = 'TERLAMBAT'
      AND a.tanggal BETWEEN ? AND ?
    ORDER BY a.tanggal DESC
  `,
};

// 8. MODUL RIWAYAT ABSENSI (LOG TRANSAKSI HARIAN)
const riwayatAbsensiQueries = {
  // 1. Ambil daftar log absensi harian dengan filter tanggal & pencarian
  getRiwayatAbsensi: `
    SELECT 
      a.id AS absensi_id,
      a.tanggal,
      a.pegawai_id,
      p.kode_pegawai,
      p.nama AS nama_pegawai,
      p.jabatan,
      a.jam_masuk,
      a.jam_pulang,
      a.status,
      a.keterangan,
      COALESCE(a.menit_terlambat, 0) AS menit_terlambat,
      jk.nama_jadwal,
      jk.jam_masuk AS jam_masuk_jadwal,
      jk.jam_pulang AS jam_pulang_jadwal
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    LEFT JOIN jadwal_kerja jk ON p.jadwal_kerja_id = jk.id
    WHERE a.tanggal BETWEEN ? AND ?
      AND (? IS NULL OR a.status = ?)
      AND (? IS NULL OR (p.nama LIKE CONCAT('%', ?, '%') OR p.kode_pegawai LIKE CONCAT('%', ?, '%')))
    ORDER BY a.tanggal DESC, a.jam_masuk DESC
  `,

  // 2. Ambil detail log absensi berdasarkan ID Absensi (opsional/modal)
  getRiwayatAbsensiById: `
    SELECT 
      a.id AS absensi_id,
      a.tanggal,
      p.kode_pegawai,
      p.nama AS nama_pegawai,
      p.jabatan,
      a.jam_masuk,
      a.jam_pulang,
      a.status,
      a.keterangan,
      COALESCE(a.menit_terlambat, 0) AS menit_terlambat,
      jk.nama_jadwal,
      jk.jam_masuk AS jam_masuk_jadwal,
      jk.jam_pulang AS jam_pulang_jadwal
    FROM absensi a
    JOIN pegawai p ON a.pegawai_id = p.id
    LEFT JOIN jadwal_kerja jk ON p.jadwal_kerja_id = jk.id
    WHERE a.id = ?
  `,
};

module.exports = {
  authQueries,
  pegawaiQueries,
  jadwalQueries,
  qrQueries,
  absensiQueries,
  izinCutiQueries,
  reportAndDashboardQueries,
  riwayatAbsensiQueries,
};