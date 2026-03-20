import express from 'express';
import { getProducts, getProductById, getProductsByBrandId, createProductReview, getProductReviews, deleteProductReview } from '../controllers/productController.js';
import { protectUser, optionalUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.route('/:id/reviews')
    .get(getProductReviews)
    .post(optionalUser, createProductReview)
    .delete(protectUser, deleteProductReview);
router.get('/:id', getProductById);
router.get('/brand/:brandId', getProductsByBrandId);

export default router;
