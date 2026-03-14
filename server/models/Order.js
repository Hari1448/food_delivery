const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User with role 'delivery_partner'
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'failed'],
        default: 'unpaid'
    },
    deliveryAddress: {
        street: String,
        city: String,
        zipCode: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
