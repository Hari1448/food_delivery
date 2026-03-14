const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);

// Restaurant and Admin only
router.get('/restaurant/:restaurantId', restrictTo('restaurant_owner', 'admin'), orderController.getRestaurantOrders);
router.patch('/:id/status', restrictTo('restaurant_owner', 'admin'), orderController.updateOrderStatus);

module.exports = router;
