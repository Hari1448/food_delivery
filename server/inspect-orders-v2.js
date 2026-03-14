const mongoose = require('mongoose');
const Order = require('./models/Order');
const Restaurant = require('./models/Restaurant');
const fs = require('fs');
require('dotenv').config();

const inspectOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const orders = await Order.find().lean();
        let output = '--- ALL ORDERS ---\n';
        orders.forEach(o => {
            output += `Order ID: ${o._id}, Restaurant: ${o.restaurant}, PaymentStatus: ${o.paymentStatus}, Total: ${o.totalAmount}\n`;
        });

        const restaurants = await Restaurant.find().lean();
        output += '\n--- ALL RESTAURANTS ---\n';
        restaurants.forEach(r => {
            output += `Restaurant ID: ${r._id}, Name: ${r.name}, Owner: ${r.owner}\n`;
        });

        fs.writeFileSync('inspect_results.txt', output);
        console.log('Results written to inspect_results.txt');

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

inspectOrders();
