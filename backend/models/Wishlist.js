import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    }
});

const wishlistSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'userType',
        },
        userType: {
            type: String,
            required: true,
            enum: ['User', 'Brand'], // Assuming only users, or maybe brand too.
        },
        products: [wishlistItemSchema],
    },
    {
        timestamps: true,
    }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
