const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const orders = await Order.find();
    console.log(`Found ${orders.length} orders`);
    for (const o of orders) {
        console.log(`Order ID: ${o._id}, Status: ${o.status}, Payment: ${o.paymentStatus}, Restaurant: ${o.restaurant}`);
        if (o.paymentStatus !== 'paid') {
            console.log("Updating paymentStatus to 'paid'");
            o.paymentStatus = 'paid';
            await o.save();
        }
    }
    process.exit();
}
check();
