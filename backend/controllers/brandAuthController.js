import Brand from '../models/Brand.js';
import BrandApproval from '../models/BrandApproval.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';

export const registerBrand = async (req, res) => {
    try {
        const { brandName, email: rawEmail, password, description, logo, otp, ownerName, username, address, city, state, pincode, country, contact, gstNo } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        console.log(`[Brand Register] Verification attempt for: ${email} with OTP: ${otp}`);

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            console.warn(`[Brand Register] OTP not found for: ${email} | Input OTP: ${otp}`);
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const brandExistsInBrand = await Brand.findOne({ email });
        const brandExistsInApproval = await BrandApproval.findOne({ email });
        if (brandExistsInBrand || brandExistsInApproval) {
            return res.status(400).json({ message: 'Brand registration already exists or pending approval' });
        }

        const brandApproval = await BrandApproval.create({
            brandName, email, password, description, logo, ownerName, username, address, city, state, pincode, country, contact, gstNo
        });
        if (brandApproval) {
            // Delete OTP after successful registration
            await OTP.deleteOne({ _id: otpRecord._id });

            res.status(201).json({
                message: 'Registration request sent to admin for approval',
                _id: brandApproval._id,
                brandName: brandApproval.brandName,
                email: brandApproval.email,
                status: 'pending'
            });
        } else {
            res.status(400).json({ message: 'Invalid brand data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginBrand = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        const brand = await Brand.findOne({ email });

        if (brand && (await brand.matchPassword(password))) {
            if (brand.status === 'rejected') {
                return res.status(401).json({ message: 'Brand account suspended/rejected by admin' })
            }

            generateToken(res, brand._id, 'brand');
            res.json({ _id: brand._id, brandName: brand.brandName, email: brand.email, status: brand.status, logo: brand.logo, role: 'brand' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutBrand = (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('jwtBrand', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });

    res.json({ message: 'Brand logged out' });
};

export const forgotPasswordBrand = async (req, res) => {
    try {
        const { email } = req.body;
        const brand = await Brand.findOne({ email });

        if (!brand) {
            return res.status(404).json({ message: 'Brand with this email does not exist' });
        }

        res.json({ success: true, message: 'Brand verified, proceed to OTP' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPasswordBrand = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const brand = await Brand.findOne({ email });
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        brand.password = newPassword;
        await brand.save();

        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.json({ success: true, message: 'Brand password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBrandProfile = async (req, res) => {
    try {
        const brand = await Brand.findById(req.brand._id).select('-password');
        if (brand) {
            res.json({ _id: brand._id, brandName: brand.brandName, email: brand.email, status: brand.status, logo: brand.logo, role: 'brand' });
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBrandProfile = async (req, res) => {
    try {
        const brand = await Brand.findById(req.brand._id);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        const { brandName, ownerName, username, address, city, state, pincode, country, contact, gstNo, description, logo } = req.body;

        if (brandName) brand.brandName = brandName;
        if (ownerName !== undefined) brand.ownerName = ownerName;
        if (username !== undefined) brand.username = username;
        if (address !== undefined) brand.address = address;
        if (city !== undefined) brand.city = city;
        if (state !== undefined) brand.state = state;
        if (pincode !== undefined) brand.pincode = pincode;
        if (country !== undefined) brand.country = country;
        if (contact !== undefined) brand.contact = contact;
        if (gstNo !== undefined) brand.gstNo = gstNo;
        if (description !== undefined) brand.description = description;
        if (logo !== undefined) brand.logo = logo;

        const updated = await brand.save();
        res.json({
            _id: updated._id,
            brandName: updated.brandName,
            email: updated.email,
            status: updated.status,
            logo: updated.logo,
            ownerName: updated.ownerName,
            username: updated.username,
            address: updated.address,
            city: updated.city,
            state: updated.state,
            pincode: updated.pincode,
            country: updated.country,
            contact: updated.contact,
            gstNo: updated.gstNo,
            description: updated.description,
            role: 'brand',
            message: 'Brand profile updated successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changeBrandPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const brand = await Brand.findById(req.brand._id);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        const isMatch = await brand.matchPassword(oldPassword);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        brand.password = newPassword;
        await brand.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
