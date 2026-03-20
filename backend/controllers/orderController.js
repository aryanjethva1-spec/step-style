import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        res.status(200).json({ message: "Payment verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid signature" });
    }
};

export const addOrderItems = async (req, res) => {
// ... (rest remains same)
    try {
        const { orderItems, shippingAddress, paymentMethod, paymentStatus, discountAmount } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const ordersToSave = await Promise.all(orderItems.map(async (item) => {
                // Fetch product details if name or brandName is missing
                let pName = item.name;
                let bName = item.brandName;
                let bId = item.brandId;

                if (!pName || !bName || !bId) {
                    const productDetails = await Product.findById(item.productId);
                    if (productDetails) {
                        pName = pName || productDetails.name;
                        bName = bName || productDetails.brandName;
                        bId = bId || productDetails.brandId;
                    }
                }

                return {
                    userId: req.buyer._id,
                    userType: req.buyer.type,
                    productId: item.productId,
                    brandId: bId,
                    brandName: bName,
                    productName: pName,
                    selectedSize: item.selectedSize || '',
                    quantity: item.quantity,
                    totalPrice: item.price * item.quantity,
                    discountAmount: discountAmount || 0,
                    address: shippingAddress,
                    paymentMethod,
                    paymentStatus: paymentStatus || 'Pending'
                }
            }));

            const createdOrders = await Order.insertMany(ordersToSave);
            
            // Clear cart
            await Cart.findOneAndUpdate({ userId: req.buyer._id }, { products: [], totalPrice: 0, quantity: 0 });

            res.status(201).json(createdOrders);
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.buyer._id })
            .populate('productId', 'name image brandName')
            .populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            if (order.userId.toString() !== req.buyer._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to cancel this order' });
            }
            if (['Shipped', 'Delivered'].includes(order.orderStatus)) {
                return res.status(400).json({ message: 'Cannot cancel an order that is already shipped or delivered' });
            }
            order.orderStatus = 'Cancelled';
            await order.save();
            res.json({ message: 'Order cancelled successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
