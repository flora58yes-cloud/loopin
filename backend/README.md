# 🌿 LoopIn Backend API & Database Service

Modul backend REST API dan Database untuk platform **LoopIn**, dibuat menggunakan **Node.js**, **Express.js**, dan **SQLite / MySQL**.

---

## 📌 Fitur Utama Backend

* **Dual Database Support**:
  * Default menggunakan **SQLite 3** (`database/loopin.db`), file-based tanpa perlu instalasi software server database terpisah.
  * Mendukung **MySQL / MariaDB** (XAMPP / phpMyAdmin) dengan berkas skema [`database/schema.sql`](database/schema.sql).
* **RESTful Endpoints**:
  * Produk katalog (GET list, GET by ID, POST produk baru).
  * Autentikasi pengguna (Login, Register, Get Profile).
  * Manajemen pesanan & pelacakan resi kurir real-time.
  * Percakapan interaktif chat penjual dengan auto-reply cerdas.
* **Full-stack Hybrid**:
  * Menyajikan file statis front-end di `http://localhost:5000/`.

---

## 🚀 Cara Menjalankan Backend

### 1. Pasang Dependensi
Pastikan **Node.js** sudah terpasang di komputer Anda. Lalu jalankan di terminal:
```bash
cd backend
npm install
```

### 2. Jalankan Server
```bash
# Mode Standar
npm start

# Mode Pengembangan (Auto-reload saat file diedit)
npm run dev
```

Server akan aktif di:
* **API Health Check**: `http://localhost:5000/api/health`
* **Website Frontend**: `http://localhost:5000/`

---

## 📡 Daftar Endpoint API

### 1. Produk Katalog (`/api/products`)
| Method | Endpoint | Deskripsi | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Mendapatkan semua produk | `category`, `search`, `size`, `condition`, `minPrice`, `maxPrice` |
| `GET` | `/api/products/:id` | Mendapatkan detail 1 produk | - |
| `POST` | `/api/products` | Menambahkan produk baru | Body JSON: `title`, `price`, `size`, `category`, `images`, `description` |

### 2. Autentikasi Pengguna (`/api/auth`)
| Method | Endpoint | Deskripsi | Body / Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Masuk akun | Body: `{ "email": "...", "password": "..." }` |
| `POST` | `/api/auth/register` | Daftar akun baru | Body: `{ "name": "...", "email": "...", "password": "..." }` |
| `GET` | `/api/auth/profile` | Ambil data profil | Query: `?id=1` |

### 3. Pesanan & Pelacakan Resi (`/api/orders`)
| Method | Endpoint | Deskripsi | Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Checkout pesanan baru | Body: `userId`, `items`, `subtotal`, `shippingCost`, `courier` |
| `GET` | `/api/orders` | Daftar pesanan pengguna | Query: `?userId=1` |
| `GET` | `/api/orders/track/:resi` | Lacak status resi kurir | Param: `:resi` (contoh: `LPN-2026-0842`) |

### 4. Chat Penjual (`/api/chat`)
| Method | Endpoint | Deskripsi | Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat/:productId` | Riwayat percakapan produk | Param: `:productId` |
| `POST` | `/api/chat/:productId` | Kirim pesan & terima balasan | Body: `{ "message": "...", "senderName": "..." }` |

---

## 🗄️ Skema Database

File skema lengkap tersedia di [`database/schema.sql`](database/schema.sql) dan berisi tabel:
1. `users` &bull; Akun pembeli & penjual.
2. `categories` &bull; Kategori pakaian.
3. `products` &bull; Katalog pakaian preloved beserta harga, foto, dan kondisi.
4. `orders` &bull; Header pesanan checkout dan resi pengiriman.
5. `order_items` &bull; Rincian item pakaian di dalam tiap order.
6. `order_tracking_history` &bull; Riwayat tahapan status kurir.
7. `wishlists` &bull; Daftar pakaian yang disukai/difavoritkan.
8. `chat_messages` &bull; Percakapan langsung dengan penjual.
