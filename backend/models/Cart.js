import mongoose from 'mongoose';

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        userType: {
            type: String,
            required: true,
            enum: ['user', 'brand'],
            default: 'user'
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                selectedSize: {
                    type: String,
                },
                price: {
                    type: Number,
                    required: true,
                },
                brandId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Brand',
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
