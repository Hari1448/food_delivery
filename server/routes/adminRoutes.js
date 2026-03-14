const express = require('express');
const router = express.Router();
const {
    getStats,
    approveRestaurant,
    getAllUsers,
    deleteUser,
    getAllRestaurants,
    createRestaurant,
    deleteRestaurant,
    updateRestaurant,
    getAllOrders
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/restaurants', getAllRestaurants);
router.post('/restaurants', createRestaurant);
router.patch('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.patch('/approve-restaurant/:id', approveRestaurant);
router.get('/orders', getAllOrders);


module.exports = router;
