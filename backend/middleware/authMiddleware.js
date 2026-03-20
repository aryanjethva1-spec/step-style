import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Brand from '../models/Brand.js';

export const protectUser = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;
    console.log(`[Auth] Token received: ${token ? 'YES' : 'NO'}`);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(`[Auth] Decoded ID: ${decoded.id}`);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('[Auth] Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const optionalUser = async (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.error('[Auth] Optional token verification failed:', error.message);
        }
    }
    next();
};

export const adminUser = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export const protectBrand = async (req, res, next) => {
    let token;

    token = req.cookies.jwtBrand;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.brand = await Brand.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
export const protectAny = async (req, res, next) => {
    let token;

    if (req.cookies.jwt) {
        token = req.cookies.jwt;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) {
                req.buyer = { _id: req.user._id, role: req.user.role, type: 'user' };
                return next();
            }
        } catch (error) {
            console.error('User token failed');
        }
    }

    if (req.cookies.jwtBrand) {
        token = req.cookies.jwtBrand;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.brand = await Brand.findById(decoded.id).select('-password');
            if (req.brand) {
                req.buyer = { _id: req.brand._id, role: 'brand', type: 'brand' };
                return next();
            }
        } catch (error) {
            console.error('Brand token failed');
        }
    }

    res.status(401).json({ message: 'Not authorized, login required' });
};
