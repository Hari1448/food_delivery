const mongoose = require('mongoose');
const Order = require('./models/Order');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const simulateOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const restaurantId = '69ad1da44f69dda8cec653ee';
        const userId = '6980b717997a733f42682597';

        // Find a menu item for this restaurant or just create a dummy one if none exists
        let foodItem = await FoodItem.findOne({ restaurant: restaurantId });
        if (!foodItem) {
            foodItem = await FoodItem.create({
                restaurant: restaurantId,
                name: 'Simulated Dish',
                price: 500,
                category: 'Main',
                description: 'A dish created for testing'
            });
        }

        const order = await Order.create({
            user: userId,
            restaurant: restaurantId,
            items: [{
                foodItem: foodItem._id,
                quantity: 1,
                price: foodItem.price
            }],
            totalAmount: foodItem.price + 40 + (foodItem.price * 0.05),
            deliveryAddress: { street: 'Main St', city: 'Mumbai', zipCode: '400001' },
            paymentStatus: 'paid',
            status: 'pending'
        });

        console.log('Order created:', order._id);
        
        // Note: In real app, the controller would emit the socket event.
        // Since I'm running this script outside the express app, I won't emit it here
        // UNLESS I connect to the socket, but easier is to just refresh the page in browser subagent.

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

simulateOrder();
