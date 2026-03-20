import User from '../models/User.js';
import Brand from '../models/Brand.js';
import BrandApproval from '../models/BrandApproval.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { sendBrandRejectionEmail, sendBrandApprovalEmail } from '../utils/emailService.js';

// User Management
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({_id: user._id});
             res.json({ message: 'User removed' });
        } else {
             res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

// Brand Management
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ status: 'approved' });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBrandRequests = async (req, res) => {
    try {
        const requests = await BrandApproval.find({ status: 'pending' });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBrandStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const approvalRequest = await BrandApproval.findById(req.params.id);

        if (!approvalRequest) {
            return res.status(404).json({ message: 'Approval request not found' });
        }

        if (status === 'approved') {
            // Move to Brand collection
            const newBrand = await Brand.create({
                brandName: approvalRequest.brandName,
                email: approvalRequest.email,
                password: approvalRequest.password, // This is already hashed by BrandApproval pre-save
                logo: approvalRequest.logo,
                description: approvalRequest.description,
                status: 'approved',
                ownerName: approvalRequest.ownerName,
                username: approvalRequest.username,
                address: approvalRequest.address,
                city: approvalRequest.city,
                state: approvalRequest.state,
                pincode: approvalRequest.pincode,
                country: approvalRequest.country,
                contact: approvalRequest.contact,
                gstNo: approvalRequest.gstNo
            });
            
            // Remove from Approval collection
            await BrandApproval.deleteOne({ _id: approvalRequest._id });

            // Send approval email
            try {
                await sendBrandApprovalEmail(newBrand.brandName, newBrand.email);
            } catch (err) {
                console.error('Failed to send approval email:', err);
                // We still proceed as the brand is created
            }

            res.json(newBrand);
        } else if (status === 'rejected') {
            const { brandName, email } = approvalRequest;
            
            // Delete record first to prevent retry issues if email fails partially
            await BrandApproval.deleteOne({ _id: approvalRequest._id });
            
            // Send rejection email
            try {
                await sendBrandRejectionEmail(brandName, email);
            } catch (err) {
                console.error('Failed to send rejection email:', err);
                // We still proceed as the record is deleted
            }
            
            res.json({ message: 'Brand request rejected and data removed' });
        } else {
            res.status(400).json({ message: 'Invalid status' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBrand = async (req, res) => {
     try {
        const brand = await Brand.findById(req.params.id);
        if (brand) {
            await Brand.deleteOne({_id: brand._id});
            // Also cleanup their products
            await Product.deleteMany({ brandId: brand._id });
            res.json({ message: 'Brand removed' });
        } else {
             res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Order Management & Stats
export const getAllOrders = async (req, res) => {
    try{
         const orders = await Order.find({}).populate('userId', 'name').populate('brandId', 'brandName');
         res.json(orders);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const adminUpdateOrderStatus = async (req, res) => {
    try{
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.orderId);

        if(order) {
            order.orderStatus = orderStatus;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export const getDashboardStats = async (req, res) => {
     try{
         const totalUsers = await User.countDocuments({ role: 'user' });
         const allUsers = await User.countDocuments({});
         const totalBrands = await Brand.countDocuments({ status: 'approved' });
         const totalProducts = await Product.countDocuments();
         const totalOrders = await Order.countDocuments();
         const totalApprovalRequests = await BrandApproval.countDocuments({ status: 'pending' });
         
         const totalRevenue = totalOrders * 100;

         res.json({
             totalUsers,
             allUsers,
             totalBrands,
             totalProducts,
             totalOrders,
             totalApprovalRequests,
             totalRevenue
         })

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Review Management
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('userId', 'name email')
            .populate('productId', 'name image');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (review) {
            const productId = review.productId;
            await Review.deleteOne({ _id: review._id });

            // Update product rating
            const product = await Product.findById(productId);
            if (product) {
                const reviews = await Review.find({ productId });
                if (reviews.length > 0) {
                    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
                    product.rating = Math.round(avgRating * 10) / 10;
                } else {
                    product.rating = 0;
                }
                await product.save();
            }

            res.json({ message: 'Review removed' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

