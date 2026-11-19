const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initDatabase() {
  console.log('🔄 Memulai inisialisasi ulang database LoopIn...');
  const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Berkas schema.sql tidak ditemukan di:', schemaPath);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    if (typeof db.exec === 'function') {
      await db.exec(schemaSql);
      console.log('✅ Skema tabel dan data seed berhasil diterapkan ke database!');
    } else {
      console.log('✅ Adapter data seed aktif.');
    }
  } catch (error) {
    console.error('❌ Gagal menjalankan skema database:', error.message);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
