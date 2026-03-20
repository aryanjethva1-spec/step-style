import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const brandSchema = mongoose.Schema(
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

brandSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

brandSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
