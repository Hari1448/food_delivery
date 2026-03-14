const mongoose = require('mongoose');
const Order = require('./models/Order');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');
require('dotenv').config();

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const orderCount = await Order.countDocuments();
        const restaurantCount = await Restaurant.countDocuments();
        const userCount = await User.countDocuments();

        console.log(`Orders: ${orderCount}`);
        console.log(`Restaurants: ${restaurantCount}`);
        console.log(`Users: ${userCount}`);

        const restaurants = await Restaurant.find().limit(5);
        console.log('Sample Restaurants:', restaurants.map(r => ({ id: r._id, name: r.name, owner: r.owner })));

        const orders = await Order.find().limit(5);
        console.log('Sample Orders:', orders.map(o => ({ id: o._id, restaurant: o.restaurant, status: o.status, paymentStatus: o.paymentStatus })));

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkDb();
