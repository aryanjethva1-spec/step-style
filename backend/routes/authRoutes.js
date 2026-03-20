import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, changePassword, updateUserProfile } from '../controllers/authController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.put('/change-password', protectUser, changePassword);

export default router;
