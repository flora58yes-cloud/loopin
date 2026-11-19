require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. LOGGING REQUEST (UNTUK KEMUDAHAN DEBUGGING TUGAS KULIAH)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString('id-ID')}] ${req.method} ${req.originalUrl}`);
  next();
});

// 3. API ENDPOINTS
app.use('/api', apiRoutes);

// 4. SERVE STATIC FRONTEND (WEBSITE LOOPIN)
// Memungkinkan seluruh website dibuka langsung melalui http://localhost:5000
const rootDir = path.resolve(__dirname, '..');
app.use(express.static(rootDir));

// Fallback untuk route front-end
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada internal server backend',
    error: err.message
  });
});

// 6. JALANKAN SERVER
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🌿 LoopIn Backend & Database Server Aktif!`);
  console.log(`📡 URL API Server: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Website Frontend: http://localhost:${PORT}`);
  console.log('====================================================');
});
