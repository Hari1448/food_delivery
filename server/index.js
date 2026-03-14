const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./middleware/errorMiddleware');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://i.pravatar.cc", "https://via.placeholder.com"],
        },
    },
})); // Security headers with relaxed CSP for images
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Attach Socket.io to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Global Error Handler
app.use(globalErrorHandler);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Hari's Kitchen API" });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check for seed flag
        if (process.argv.includes('--seed')) {
            const seedData = require('./seed');
            await seedData();
        }

        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
