const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const chatController = require('../controllers/chatController');

// Test & Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'LoopIn REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 1. PRODUCT ROUTES
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);

// 2. AUTH & USER ROUTES
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/profile', authController.getProfile);

// 3. ORDER & TRACKING ROUTES
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/track/:resi', orderController.getTracking);

// 4. CHAT ROUTES
router.get('/chat/:productId', chatController.getMessages);
router.post('/chat/:productId', chatController.sendMessage);

module.exports = router;
