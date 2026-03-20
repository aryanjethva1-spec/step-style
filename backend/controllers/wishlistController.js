import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.buyer._id }).populate('products.productId', 'name image price brandName rating stock');
        
        if (!wishlist) {
            wishlist = { products: [] };
        }
        res.json(wishlist);
    } catch (error) {
        console.error('getWishlist Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'productId is required' });
        }

        let wishlist = await Wishlist.findOne({ userId: req.buyer._id });

        if (wishlist) {
            const productIndex = wishlist.products.findIndex(p => p.productId && p.productId.toString() === productId);
            if (productIndex === -1) {
                wishlist.products.push({ productId });
            }
        } else {
             const userType = req.buyer.type === 'user' ? 'User' : 'Brand';
             wishlist = await Wishlist.create({
                userId: req.buyer._id,
                userType: userType,
                products: [{ productId }]
            });
        }
        
        await wishlist.save();
        await wishlist.populate('products.productId', 'name image price brandName rating stock');
        res.status(201).json(wishlist);
    } catch (error) {
        console.error('addToWishlist Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        let wishlist = await Wishlist.findOne({ userId: req.buyer._id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(p => p.productId && p.productId.toString() !== productId);
            await wishlist.save();
            await wishlist.populate('products.productId', 'name image price brandName rating stock');
            res.json(wishlist);
        } else {
             res.status(404).json({ message: 'Wishlist not found' });
        }
    } catch (error) {
        console.error('removeFromWishlist Error:', error);
        res.status(500).json({ message: error.message });
    }
};
