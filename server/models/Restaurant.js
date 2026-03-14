const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    cuisine: [String],
    address: {
        street: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    images: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isOpen: { type: Boolean, default: true },
    deliveryTime: { type: Number, default: 30 }, // average in mins
    minOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
