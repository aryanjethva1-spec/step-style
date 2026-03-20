import { sendContactEmailToAdmin, sendThankYouEmailToUser } from '../utils/emailService.js';

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Send Email to Admin
        await sendContactEmailToAdmin({ name, email, subject, message });

        // Send Thank You Email to User
        await sendThankYouEmailToUser(name, email);

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email Service Error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};
