import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        footwearType: {
            type: String,
            required: true,
            default: 'Casual',
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
        description: {
            type: String,
            required: true,
        },
        sizes: [
            {
                type: String,
                required: true,
            },
        ],
        image: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
