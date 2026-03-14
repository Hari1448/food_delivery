const mongoose = require('mongoose');
require('dotenv').config();
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

async function sync() {
    await mongoose.connect(process.env.MONGODB_URI);

    const hari = await Restaurant.findOne({ name: "Hari's Kitchen" });
    const greenBowl = await Restaurant.findOne({ name: "The Green Bowl" });

    if (hari && greenBowl) {
        console.log(`Updating orders from ${greenBowl.name} to ${hari.name}`);
        const result = await Order.updateMany(
            { restaurant: greenBowl._id },
            { $set: { restaurant: hari._id } }
        );
        console.log(`Updated ${result.modifiedCount} orders.`);
    } else {
        console.log("Restaurants not found", { hari: !!hari, greenBowl: !!greenBowl });
    }

    process.exit();
}

sync();
