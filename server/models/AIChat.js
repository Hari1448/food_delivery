const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    context: {
        lastViewedRestaurant: String,
        suggestedCuisine: String
    }
}, { timestamps: true });

module.exports = mongoose.model('AIChat', chatSchema);
