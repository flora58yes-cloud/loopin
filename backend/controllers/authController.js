const db = require('../config/db');

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    const user = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak valid' });
    }

    // Hindari mengirim plain password kembali ke client
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      message: 'Login berhasil',
      user: userData
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem saat login', error: error.message });
  }
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, phone, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
    }

    const existing = await db.get('SELECT id FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar, silakan gunakan email lain atau login' });
    }

    const sql = `
      INSERT INTO users (name, email, password, role, phone, city, avatar)
      VALUES (?, ?, ?, 'buyer', ?, ?, 'assets/images/branding/avatar-flora.jpg')
    `;
    const params = [name, email.toLowerCase().trim(), password, phone || '', city || 'Surabaya'];

    const result = await db.run(sql, params);

    res.status(201).json({
      success: true,
      message: 'Registrasi akun LoopIn berhasil',
      userId: result.lastID,
      user: {
        id: result.lastID,
        name,
        email,
        role: 'buyer'
      }
    });
  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({ success: false, message: 'Gagal mendaftarkan akun', error: error.message });
  }
}

// GET /api/auth/profile
async function getProfile(req, res) {
  try {
    const userId = req.query.id || 1;
    const user = await db.get('SELECT id, name, email, role, phone, city, address, avatar, created_at FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Profil pengguna tidak ditemukan' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error getProfile:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data profil' });
  }
}

module.exports = {
  login,
  register,
  getProfile
};
