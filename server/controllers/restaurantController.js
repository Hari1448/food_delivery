const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isOpen: true });
        res.status(200).json({ status: 'success', data: restaurants });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRestaurantMenu = async (req, res) => {
    try {
        const menu = await FoodItem.find({ restaurant: req.params.id, isAvailable: true });
        res.status(200).json({ status: 'success', data: menu });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const newItem = await FoodItem.create({
            restaurant: req.params.id,
            name,
            description,
            price,
            category,
            image
        });
        res.status(201).json({ status: 'success', data: newItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'No restaurant found for this owner.' });
        }
        res.status(200).json({ status: 'success', data: restaurant });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOneAndUpdate(
            { owner: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!restaurant) {
            return res.status(404).json({ message: 'No restaurant found for this owner.' });
        }
        res.status(200).json({ status: 'success', data: restaurant });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const updatedItem = await FoodItem.findByIdAndUpdate(
            req.params.itemId,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({ status: 'success', data: updatedItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.params.itemId);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllFoodItems = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }
        const items = await FoodItem.find(query).populate('restaurant', 'name rating deliveryTime');
        res.status(200).json({ status: 'success', data: items });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRestaurantStats = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const stats = await Order.aggregate([
            { $match: { restaurant: restaurant._id, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $count: {} }
                }
            }
        ]);

        const uniqueCustomers = await Order.distinct('user', { 
            restaurant: restaurant._id,
            status: { $ne: 'cancelled' }
        });

        res.status(200).json({
            status: 'success',
            data: {
                revenue: stats[0]?.totalRevenue || 0,
                orders: stats[0]?.totalOrders || 0,
                customers: uniqueCustomers.length,
                avgDelivery: "25 min"
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRestaurantCustomers = async (req, res) => {
    try {
        // Fetch ALL users as requested for the restaurant owner view
        const users = await User.find().select('-password');
        res.status(200).json({ status: 'success', data: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
        res.status(200).json({ status: 'success', data: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
