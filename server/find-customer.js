const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const findCustomer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const customer = await User.findOne({ role: 'customer' });
        console.log('Customer:', customer ? { id: customer._id, name: customer.name } : 'None');
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

findCustomer();
