import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protectAny } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protectAny, getWishlist);
router.route('/add').post(protectAny, addToWishlist);
router.route('/remove/:productId').delete(protectAny, removeFromWishlist);

export default router;
