import express from 'express';
import { registerBrand, loginBrand, logoutBrand, forgotPasswordBrand, resetPasswordBrand, getBrandProfile, updateBrandProfile, changeBrandPassword } from '../controllers/brandAuthController.js';
import { protectBrand } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerBrand);
router.post('/login', loginBrand);
router.get('/logout', logoutBrand);
router.post('/forgot-password', forgotPasswordBrand);
router.post('/reset-password', resetPasswordBrand);
router.get('/profile', protectBrand, getBrandProfile);
router.get('/profile-full', protectBrand, async (req, res) => {
    try {
        const Brand = (await import('../models/Brand.js')).default;
        const brand = await Brand.findById(req.brand._id).select('-password');
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.json(brand);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
router.put('/profile', protectBrand, updateBrandProfile);
router.put('/change-password', protectBrand, changeBrandPassword);

export default router;


