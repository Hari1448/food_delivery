const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

const findCustomer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const customer = await User.findOne({ role: 'customer' });
        fs.writeFileSync('customer_id.txt', customer ? customer._id.toString() : 'none');
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

findCustomer();
