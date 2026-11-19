const db = require('../config/db');

// POST /api/orders
async function createOrder(req, res) {
  try {
    const { userId, courier, origin, destination, items, subtotal, shippingCost } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Item pesanan tidak boleh kosong' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const resi = `LPN-2026-${randomSuffix}`;
    const totalPayment = (Number(subtotal) || 0) + (Number(shippingCost) || 0);

    const orderSql = `
      INSERT INTO orders (resi, user_id, courier, origin, destination, eta, current_step, subtotal, shipping_cost, total_payment, status)
      VALUES (?, ?, ?, ?, ?, 'Estimasi 2-3 hari', 1, ?, ?, ?, 'Sedang Diproses')
    `;
    const orderParams = [
      resi,
      userId || 1,
      courier || 'SiCepat Green Eco',
      origin || 'LoopIn Central Hub Surabaya',
      destination || 'Surabaya',
      subtotal,
      shippingCost || 0,
      totalPayment
    ];

    const orderResult = await db.run(orderSql, orderParams);
    const orderId = orderResult.lastID;

    // Masukkan item pesanan
    for (const item of items) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, product_title, product_image, price, qty)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id || 1, item.title || 'Preloved Item', item.image || 'assets/images/catalog/1.jpg', item.price || 0, item.qty || 1]
      );
    }

    // Masukkan riwayat tracking awal
    await db.run(
      `INSERT INTO order_tracking_history (order_id, timestamp_str, title, description, is_active)
       VALUES (?, 'Hari ini - Baru Saja', 'Pesanan Berhasil Dibuat', 'Menunggu proses sortir & eco-packaging di LoopIn Hub.', 1)`,
      [orderId]
    );

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      resi,
      orderId,
      totalPayment
    });
  } catch (error) {
    console.error('Error createOrder:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses pesanan', error: error.message });
  }
}

// GET /api/orders
async function getOrders(req, res) {
  try {
    const userId = req.query.userId || 1;
    const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);

    for (const order of orders) {
      order.items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    }

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error getOrders:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar pesanan' });
  }
}

// GET /api/orders/track/:resi
async function getTracking(req, res) {
  try {
    const { resi } = req.params;
    const order = await db.get('SELECT * FROM orders WHERE resi = ?', [resi]);

    if (!order) {
      return res.status(404).json({ success: false, message: `Nomor resi ${resi} tidak ditemukan` });
    }

    const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    const history = await db.all('SELECT * FROM order_tracking_history WHERE order_id = ? ORDER BY id ASC', [order.id]);

    res.json({
      success: true,
      data: {
        ...order,
        items,
        history
      }
    });
  } catch (error) {
    console.error('Error getTracking:', error);
    res.status(500).json({ success: false, message: 'Gagal melacak nomor resi' });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getTracking
};
