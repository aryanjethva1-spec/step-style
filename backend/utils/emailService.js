import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendContactEmailToAdmin = async (contactData) => {
    const { name, email, subject, message } = contactData;

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Message: ${subject}`,
        html: `
            <div style="font-family: 'Outfit', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #dc3545;">New Support Request</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p><strong>Message:</strong></p>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

export const sendThankYouEmailToUser = async (name, userEmail) => {
    const mailOptions = {
        from: `"StepStyle" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Thank you for contacting StepStyle',
        html: `
            <div style="font-family: 'Outfit', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; text-align: center;">
                <h1 style="color: #dc3545; margin-bottom: 20px;">Hello ${name}!</h1>
                <p style="font-size: 16px; color: #333;">Thank you for reaching out to us. We have received your message and our team will get back to you as soon as possible.</p>
                <p style="font-size: 14px; color: #777; margin-top: 30px;">Best Regards,<br><strong>StepStyle Team</strong></p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

export const sendBrandRejectionEmail = async (brandName, brandEmail) => {
    const mailOptions = {
        from: `"StepStyle Admin" <${process.env.EMAIL_USER}>`,
        to: brandEmail,
        subject: 'Update on your Brand Registration Request',
        html: `
            <div style="font-family: 'Outfit', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #dc3545;">Registration Update</h2>
                <p>Hello <strong>${brandName}</strong>,</p>
                <p>Thank you for your interest in joining the StepStyle marketplace.</p>
                <p>After reviewing your application, we regret to inform you that your brand has <strong>not been approved</strong> for the website at this time.</p>
                <p>Your data has been removed from our staging records. If you have any questions, please feel free to reach out via our contact form.</p>
                <p style="margin-top: 30px;">Best Regards,<br><strong>StepStyle Administration</strong></p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

export const sendBrandApprovalEmail = async (brandName, brandEmail) => {
    const mailOptions = {
        from: `"StepStyle Admin" <${process.env.EMAIL_USER}>`,
        to: brandEmail,
        subject: 'Congratulations! Your Brand is Approved on StepStyle',
        html: `
            <div style="font-family: 'Outfit', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #28a745;">Registration Approved!</h2>
                <p>Hello <strong>${brandName}</strong>,</p>
                <p>We are excited to inform you that your brand registration request has been <strong>approved</strong>!</p>
                <p>Welcome to the StepStyle family. You can now log in to the brand panel using your registered credentials to start listing your products and managing your orders.</p>
                <div style="margin: 30px 0;">
                    <a href="http://localhost:5173/brand/login" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In to Brand Panel</a>
                </div>
                <p style="margin-top: 30px;">We look forward to a successful partnership.</p>
                <p>Best Regards,<br><strong>StepStyle Administration</strong></p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};
