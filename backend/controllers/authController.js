import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email: rawEmail, password, otp, addressLine1, addressLine2, city, state, pincode, country, addressType, landmark, contact, gender } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ 
            name, email, password, addressLine1, addressLine2, city, state, pincode, country, addressType, landmark, contact, gender 
        });
        if (user) {
            // Delete OTP after successful registration
            await OTP.deleteOne({ _id: otpRecord._id });
            
            generateToken(res, user._id);
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'User logged out' });
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // We'll call the sendResetOTP logic here or expect the frontend to call it after this check
        res.json({ success: true, message: 'User verified, proceed to OTP' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword;
        await user.save();

        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                country: user.country,
                addressType: user.addressType,
                landmark: user.landmark,
                contact: user.contact,
                gender: user.gender
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.image = req.body.image || user.image;
            user.addressLine1 = req.body.addressLine1 || user.addressLine1;
            user.addressLine2 = req.body.addressLine2 || user.addressLine2;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.pincode = req.body.pincode || user.pincode;
            user.country = req.body.country || user.country;
            user.addressType = req.body.addressType || user.addressType;
            user.landmark = req.body.landmark || user.landmark;
            user.contact = req.body.contact || user.contact;
            user.gender = req.body.gender || user.gender;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image,
                addressLine1: updatedUser.addressLine1,
                addressLine2: updatedUser.addressLine2,
                city: updatedUser.city,
                state: updatedUser.state,
                pincode: updatedUser.pincode,
                country: updatedUser.country,
                addressType: updatedUser.addressType,
                landmark: updatedUser.landmark,
                contact: updatedUser.contact,
                gender: updatedUser.gender
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(oldPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ success: true, message: 'Password changed successfully' });
        } else {
            res.status(401).json({ message: 'Incorrect current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
