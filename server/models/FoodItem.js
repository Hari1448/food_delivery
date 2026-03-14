const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    category: { type: String, required: true }, // e.g., Starter, Main, Drink
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: false },
    spicyLevel: { type: Number, min: 0, max: 3 }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
