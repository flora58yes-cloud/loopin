const path = require('path');
const fs = require('fs');

const DB_DRIVER = process.env.DB_DRIVER || 'sqlite';
const SQLITE_PATH = path.resolve(__dirname, '..', process.env.SQLITE_DB_PATH || './database/loopin.db');
const SCHEMA_PATH = path.resolve(__dirname, '..', 'database', 'schema.sql');

let dbInstance = null;

// ============================================================================
// 1. ADAPTER SQLITE
// ============================================================================
function initSQLite() {
  try {
    const sqlite3 = require('sqlite3').verbose();
    const dbDir = path.dirname(SQLITE_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = new sqlite3.Database(SQLITE_PATH, (err) => {
      if (err) {
        console.error('❌ Gagal membuka database SQLite:', err.message);
      } else {
        console.log('✅ Terhubung ke database SQLite:', SQLITE_PATH);
        bootstrapSchema(db);
      }
    });

    return {
      all: (sql, params = []) =>
        new Promise((resolve, reject) => {
          db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
        }),
      get: (sql, params = []) =>
        new Promise((resolve, reject) => {
          db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
        }),
      run: (sql, params = []) =>
        new Promise((resolve, reject) => {
          db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
          });
        }),
      exec: (sql) =>
        new Promise((resolve, reject) => {
          db.exec(sql, (err) => (err ? reject(err) : resolve()));
        }),
      type: 'sqlite'
    };
  } catch (e) {
    console.warn('⚠️ Modul sqlite3 belum terpasang. Menggunakan Memory/JSON Adapter terpadu.');
    return initJsonAdapter();
  }
}

// Eksekusi schema.sql saat SQLite pertama kali diinisialisasi
async function bootstrapSchema(db) {
  try {
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
      db.exec(schemaSql, (err) => {
        if (!err) {
          console.log('✅ Skema tabel & data seed SQLite siap.');
        }
      });
    }
  } catch (err) {
    console.warn('Pemberitahuan bootstrap skema:', err.message);
  }
}

// ============================================================================
// 2. ADAPTER JSON FILE (FALLBACK MANDIRI TANPA NATIVE MODULE)
// ============================================================================
function initJsonAdapter() {
  const jsonPath = path.resolve(__dirname, '..', 'database', 'data.json');
  let dataStore = loadSeedDataStore();

  function saveStore() {
    try {
      fs.writeFileSync(jsonPath, JSON.stringify(dataStore, null, 2), 'utf8');
    } catch (e) {
      console.error('Gagal menulis data.json:', e);
    }
  }

  return {
    all: async (tableOrSql, params = []) => {
      // Sederhana: ekstrak nama tabel dari query dasar
      const match = tableOrSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      const tableName = match ? match[1].toLowerCase() : 'products';
      return dataStore[tableName] || [];
    },
    get: async (tableOrSql, params = []) => {
      const match = tableOrSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      const tableName = match ? match[1].toLowerCase() : 'products';
      const list = dataStore[tableName] || [];
      if (params.length > 0) {
        return list.find((item) => item.id == params[0] || item.resi == params[0] || item.email == params[0]);
      }
      return list[0];
    },
    run: async (tableOrSql, params = []) => {
      return { lastID: Date.now(), changes: 1 };
    },
    exec: async () => {},
    type: 'json-fallback'
  };
}

function loadSeedDataStore() {
  const seed = {
    users: [
      {
        id: 1,
        name: 'Flora Jasmine',
        email: 'flora.jasmine@unesa.ac.id',
        password: 'loopin123',
        role: 'buyer',
        phone: '0812-3456-7890',
        city: 'Surabaya',
        address: 'Jl. Ketintang Baru No. 12, Wonokromo, Surabaya',
        avatar: 'assets/images/branding/avatar-flora.jpg'
      }
    ],
    products: [
      {
        id: 1,
        title: 'Cream Knit Cardigan',
        price: 35000,
        price_formatted: 'Rp 35.000',
        size: 'm',
        category: 'atasan, jaket & luaran',
        condition: 'layak pakai',
        seller: 'lovedbythia',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/1.jpg"]',
        co2_saved: '4.2 kg',
        description: 'Cardigan rajut warna kream lembut dengan detail kancing depan.'
      },
      {
        id: 2,
        title: 'Floral Off-Shoulder Top',
        price: 25000,
        price_formatted: 'Rp 25.000',
        size: 's',
        category: 'atasan',
        condition: 'sangat baik',
        seller: 'nabila.closet',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/2.jpg"]',
        co2_saved: '3.8 kg',
        description: 'Atasan off-shoulder motif bunga manis dengan karet dada yang nyaman.'
      },
      {
        id: 3,
        title: 'Textured Knit Sweater',
        price: 40000,
        price_formatted: 'Rp 40.000',
        size: 'm',
        category: 'atasan, jaket & luaran',
        condition: 'seperti baru',
        seller: 'studiopreloved',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/3.jpg"]',
        co2_saved: '5.6 kg',
        description: 'Sweater rajut bertekstur tebal dan hangat, belum pernah dipakai luar ruangan.'
      },
      {
        id: 4,
        title: 'Chocolate Brown Blouse',
        price: 35000,
        price_formatted: 'Rp 35.000',
        size: 'l',
        category: 'atasan',
        condition: 'sangat baik',
        seller: 'lovedbythia',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/4.1.jpg"]',
        co2_saved: '4.0 kg',
        description: 'Blus warna cokelat dengan potongan elegan dan bahan jatuh yang halus.'
      },
      {
        id: 5,
        title: 'Patterned Skirt',
        price: 40000,
        price_formatted: 'Rp 40.000',
        size: 'all size',
        category: 'bawahan',
        condition: 'layak pakai',
        seller: 'loena.preloved',
        city: 'Kab. Gresik',
        images: '["assets/images/catalog/5.jpg"]',
        co2_saved: '4.9 kg',
        description: 'Rok bermotif etnik vintage yang nyaman dengan karet pinggang elastis.'
      },
      {
        id: 6,
        title: 'Olive Green Button Top',
        price: 45000,
        price_formatted: 'Rp 45.000',
        size: 'm',
        category: 'atasan',
        condition: 'sangat baik',
        seller: 'ayupreloved',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/6.jpg"]',
        co2_saved: '5.3 kg',
        description: 'Atasan kasual warna olive green dengan aksen kancing kayu estetik.'
      },
      {
        id: 7,
        title: 'Beige Utility Dress',
        price: 50000,
        price_formatted: 'Rp 50.000',
        size: 's',
        category: 'bawahan, jaket & luaran',
        condition: 'sangat baik',
        seller: 'loena.preloved',
        city: 'Kab. Gresik',
        images: '["assets/images/catalog/7.jpg", "assets/images/catalog/7.2.jpg"]',
        co2_saved: '4.1 kg',
        description: 'Gaun terusan utilitarian warna krem pasir dengan saku depan fungsional.'
      },
      {
        id: 8,
        title: 'Vintage Floral Long Dress',
        price: 45000,
        price_formatted: 'Rp 45.000',
        size: 'm',
        category: 'bawahan',
        condition: 'seperti baru',
        seller: 'nabila.closet',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/8.jpg", "assets/images/catalog/8.2.jpg", "assets/images/catalog/8.3.jpg"]',
        co2_saved: '6.0 kg',
        description: 'Dress panjang motif bunga vintage bernuansa manis, bahan sangat jatuh.'
      },
      {
        id: 9,
        title: 'Classic Striped Shirt',
        price: 25000,
        price_formatted: 'Rp 25.000',
        size: 'l',
        category: 'atasan',
        condition: 'sangat baik',
        seller: 'studiopreloved',
        city: 'Kota Surabaya',
        images: '["assets/images/catalog/9.jpg", "assets/images/catalog/9.2.jpg"]',
        co2_saved: '3.5 kg',
        description: 'Kemeja garis-garis biru klasik bahan katun oxford dingin.'
      },
      {
        id: 10,
        title: 'Plaid Oversized Flannel',
        price: 30000,
        price_formatted: 'Rp 30.000',
        size: 'm',
        category: 'atasan, jaket & luaran',
        condition: 'layak pakai',
        seller: 'kenesthrift',
        city: 'Kota Sidoarjo',
        images: '["assets/images/catalog/10.jpg", "assets/images/catalog/10.2.jpg"]',
        co2_saved: '4.5 kg',
        description: 'Kemeja flanel motif kotak-kotak oversized, pas banget untuk outer.'
      }
    ],
    orders: [
      {
        id: 1,
        resi: 'LPN-2026-0842',
        user_id: 1,
        courier: 'SiCepat Green Eco',
        origin: 'LoopIn Hub Bandung',
        destination: 'Ketintang, Surabaya',
        eta: 'Hari ini, 14:00 - 17:00 WIB',
        current_step: 2,
        subtotal: 75000,
        shipping_cost: 10000,
        total_payment: 85000,
        status: 'Dalam Pengiriman'
      }
    ]
  };
  return seed;
}

function getDatabase() {
  if (!dbInstance) {
    dbInstance = initSQLite();
  }
  return dbInstance;
}

module.exports = getDatabase();
