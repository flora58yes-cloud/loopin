# 🌿 LoopIn &bull; Web Programming Semester 3

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

Repositori resmi seluruh tugas praktikum dan proyek akhir **Mata Kuliah Web Programming (Semester 3)**.

* **Pengembang / Mahasiswa**: Flora Jasmine
* **Fokus Proyek**: Platform E-Commerce Kurasi Fesyen Preloved (*Sustainable Circular Fashion*) bernama **LoopIn** (*"Give it another loop"*).
* **Arsitektur**: Full-Stack Web Application (Frontend Vanilla HTML/CSS/JS + Backend Node.js Express + Database SQLite & MySQL).

---

## 📌 Daftar Isi
1. [Tentang Proyek LoopIn](#-tentang-proyek-loopin)
2. [Fitur Utama Platform](#-fitur-utama-platform)
3. [Daftar Halaman & Navigasi Frontend](#-daftar-halaman--navigasi-frontend)
4. [Backend REST API & Database](#-backend-rest-api--database)
5. [Tugas Mingguan Praktikum](#-tugas-mingguan-praktikum)
6. [Struktur Direktori Repositori](#-struktur-direktori-repositori)
7. [Panduan Menjalankan Proyek](#-panduan-menjalankan-proyek)
8. [Panduan Push ke GitHub](#-panduan-push-ke-github)

---

## 🌿 Tentang Proyek LoopIn

**LoopIn** adalah platform e-commerce preloved fashion berbasis web yang dirancang untuk mendukung gaya hidup berkelanjutan (*circular fashion*). Melalui platform ini, pakaian berkualitas yang masih layak pakai dapat menemukan pemilik baru, sehingga mengurangi limbah tekstil dan jejak karbon.

Desain antarmuka LoopIn mengusung palet warna organik (*Warm Oat*, *Sage Green*, *Deep Charcoal*, dan *Soft Amber*) dengan tipografi klasik modern (*Playfair Display* & *Inter*).

---

## ✨ Fitur Utama Platform

* 🔍 **Katalog Terpusat & Live Search**: Pencarian barang secara instan berdasarkan judul, kategori, merek, kota, atau kata kunci deskripsi.
* 🏷️ **Multi-Filter Lanjutan**: Penyaringan produk berdasarkan kategori (Atasan, Bawahan, Rajut, Luaran), ukuran (S, M, L, All Size), kondisi barang (Seperti Baru, Sangat Baik, Layak Pakai), serta rentang harga.
* 👗 **Halaman Detail Produk Interaktif**: Menampilkan galeri multi-foto, informasi detail penjual, estimasi jejak karbon yang dihemat (*CO₂ saved*), serta opsi tambah ke keranjang atau chat langsung.
* 🛒 **Keranjang Belanja Dinamis (`cart.html`)**: Sistem keranjang berbasis `localStorage` dan tersinkronisasi dengan Database API saat checkout.
* 💬 **Simulasi Live Chat Penjual (`chat.html`)**: Fitur percakapan interaktif dengan respon otomatis penjual yang kontekstual dan tersimpan di database.
* 📦 **Profil Pengguna & Pelacakan Paket (`profile-tracking.html`)**:
  * Dashboard profil pengguna (*Flora Jasmine*).
  * Pelacakan resi kurir real-time (*timeline stepper*) lengkap dengan status sortir dan estimasi tiba.
  * Tab Favorit / Wishlist interaktif.
  * Generator dan pengunduhan logo transparan LoopIn berbasis HTML5 Canvas.
* 🔐 **Autentikasi Pengguna (`auth.html`)**: Form masuk dan pendaftaran akun yang terhubung ke database.

---

## 📄 Daftar Halaman & Navigasi Frontend

| File | Deskripsi Halaman |
| :--- | :--- |
| [`index.html`](index.html) | Halaman beranda, welcome banner, katalog produk lengkap, dan pencarian. |
| [`product_detail.html`](product_detail.html) | Halaman detail produk (foto besar, deskripsi, profil penjual, dan tombol aksi). |
| [`cart.html`](cart.html) | Halaman keranjang belanja dan ringkasan pesanan. |
| [`chat.html`](chat.html) | Halaman simulasi chat langsung dengan pemilik pakaian/toko. |
| [`profile-tracking.html`](profile-tracking.html) | Halaman profil pengguna, pelacakan paket pesanan, dan daftar wishlist. |
| [`auth.html`](auth.html) | Halaman autentikasi (Login dan Registrasi akun). |
| [`tugas-kuliah/index.html`](tugas-kuliah/index.html) | Hub portal kumpulan tugas praktikum mingguan. |

---

## 🗄️ Backend REST API & Database

Proyek ini telah dilengkapi dengan modul backend di folder [`backend/`](backend/):

* **Database Engine**:
  * **SQLite 3** (`backend/database/loopin.db`): Database file-based tanpa perlu install software database server terpisah.
  * **MySQL / phpMyAdmin** (`backend/database/schema.sql`): Skema SQL lengkap dengan tabel dan data seed yang siap diimpor ke phpMyAdmin/XAMPP.
* **Tabel Database**:
  1. `users`: Autentikasi pembeli & penjual.
  2. `categories`: Kategori pakaian.
  3. `products`: Katalog pakaian preloved, harga, foto, dan kondisi.
  4. `orders`: Pesanan checkout dan nomor resi kurir.
  5. `order_items`: Rincian item baju di tiap pesanan.
  6. `order_tracking_history`: Tahapan pelacakan resi kurir.
  7. `wishlists`: Daftar baju yang disukai.
  8. `chat_messages`: Percakapan real-time dengan penjual.

### Daftar Endpoint REST API:
* `GET /api/products` &bull; Mengambil katalog pakaian (mendukung filter & search).
* `GET /api/products/:id` &bull; Detail 1 produk.
* `POST /api/products` &bull; Menambah produk baru ke katalog.
* `POST /api/auth/login` &bull; Masuk akun.
* `POST /api/auth/register` &bull; Pendaftaran akun baru.
* `GET /api/auth/profile` &bull; Mengambil data profil pengguna.
* `POST /api/orders` &bull; Membuat pesanan baru dan menghasilkan resi.
* `GET /api/orders/track/:resi` &bull; Melacak riwayat pengiriman kurir.
* `GET /api/chat/:productId` &bull; Riwayat pesan chat produk.
* `POST /api/chat/:productId` &bull; Mengirim pesan chat pembeli & menerima balasan penjual.

---

## 📚 Tugas Mingguan Praktikum

Selain proyek utama LoopIn, repositori ini juga mendokumentasikan tugas praktikum awal semester:

* 📂 **Pertemuan 3**: [`tugas-kuliah/pertemuan-3/index.html`](tugas-kuliah/pertemuan-3/index.html)  
  *Topik*: Pengenalan HTML Dasar, Text Formatting, dan Penyisipan Gambar Biodata Diri.
* 📂 **Pertemuan 4**: [`tugas-kuliah/pertemuan-4/index.html`](tugas-kuliah/pertemuan-4/index.html)  
  *Topik*: Penerapan CSS Styling, Flexbox Layout, Shadow Effect, dan Komponen Kartu Profil (*Profile Card*).

---

## 📁 Struktur Direktori Repositori

```text
MATKUL WEB PROGRAMMING SEMESTER 3/
│
├── backend/                              # Modul Backend REST API & Database
│   ├── config/
│   │   └── db.js                         # Konfigurasi koneksi SQLite / MySQL / Fallback
│   ├── controllers/
│   │   ├── authController.js             # Logika login & register
│   │   ├── chatController.js             # Logika pesan & balasan chat
│   │   ├── orderController.js            # Logika pesanan & pelacakan resi
│   │   └── productController.js          # Logika katalog produk
│   ├── database/
│   │   └── schema.sql                    # Skema tabel SQL & data seed awal
│   ├── models/
│   │   └── initDatabase.js               # Script inisialisasi ulang database
│   ├── routes/
│   │   └── api.js                        # Router REST API
│   ├── .env.example                      # Contoh variabel lingkungan
│   ├── package.json                      # Konfigurasi dependensi Node.js
│   ├── README.md                         # Dokumentasi teknis backend API
│   └── server.js                         # File utama server Express.js
│
├── assets/                               # Folder aset statis frontend
│   ├── css/
│   │   ├── style.css                     # Stylesheet utama platform LoopIn
│   │   └── profile-tracking.css          # Stylesheet profil & tracking
│   │
│   ├── js/
│   │   ├── catalog.js                    # Core frontend logic: katalog, live search, filter, API sync
│   │   └── profile-tracking.js           # Core frontend logic: profil, tracking kurir, wishlist, canvas
│   │
│   └── images/
│       ├── branding/                     # Identitas visual brand LoopIn & foto profil
│       │   ├── logo.png                  # Logo utama LoopIn
│       │   ├── logo-dark.png             # Logo LoopIn varian gelap
│       │   ├── logo-horizontal.png       # Logo horizontal transparan
│       │   ├── hero-banner.png           # Banner sambutan kemasan kraft
│       │   └── avatar-flora.jpg          # Foto profil pengguna (Flora Jasmine)
│       │
│       └── catalog/                      # Foto katalog barang preloved (1.jpg s/d 10.2.jpg)
│           ├── 1.jpg s/d 10.jpg
│           └── 7.2.jpg, 8.2.jpg, 8.3.jpg, 9.2.jpg, 10.2.jpg
│
├── tugas-kuliah/                         # Arsip praktikum mata kuliah
│   ├── index.html                        # Portal navigasi tugas akademik
│   ├── pertemuan-3/
│   │   ├── index.html                    # Tugas HTML Dasar (The Biodata)
│   │   └── Foto Flora.jpg
│   └── pertemuan-4/
│       ├── index.html                    # Tugas CSS Flexbox (The Profile Card)
│       └── Foto Flora.jpg
│
├── archive/                              # Arsip draft kode legacy & backup
│   ├── draft-pertemuan-4.txt
│   └── loopin_profil_pengguna_lacak_paket.html
│
├── auth.html                             # Halaman masuk & pendaftaran
├── cart.html                             # Halaman keranjang belanja
├── chat.html                             # Halaman simulasi chat penjual
├── index.html                            # Halaman beranda utama
├── product_detail.html                   # Halaman detail produk
├── profile-tracking.html                 # Halaman profil pengguna & lacak paket
├── .gitignore                            # Konfigurasi berkas yang diabaikan Git
└── README.md                             # Dokumentasi repositori ini
```

---

## 🚀 Panduan Menjalankan Proyek

### Cara 1: Menjalankan Frontend Statis (Tanpa Backend)
Proyek ini dirancang secara **hybrid**. Jika Anda belum menginstal Node.js atau ingin menjalankannya di **GitHub Pages**:
1. Buka file [`index.html`](index.html) langsung di browser (klik dua kali) atau klik kanan pilih **Open with Live Server** di VS Code.
2. Seluruh fungsi katalog, keranjang, filter, dan profil tetap berjalan normal menggunakan data seed lokal.

### Cara 2: Menjalankan Full-Stack (Frontend + Backend Database)
1. Buka terminal di folder `backend`:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Buka browser di alamat:
   ```text
   http://localhost:5000
   ```
3. Website LoopIn akan berjalan dengan dukungan database SQLite/MySQL secara real-time!

---

## 📤 Panduan Push ke GitHub

Jalankan perintah berikut di Git Bash atau PowerShell:

```bash
# 1. Masuk ke folder proyek
cd "c:\Users\dell 7320\OneDrive\Documents\TUGAS KULIAH\MATKUL WEB PROGRAMMING SEMESTER 3"

# 2. Stage seluruh berkas (termasuk folder backend & database)
git add .

# 3. Commit perubahan
git commit -m "feat: tambahkan backend REST API Express dan database SQLite/MySQL untuk LoopIn"

# 4. Push ke GitHub
git push -u origin main
```
