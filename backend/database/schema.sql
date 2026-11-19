-- =====================================================================
-- DATABASE SCHEMA: LOOPIN E-COMMERCE PLATFORM
-- Mata Kuliah: Web Programming Semester 3
-- Pengembang: Flora Jasmine
-- Kompatibel dengan: SQLite 3 / MySQL 5.7+ / MariaDB / phpMyAdmin
-- =====================================================================

-- 1. TABEL PENGGUNA (USERS)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'buyer', -- 'buyer', 'seller', 'admin'
    phone VARCHAR(30),
    city VARCHAR(50),
    address TEXT,
    avatar VARCHAR(255) DEFAULT 'assets/images/branding/avatar-flora.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL KATEGORI (CATEGORIES)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE
);

-- 3. TABEL PRODUK (PRODUCTS)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(150) NOT NULL,
    price INT NOT NULL,
    price_formatted VARCHAR(50),
    size VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'atasan, jaket & luaran'
    condition VARCHAR(50) NOT NULL, -- 'seperti baru', 'sangat baik', 'layak pakai'
    seller VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    images TEXT NOT NULL, -- JSON array string e.g. ["assets/images/catalog/1.jpg"]
    co2_saved VARCHAR(20) DEFAULT '4.0 kg',
    description TEXT,
    stock INT DEFAULT 1,
    is_active INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL PESANAN (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resi VARCHAR(50) NOT NULL UNIQUE,
    user_id INT DEFAULT 1,
    courier VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    eta VARCHAR(100),
    current_step INT DEFAULT 1, -- 0: Pending, 1: Processed, 2: In Transit, 3: Delivered
    subtotal INT NOT NULL,
    shipping_cost INT DEFAULT 0,
    total_payment INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Diproses',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. TABEL DETAIL ITEM PESANAN (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_title VARCHAR(150) NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    qty INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. TABEL RIWAYAT PELACAKAN (ORDER_TRACKING_HISTORY)
CREATE TABLE IF NOT EXISTS order_tracking_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INT NOT NULL,
    timestamp_str VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    is_active INT DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 7. TABEL WISHLIST / FAVORIT (WISHLISTS)
CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 8. TABEL PESAN CHAT (CHAT_MESSAGES)
CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INT NOT NULL,
    sender VARCHAR(20) NOT NULL, -- 'buyer' atau 'seller'
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- =====================================================================
-- DATA SEED AWAL (DUMMY DATA RESMI)
-- =====================================================================

-- SEED USER
INSERT OR IGNORE INTO users (id, name, email, password, role, phone, city, address, avatar)
VALUES (1, 'Flora Jasmine', 'flora.jasmine@unesa.ac.id', 'loopin123', 'buyer', '0812-3456-7890', 'Surabaya', 'Jl. Ketintang Baru No. 12, Wonokromo, Surabaya', 'assets/images/branding/avatar-flora.jpg');

-- SEED KATEGORI
INSERT OR IGNORE INTO categories (id, name, slug) VALUES
(1, 'Semua Kategori', 'all'),
(2, 'Atasan', 'atasan'),
(3, 'Bawahan', 'bawahan'),
(4, 'Jaket & Luaran', 'jaket & luaran'),
(5, 'Rajut', 'rajut');

-- SEED PRODUK KATALOG LENGKAP
INSERT OR IGNORE INTO products (id, title, price, price_formatted, size, category, condition, seller, city, images, co2_saved, description) VALUES
(1, 'Cream Knit Cardigan', 35000, 'Rp 35.000', 'm', 'atasan, jaket & luaran', 'layak pakai', 'lovedbythia', 'Kota Surabaya', '["assets/images/catalog/1.jpg"]', '4.2 kg', 'Cardigan rajut warna kream lembut dengan detail kancing depan. Bahannya adem, fleksibel, dan sangat nyaman dipakai untuk luaran santai atau kuliah.'),
(2, 'Floral Off-Shoulder Top', 25000, 'Rp 25.000', 's', 'atasan', 'sangat baik', 'nabila.closet', 'Kota Surabaya', '["assets/images/catalog/2.jpg"]', '3.8 kg', 'Atasan off-shoulder motif bunga manis dengan karet dada yang nyaman. Jahitan rapi dan warna masih tajam seperti baru.'),
(3, 'Textured Knit Sweater', 40000, 'Rp 40.000', 'm', 'atasan, jaket & luaran', 'seperti baru', 'studiopreloved', 'Kota Surabaya', '["assets/images/catalog/3.jpg"]', '5.6 kg', 'Sweater rajut bertekstur tebal dan hangat, belum pernah dipakai luar ruangan. Kualitas premium, warna putih gading bersih.'),
(4, 'Chocolate Brown Blouse', 35000, 'Rp 35.000', 'l', 'atasan', 'sangat baik', 'lovedbythia', 'Kota Surabaya', '["assets/images/catalog/4.1.jpg"]', '4.0 kg', 'Blus warna cokelat dengan potongan elegan dan bahan jatuh yang halus. Cocok untuk acara formal maupun semi-formal.'),
(5, 'Patterned Skirt', 40000, 'Rp 40.000', 'all size', 'bawahan', 'layak pakai', 'loena.preloved', 'Kab. Gresik', '["assets/images/catalog/5.jpg"]', '4.9 kg', 'Rok bermotif etnik vintage yang nyaman dengan karet pinggang elastis. Bahan adem dan tidak menerawang saat dipakai.'),
(6, 'Olive Green Button Top', 45000, 'Rp 45.000', 'm', 'atasan', 'sangat baik', 'ayupreloved', 'Kota Surabaya', '["assets/images/catalog/6.jpg"]', '5.3 kg', 'Atasan kasual warna olive green dengan aksen kancing kayu estetik. Bahan katun ringan dan menyerap keringat.'),
(7, 'Beige Utility Dress', 50000, 'Rp 50.000', 's', 'bawahan, jaket & luaran', 'sangat baik', 'loena.preloved', 'Kab. Gresik', '["assets/images/catalog/7.jpg", "assets/images/catalog/7.2.jpg"]', '4.1 kg', 'Gaun terusan utilitarian warna krem pasir dengan saku depan fungsional dan ikat pinggang serasi.'),
(8, 'Vintage Floral Long Dress', 45000, 'Rp 45.000', 'm', 'bawahan', 'seperti baru', 'nabila.closet', 'Kota Surabaya', '["assets/images/catalog/8.jpg", "assets/images/catalog/8.2.jpg", "assets/images/catalog/8.3.jpg"]', '6.0 kg', 'Gaun panjang flowy motif vintage floral dengan detail lipit halus di bagian dada. Sangat anggun untuk pesta taman atau foto.'),
(9, 'Classic Striped Shirt', 25000, 'Rp 25.000', 'l', 'atasan', 'sangat baik', 'studiopreloved', 'Kota Surabaya', '["assets/images/catalog/9.jpg", "assets/images/catalog/9.2.jpg"]', '3.5 kg', 'Kemeja garis-garis biru klasik bahan katun oxford dingin. Potongan santai, cocok di-mix & match dengan celana bahan.'),
(10, 'Plaid Oversized Flannel', 30000, 'Rp 30.000', 'm', 'atasan, jaket & luaran', 'layak pakai', 'kenesthrift', 'Kota Sidoarjo', '["assets/images/catalog/10.jpg", "assets/images/catalog/10.2.jpg"]', '4.5 kg', 'Kemeja flanel motif kotak-kotak bergaya oversized, pas banget dijadikan outer santai sehari-hari.');

-- SEED PESANAN & PELACAKAN
INSERT OR IGNORE INTO orders (id, resi, user_id, courier, origin, destination, eta, current_step, subtotal, shipping_cost, total_payment, status) VALUES
(1, 'LPN-2026-0842', 1, 'SiCepat Green Eco', 'LoopIn Hub Bandung', 'Ketintang, Surabaya', 'Hari ini, 14:00 - 17:00 WIB', 2, 75000, 10000, 85000, 'Dalam Pengiriman'),
(2, 'LPN-2026-0791', 1, 'JNE Trucking Eco', 'LoopIn Hub Yogyakarta', 'Ketintang, Surabaya', 'Besok, 11:00 - 15:00 WIB', 1, 75000, 12000, 87000, 'Sedang Dikemas'),
(3, 'LPN-2026-0615', 1, 'Anteraja Eco', 'LoopIn Hub Jakarta', 'Ketintang, Surabaya', 'Terkirim - 10 Nov 2026', 3, 45000, 9000, 54000, 'Selesai');

-- SEED DETAIL ITEM PESANAN
INSERT OR IGNORE INTO order_items (order_id, product_id, product_title, product_image, price, qty) VALUES
(1, 1, 'Cream Knit Cardigan', 'assets/images/catalog/1.jpg', 35000, 1),
(1, 3, 'Textured Knit Sweater', 'assets/images/catalog/3.jpg', 40000, 1),
(2, 4, 'Chocolate Brown Blouse', 'assets/images/catalog/4.1.jpg', 35000, 1),
(2, 5, 'Patterned Skirt', 'assets/images/catalog/5.jpg', 40000, 1),
(3, 6, 'Olive Green Button Top', 'assets/images/catalog/6.jpg', 45000, 1);

-- SEED RIWAYAT TRACKING PAKET 1
INSERT OR IGNORE INTO order_tracking_history (order_id, timestamp_str, title, description, is_active) VALUES
(1, '18 Nov 2026 - 09:42 WIB', 'Paket sedang diantar kurir menuju alamat tujuan', 'Kurir Bagus Pratama (ID #SC-4412) sedang menuju area Ketintang, Surabaya.', 1),
(1, '18 Nov 2026 - 05:18 WIB', 'Tiba di Gudang Sortir Surabaya Selatan', 'Paket lolos pemindaian sortir akhir dalam kondisi segel kraft utuh.', 0),
(1, '17 Nov 2026 - 18:30 WIB', 'Selesai Steam-Sanitizing & Eco-Packaging', 'Tim kurasi LoopIn telah mensterilkan pakaian dan mengemasnya dengan boks kraft daur ulang.', 0),
(1, '17 Nov 2026 - 13:10 WIB', 'Pesanan Terkonfirmasi', 'Pembayaran diterima dan item dikunci dari katalog publik.', 0);
