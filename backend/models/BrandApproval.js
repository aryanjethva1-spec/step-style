import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const brandApprovalSchema = mongoose.Schema(
    {
        brandName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        ownerName: { type: String },
        username: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String },
        contact: { type: String },
        gstNo: { type: String },
    },
    {
        timestamps: true,
    }
);

// We still hash the password in the approval stage so it's ready to be moved to the Brand collection
brandApprovalSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const BrandApproval = mongoose.model('BrandApproval', brandApprovalSchema);
export default BrandApproval;
