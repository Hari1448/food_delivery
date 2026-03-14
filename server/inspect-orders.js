const mongoose = require('mongoose');
const Order = require('./models/Order');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const inspectOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const orders = await Order.find().lean();
        console.log('--- ALL ORDERS ---');
        orders.forEach(o => {
            console.log(`Order ID: ${o._id}, Restaurant: ${o.restaurant}, PaymentStatus: ${o.paymentStatus}, Total: ${o.totalAmount}`);
        });

        const restaurants = await Restaurant.find().lean();
        console.log('--- ALL RESTAURANTS ---');
        restaurants.forEach(r => {
            console.log(`Restaurant ID: ${r._id}, Name: ${r.name}, Owner: ${r.owner}`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

inspectOrders();
