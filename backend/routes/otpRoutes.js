import express from 'express';
import { sendOTP, sendResetOTP } from '../controllers/otpController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/send-reset-otp', sendResetOTP);

export default router;