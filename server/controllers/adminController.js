const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRestaurants = await Restaurant.countDocuments();
        const totalOrders = await Order.countDocuments();

        const revenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalRestaurants,
                totalOrders,
                totalRevenue: revenue[0] ? revenue[0].total : 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { isOpen: true },
            { new: true }
        );
        res.status(200).json({ status: 'success', data: restaurant });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ status: 'success', data: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'name email');
        res.status(200).json({ status: 'success', data: restaurants });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ status: 'success', data: restaurant });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 'success', data: restaurant });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .sort('-createdAt');
        res.status(200).json({ status: 'success', data: orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
