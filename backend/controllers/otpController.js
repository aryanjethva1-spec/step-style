import nodemailer from 'nodemailer';
import OTP from '../models/OTP.js';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const getTransporter = () => {
  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const login = process.env.BREVO_SMTP_LOGIN;
  const key = process.env.BREVO_SMTP_KEY;

  if (!login || !key) {
    throw new Error(
      'Brevo SMTP is not configured. Set BREVO_SMTP_LOGIN and BREVO_SMTP_KEY in Render.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user: login,
      pass: key,
    },
  });
};

const getFromEmail = () => {
  const fromEmail = process.env.EMAIL_FROM;
  if (!fromEmail) {
    throw new Error(
      'EMAIL_FROM is missing. Add a Brevo verified sender email in Render.'
    );
  }
  return fromEmail;
};

const getFromName = () => process.env.EMAIL_FROM_NAME || 'StepStyle Support';

const saveOTP = async (email, otp) => {
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const buildOtpHtml = ({ title, subtitle, intro, otp }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
    <h1 style="margin: 0 0 8px; color: #111827;">StepStyle</h1>
    <p style="margin: 0 0 24px; color: #6b7280;">${subtitle}</p>

    <h2 style="color: #111827; margin-bottom: 12px;">${title}</h2>
    <p style="color: #374151; line-height: 1.7; margin-bottom: 20px;">${intro}</p>

    <div style="margin: 24px 0; text-align: center;">
      <div style="display: inline-block; padding: 14px 24px; font-size: 28px; letter-spacing: 6px; font-weight: bold; background: #111827; color: #ffffff; border-radius: 10px;">
        ${otp}
      </div>
    </div>

    <p style="color: #374151; line-height: 1.7;">This OTP is valid for 5 minutes.</p>
    <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
      If you did not request this, you can safely ignore this email.
    </p>
  </div>
`;

const sendMail = async ({ to, subject, html }) => {
  const transporter = getTransporter();

  return transporter.sendMail({
    from: `"${getFromName()}" <${getFromEmail()}>`,
    to,
    subject,
    html,
  });
};

export const sendOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);

    await sendMail({
      to: email,
      subject: 'Registration Verification Code - StepStyle',
      html: buildOtpHtml({
        title: 'Verify Your Account',
        subtitle: 'Premium Footwear Store',
        intro: 'Use the verification code below to complete your registration.',
        otp,
      }),
    });

    return res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('[sendOTP] Error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to send OTP',
    });
  }
};

export const sendResetOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);

    await sendMail({
      to: email,
      subject: 'Password Reset Code - StepStyle',
      html: buildOtpHtml({
        title: 'Reset Your Password',
        subtitle: 'Account Security',
        intro: 'Use the verification code below to reset your password.',
        otp,
      }),
    });

    return res.json({
      success: true,
      message: 'Reset OTP sent successfully',
    });
  } catch (error) {
    console.error('[sendResetOTP] Error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to send reset OTP',
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('[verifyOTP] Error:', error);
    return res.status(500).json({
      message: error.message || 'OTP verification failed',
    });
  }
};