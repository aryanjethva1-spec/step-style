import express from 'express';
import { addOrderItems, getMyOrders, createRazorpayOrder, verifyRazorpayPayment, cancelOrder } from '../controllers/orderController.js';
import { protectAny } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectAny, addOrderItems);
router.get('/myorders', protectAny, getMyOrders);
router.put('/:id/cancel', protectAny, cancelOrder);
router.post('/razorpay/create', protectAny, createRazorpayOrder);
router.post('/razorpay/verify', protectAny, verifyRazorpayPayment);

export default router;
