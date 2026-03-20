import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import brandAuthRoutes from './routes/brandAuthRoutes.js';
import productRoutes from './routes/productRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // ✅ Razorpay route

import path from 'path';

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

// Compress responses
app.use(compression());

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/brand/auth', brandAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // ✅ Razorpay API
app.use('/api/otp', otpRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Static Uploads
const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, '/uploads'), {
    maxAge: '1d',
    etag: true
}));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.stack}`);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});

// Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
    console.error(`[UnhandledRejection] Error: ${err.message}`);
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error(`[UncaughtException] Error: ${err.message}`);
});