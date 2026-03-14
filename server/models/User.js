const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['customer', 'restaurant_owner', 'delivery_partner', 'admin'],
        default: 'customer'
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    address: [{
        label: String, // Home, Work, etc.
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: { type: Boolean, default: false }
    }],
    avatar: {
        type: String,
        default: ''
    },
    refreshToken: String
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
