const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const { signToken, signRefreshToken } = require('../config/jwtConfig');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone
        });

        const accessToken = signToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        if (role === 'restaurant_owner') {
            await Restaurant.create({
                name: `${name}'s Gourmet Kitchen`,
                owner: user._id,
                description: 'A new culinary destination coming soon!',
                cuisine: ['Global'],
                isOpen: false // Need admin approval
            });
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            status: 'success',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const accessToken = signToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ status: 'success', message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
