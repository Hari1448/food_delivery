const mongoose = require('mongoose');
const Order = require('./models/Order');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');
require('dotenv').config();

const debugStats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');

        const restaurant = await Restaurant.findOne({ name: /Hari/i });
        if (!restaurant) {
            console.log('Restaurant not found');
            return;
        }
        console.log('Found Restaurant:', { id: restaurant._id, name: restaurant.name, owner: restaurant.owner });

        const owner = await User.findById(restaurant.owner);
        console.log('Owner Details:', owner ? { id: owner._id, name: owner.name, email: owner.email, role: owner.role } : 'None');

        const orders = await Order.find({ restaurant: restaurant._id });
        console.log(`Total orders for this restaurant: ${orders.length}`);
        
        const paidOrders = await Order.find({ restaurant: restaurant._id, paymentStatus: 'paid' });
        console.log(`Paid orders for this restaurant: ${paidOrders.length}`);

        const stats = await Order.aggregate([
            { $match: { restaurant: restaurant._id, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $count: {} }
                }
            }
        ]);
        console.log('Aggregation result:', stats);

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

debugStats();
