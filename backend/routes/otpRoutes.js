import express from 'express';
import { sendOTP, sendResetOTP, verifyOTP } from '../controllers/otpController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/send-reset-otp', sendResetOTP);
router.post('/verify-otp', verifyOTP);

export default router;