import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.buyer._id }).populate('products.productId', 'name image');

        if (!cart) {
            cart = { products: [], totalPrice: 0, quantity: 0 };
        }
        res.json(cart);
    } catch (error) {
        console.error('getCart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity, price, brandId, selectedSize } = req.body;
        
        if (!productId || !brandId) {
            return res.status(400).json({ message: 'productId and brandId are required' });
        }

        const qty = Number(quantity);
        const prc = Number(price);

        if (isNaN(qty) || isNaN(prc)) {
            return res.status(400).json({ message: 'Invalid quantity or price' });
        }

        let cart = await Cart.findOne({ userId: req.buyer._id });

        if (cart) {
            // Match exactly same product and same size
            const productIndex = cart.products.findIndex(p => 
                p.productId && 
                p.productId.toString() === productId && 
                (p.selectedSize === selectedSize || (!p.selectedSize && !selectedSize))
            );
            
            if (productIndex > -1) {
                cart.products[productIndex].quantity += qty;
            } else {
                cart.products.push({ productId, quantity: qty, price: prc, brandId, selectedSize });
            }
            
            cart.totalPrice += qty * prc;
            cart.quantity += qty;
        } else {
             cart = await Cart.create({
                userId: req.buyer._id,
                userType: req.buyer.type,
                products: [{ productId, quantity: qty, price: prc, brandId, selectedSize }],
                totalPrice: qty * prc,
                quantity: qty
            });
        }
        
        await cart.save();
        await cart.populate('products.productId', 'name image');
        res.status(201).json(cart);

    } catch (error) {
        console.error('addToCart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { size } = req.query; // Accept size query to correctly identify which cart item to remove
        let cart = await Cart.findOne({ userId: req.buyer._id });

        if (cart) {
            const productIndex = cart.products.findIndex(p => 
                p.productId && 
                p.productId.toString() === productId &&
                (p.selectedSize === size || (!p.selectedSize && !size))
            );

            if (productIndex > -1) {
                let productItem = cart.products[productIndex];
                cart.totalPrice -= productItem.quantity * productItem.price;
                cart.quantity -= productItem.quantity;
                cart.products.splice(productIndex, 1);
                
                // Ensure values don't go below 0 due to floating point or logic errors
                if (cart.totalPrice < 0) cart.totalPrice = 0;
                if (cart.quantity < 0) cart.quantity = 0;
            }
             await cart.save();
             await cart.populate('products.productId', 'name image');
             res.json(cart);
        } else {
             res.status(404).json({ message: 'Cart not found' });
        }

    } catch (error) {
        console.error('removeFromCart Error:', error);
        res.status(500).json({ message: error.message });
    }
};
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity, selectedSize } = req.body;
        const qty = Number(quantity);

        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        let cart = await Cart.findOne({ userId: req.buyer._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => 
            p.productId && 
            p.productId.toString() === productId &&
            (p.selectedSize === selectedSize || (!p.selectedSize && !selectedSize))
        );

        if (productIndex > -1) {
            const productItem = cart.products[productIndex];
            // Update totals
            cart.totalPrice -= productItem.quantity * productItem.price;
            cart.quantity -= productItem.quantity;
            
            // Set new quantity
            productItem.quantity = qty;
            
            cart.totalPrice += qty * productItem.price;
            cart.quantity += qty;

            await cart.save();
            await cart.populate('products.productId', 'name image');
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('updateCartQuantity Error:', error);
        res.status(500).json({ message: error.message });
    }
};
