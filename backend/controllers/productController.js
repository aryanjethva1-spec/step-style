import Product from '../models/Product.js';
import Review from '../models/Review.js';

export const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 9;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: 'i',
                  },
              }
            : {};

        const queryObj = { ...keyword };

        if (req.query.category && req.query.category !== 'All') {
            queryObj.category = req.query.category;
        }
        
        // If gender is provided, it should probably override or filter the category if they share the same field
        // But looking at the model, gender isn't a separate field, so it uses 'category'
        if (req.query.gender && req.query.gender !== 'All') {
            queryObj.category = req.query.gender;
        }

        if (req.query.footwearType && req.query.footwearType !== 'All') {
            queryObj.footwearType = req.query.footwearType;
        }

        if (req.query.brand) {
            queryObj.brandId = req.query.brand;
        }
        
        if (req.query.size) {
            queryObj.sizes = { $in: [req.query.size.toString()] };
        }

        if (req.query.rating) {
            queryObj.rating = { $gte: Number(req.query.rating) };
        }

        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 999999;
        
        queryObj.price = { $gte: minPrice, $lte: maxPrice };

        let sortOption = {};
        if (req.query.sort === 'priceLow') sortOption = { price: 1 };
        else if (req.query.sort === 'priceHigh') sortOption = { price: -1 };
        else if (req.query.sort === 'newest') sortOption = { createdAt: -1 };
        else if (req.query.sort === 'topRated') sortOption = { rating: -1 };
        else sortOption = { createdAt: -1 };

        const count = await Product.countDocuments(queryObj);
        const products = await Product.find(queryObj)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductsByBrandId = async (req, res) => {
     try {
         const products = await Product.find({ brandId: req.params.brandId });
         res.json({products});
     } catch (error) {
         res.status(500).json({ message: error.message });
     }
}

export const createProductReview = async (req, res) => {
    try {
        const { rating, comment, name, email } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            let reviewData = {
                rating: Number(rating),
                comment,
                productId: product._id,
            };

            if (req.user) {
                const alreadyReviewed = await Review.findOne({
                    productId: product._id,
                    userId: req.user._id,
                });

                if (alreadyReviewed) {
                    return res.status(400).json({ message: 'Product already reviewed by you' });
                }
                reviewData.userId = req.user._id;
                reviewData.name = req.user.name;
                reviewData.email = req.user.email;
            } else {
                if (!name || !email) {
                    return res.status(400).json({ message: 'Name and email are required for guest reviews' });
                }
                reviewData.name = name;
                reviewData.email = email;
            }

            const review = new Review(reviewData);

            await review.save();

            const reviews = await Review.find({ productId: product._id });
            const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            product.rating = Math.round(avgRating * 10) / 10;

            try {
                await product.save();
            } catch (saveError) {
                console.error('Product validation failed during review save:', saveError.errors);
                return res.status(400).json({ 
                    message: 'Product validation failed', 
                    errors: saveError.errors 
                });
            }
            res.status(201).json({ message: 'Review added successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProductReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const review = await Review.findOneAndDelete({
                productId: product._id,
                userId: req.user._id,
            });

            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            const reviews = await Review.find({ productId: product._id });
            if (reviews.length > 0) {
                product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            } else {
                product.rating = 0;
            }

            await product.save();
            res.json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
