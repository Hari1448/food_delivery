const Order = require('../models/Order');
const AppError = require('../middleware/errorMiddleware');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { restaurant, items, totalAmount, deliveryAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = await Order.create({
            user: req.user._id,
            restaurant,
            items,
            totalAmount,
            deliveryAddress,
            paymentStatus: 'paid' // Assuming payment is done in this flow
        });

        // Emit socket event to restaurant
        req.io.emit(`newOrder-${restaurant}`, order);

        res.status(201).json({
            status: 'success',
            data: order
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('restaurant')
            .populate('items.foodItem')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: orders
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get restaurant specific orders
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private (Owner/Admin)
exports.getRestaurantOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ restaurant: req.params.restaurantId })
            .populate('user', 'name email phone')
            .populate('items.foodItem')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: orders
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Owner/Admin/DeliveryPartner)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Emit socket event to user
        req.io.emit(`orderStatusUpdate-${order.user}`, order);

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
