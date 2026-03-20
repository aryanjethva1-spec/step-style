import express from 'express';
import { createProduct, updateProduct, deleteProduct, getBrandOrders, updateOrderStatus, getPublicBrands } from '../controllers/brandController.js';
import { protectBrand } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicBrands);

router.post('/products', protectBrand, createProduct);
router.put('/products/:id', protectBrand, updateProduct);
router.delete('/products/:id', protectBrand, deleteProduct);

router.get('/orders/:brandId', protectBrand, getBrandOrders);
router.put('/orders/update/:orderId', protectBrand, updateOrderStatus);

export default router;
