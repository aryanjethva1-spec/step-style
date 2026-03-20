import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
