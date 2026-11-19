const db = require('../config/db');

// GET /api/chat/:productId
async function getMessages(req, res) {
  try {
    const { productId } = req.params;
    const messages = await db.all(
      'SELECT * FROM chat_messages WHERE product_id = ? ORDER BY id ASC',
      [productId]
    );

    res.json({
      success: true,
      productId: Number(productId),
      data: messages
    });
  } catch (error) {
    console.error('Error getMessages:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesan' });
  }
}

// POST /api/chat/:productId
async function sendMessage(req, res) {
  try {
    const { productId } = req.params;
    const { message, senderName } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' });
    }

    // 1. Simpan pesan dari pembeli
    const insertSql = `
      INSERT INTO chat_messages (product_id, sender, sender_name, message)
      VALUES (?, 'buyer', ?, ?)
    `;
    await db.run(insertSql, [productId, senderName || 'Flora Jasmine', message.trim()]);

    // 2. Buat simulasi balasan otomatis penjual yang kontekstual
    let sellerReply = 'Halo kak! Barang ini masih ada dan kondisinya bersih siap pakai. Ada yang ingin ditanyakan lagi?';
    const lower = message.toLowerCase();

    if (lower.includes('nego') || lower.includes('tawar') || lower.includes('kurang')) {
      sellerReply = 'Halo! Untuk harga pas ya kak, sudah kami beri harga terbaik untuk pakaian preloved berkualitas dan terkurasi.';
    } else if (lower.includes('ongkir') || lower.includes('kirim') || lower.includes('kapan')) {
      sellerReply = 'Bisa dikirim hari ini sebelum jam 16.00 WIB kak! Pengiriman aman menggunakan packaging ramah lingkungan.';
    } else if (lower.includes('minus') || lower.includes('robek') || lower.includes('cacat')) {
      sellerReply = 'Tidak ada minus kak, sudah melewati QC ketat tim kurasi LoopIn dan di-steam sanitizing bebas kuman.';
    }

    // Simpan balasan penjual
    await db.run(
      `INSERT INTO chat_messages (product_id, sender, sender_name, message)
       VALUES (?, 'seller', 'Penjual LoopIn', ?)`,
      [productId, sellerReply]
    );

    res.status(201).json({
      success: true,
      message: 'Pesan terkirim',
      reply: {
        sender: 'seller',
        senderName: 'Penjual LoopIn',
        message: sellerReply,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    });
  } catch (error) {
    console.error('Error sendMessage:', error);
    res.status(500).json({ success: false, message: 'Gagal mengirim pesan' });
  }
}

module.exports = {
  getMessages,
  sendMessage
};
