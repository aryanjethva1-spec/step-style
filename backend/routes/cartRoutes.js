import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartQuantity } from '../controllers/cartController.js';
import { protectAny } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectAny, getCart);
router.post('/add', protectAny, addToCart);
router.put('/update-quantity', protectAny, updateCartQuantity);
router.delete('/remove/:productId', protectAny, removeFromCart);

export default router;
