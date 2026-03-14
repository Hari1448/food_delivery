const express = require('express');
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantMenu,
    addMenuItem,
    getMyRestaurant,
    updateRestaurant,
    deleteMenuItem,
    updateMenuItem,
    getAllFoodItems,
    getRestaurantStats,
    getRestaurantCustomers,
    updateCustomer,
    deleteCustomer
} = require('../controllers/restaurantController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getAllRestaurants);
router.get('/menu-items', getAllFoodItems);
router.get('/my-restaurant', protect, restrictTo('restaurant_owner'), getMyRestaurant);
router.patch('/my-restaurant', protect, restrictTo('restaurant_owner'), updateRestaurant);
router.get('/stats', protect, restrictTo('restaurant_owner'), getRestaurantStats);
router.get('/customers', protect, restrictTo('restaurant_owner'), getRestaurantCustomers);
router.patch('/customers/:id', protect, restrictTo('restaurant_owner'), updateCustomer);
router.delete('/customers/:id', protect, restrictTo('restaurant_owner'), deleteCustomer);
router.get('/:id/menu', getRestaurantMenu);


// Only restaurant owners can add menu items
router.post('/:id/menu', protect, restrictTo('restaurant_owner', 'admin'), addMenuItem);
router.patch('/menu/:itemId', protect, restrictTo('restaurant_owner', 'admin'), updateMenuItem);
router.delete('/menu/:itemId', protect, restrictTo('restaurant_owner', 'admin'), deleteMenuItem);

module.exports = router;

