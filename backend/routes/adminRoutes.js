import express from 'express';
import { getUsers, deleteUser, getBrands, getBrandRequests, updateBrandStatus, deleteBrand, getAllOrders, adminUpdateOrderStatus, getDashboardStats, getAllProducts, getAllReviews, deleteReview } from '../controllers/adminController.js';
import { protectUser, adminUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protectUser, adminUser, getUsers);
router.delete('/users/:id', protectUser, adminUser, deleteUser);

router.get('/brands', protectUser, adminUser, getBrands);
router.get('/brand-requests', protectUser, adminUser, getBrandRequests);
router.put('/brands/:id', protectUser, adminUser, updateBrandStatus);
router.delete('/brands/:id', protectUser, adminUser, deleteBrand);

router.get('/orders', protectUser, adminUser, getAllOrders);
router.get('/products', protectUser, adminUser, getAllProducts);
router.put('/orders/update/:orderId', protectUser, adminUser, adminUpdateOrderStatus);

router.get('/stats', protectUser, adminUser, getDashboardStats);

router.get('/reviews', protectUser, adminUser, getAllReviews);
router.delete('/reviews/:id', protectUser, adminUser, deleteReview);

export default router;
