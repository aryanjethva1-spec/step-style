import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        userType: {
            type: String,
            required: true,
            enum: ['user', 'brand'],
            default: 'user',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Brand',
        },
        brandName: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        selectedSize: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        address: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'Card', 'UPI'],
            default: 'COD',
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending',
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ['Pending', 'Approved', 'Rejected', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        approvedByBrand: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
