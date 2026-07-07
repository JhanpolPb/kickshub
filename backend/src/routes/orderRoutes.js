const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const {
    getOrders,
    getOrderById,
    createOrder,
}= require('../controllers/orderController');

router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/', authMiddleware, createOrder);

module.exports = router;