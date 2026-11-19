const db = require('../config/db');

// GET /api/products
// Mendapatkan seluruh daftar produk (bisa filter category, search, minPrice, maxPrice)
async function getAllProducts(req, res) {
  try {
    const { category, search, size, condition, minPrice, maxPrice } = req.query;

    let sql = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND LOWER(category) LIKE ?';
      params.push(`%${category.toLowerCase()}%`);
    }

    if (size) {
      sql += ' AND LOWER(size) = ?';
      params.push(size.toLowerCase());
    }

    if (condition) {
      sql += ' AND LOWER(condition) = ?';
      params.push(condition.toLowerCase());
    }

    if (search) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(seller) LIKE ?)';
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s, s);
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    sql += ' ORDER BY id ASC';

    const rows = await db.all(sql, params);

    // Format images field dari JSON string ke array
    const formatted = rows.map((p) => {
      let imgs = [];
      try {
        imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      } catch (e) {
        imgs = [p.images];
      }
      return {
        ...p,
        images: imgs
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Error getAllProducts:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data produk', error: error.message });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const row = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    if (!row) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    let imgs = [];
    try {
      imgs = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
    } catch (e) {
      imgs = [row.images];
    }

    res.json({
      success: true,
      data: {
        ...row,
        images: imgs
      }
    });
  } catch (error) {
    console.error('Error getProductById:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail produk', error: error.message });
  }
}

// POST /api/products
async function createProduct(req, res) {
  try {
    const { title, price, size, category, condition, seller, city, images, description } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ success: false, message: 'Judul, harga, dan kategori wajib diisi' });
    }

    const priceFormatted = `Rp ${Number(price).toLocaleString('id-ID')}`;
    const imagesJson = JSON.stringify(images || ['assets/images/branding/hero-banner.png']);

    const sql = `
      INSERT INTO products (title, price, price_formatted, size, category, condition, seller, city, images, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      title,
      Number(price),
      priceFormatted,
      size || 'All Size',
      category,
      condition || 'Sangat Baik',
      seller || 'lovedbythia',
      city || 'Surabaya',
      imagesJson,
      description || ''
    ];

    const result = await db.run(sql, params);

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan ke katalog database',
      productId: result.lastID
    });
  } catch (error) {
    console.error('Error createProduct:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk', error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct
};
