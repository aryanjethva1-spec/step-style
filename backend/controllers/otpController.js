import nodemailer from 'nodemailer';
import OTP from '../models/OTP.js';
import User from '../models/User.js';
import Brand from '../models/Brand.js';

// Transporter initialization function to ensure process.env is ready
const getTransporter = () => {
    // Gmail App Passwords work best without spaces
    const cleanPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '';
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: cleanPass,
        }
    });
};

export const sendOTP = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        console.log(`[OTP] Request to send OTP to: ${email}`);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.includes('your_email')) {
            console.error('[OTP] Error: Email credentials not configured in .env');
            return res.status(500).json({ 
                message: 'Mail server not configured. Please update EMAIL_USER and EMAIL_PASS in your .env file.' 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send Email
        const mailOptions = {
            from: `"StepStyle Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Registration Verification Code - StepStyle',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 40px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #dc3545; margin: 0;">StepStyle</h1>
                        <p style="color: #666; font-size: 14px;">Premium Footwear Store</p>
                    </div>
                    <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
                    <p style="color: #555; line-height: 1.6;">Hello,</p>
                    <p style="color: #555; line-height: 1.6;">Use the verification code below to complete your registration. This code is valid for 5 minutes.</p>
                    <div style="background: #fdfdfd; border: 2px dashed #dc3545; padding: 30px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #1a1a1a;">${otp}</span>
                    </div>
                    <p style="color: #888; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await getTransporter().sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent to your mailbox!' });
    } catch (error) {
        console.error('MAILER_ERROR:', error);
        res.status(500).json({ message: `Mail failed: ${error.message}. Ensure you use a Gmail App Password.` });
    }
};

export const sendResetOTP = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        console.log(`[OTP] Request to send RESET OTP to: ${email}`);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.includes('your_email')) {
            console.error('[OTP] Error: Email credentials not configured in .env');
            return res.status(500).json({ 
                message: 'Mail server not configured. Please update EMAIL_USER and EMAIL_PASS in your .env file.' 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        const mailOptions = {
            from: `"StepStyle Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Recovery Code - StepStyle',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 40px; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    <p style="color: #555; line-height: 1.6;">We received a request to reset your password. Use the code below to proceed:</p>
                    <div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 30px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #c53030;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 13px; font-style: italic;">Note: If you did not request this, your password will remain unchanged.</p>
                </div>
            `
        };

        await getTransporter().sendMail(mailOptions);
        res.json({ success: true, message: 'Recovery code sent!' });
    } catch (error) {
        console.error('MAILER_RESET_ERROR:', error);
        res.status(500).json({ message: `Mail failed: ${error.message}` });
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email: rawEmail, otp } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (next) next();
        else res.json({ success: true, message: 'OTP verified' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
