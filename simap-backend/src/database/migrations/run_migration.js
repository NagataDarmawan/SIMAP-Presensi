/**
 * Script migrasi database SIMAP
 * Jalankan dengan: node src/database/migrations/run_migration.js
 */

const pool = require('../../config/database');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  const migrationFiles = [
    '20261118_add_menit_terlambat_to_absensi.sql'
  ];

  console.log('🚀 Memulai proses migrasi database SIMAP...\n');

  for (const fileName of migrationFiles) {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File tidak ditemukan, dilewati: ${fileName}`);
      continue;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    // Pisahkan setiap statement SQL
    // Hapus komentar SQL single line (-- ...) dan block (/* ... */)
    const cleanedSql = sql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📄 Menjalankan: ${fileName} (${statements.length} statement)`);
    for (const stmt of statements) {
      try {
        await pool.execute(stmt);
        console.log(`   ✅ OK: ${stmt.substring(0, 60).replace(/\n/g, ' ')}...`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ⚠️  Kolom sudah ada (dilewati): ${err.message}`);
        } else {
          console.error(`   ❌ Error: ${err.message}`);
          console.error(`      SQL: ${stmt.substring(0, 100)}`);
        }
      }
    }
    console.log('');
  }

  console.log('✅ Migrasi selesai.');
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error('❌ Fatal error saat migrasi:', err);
  process.exit(1);
});
