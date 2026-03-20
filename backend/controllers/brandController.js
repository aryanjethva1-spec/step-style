import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Brand from '../models/Brand.js';

export const createProduct = async (req, res) => {
    try {
        const { name, price, category, footwearType, description, sizes, image, stock } = req.body;

        const product = new Product({
            name,
            price,
            category,
            footwearType,
            brandId: req.brand._id,
            brandName: req.brand.brandName,
            description,
            sizes,
            image,
            stock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, price, category, footwearType, description, sizes, image, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            
            if(product.brandId.toString() !== req.brand._id.toString()){
               return res.status(401).json({ message: 'Not authorized to update this product' })
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.category = category || product.category;
            product.footwearType = footwearType || product.footwearType;
            product.description = description || product.description;
            product.sizes = sizes || product.sizes;
            product.image = image || product.image;
            product.stock = stock || product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
     try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if(product.brandId.toString() !== req.brand._id.toString()){
                return res.status(401).json({ message: 'Not authorized to delete this product' })
            }
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBrandOrders = async (req, res) => {
    try {
        const orders = await Order.find({ brandId: req.brand._id }).lean();
        
        const User = (await import('../models/User.js')).default;
        const Brand = (await import('../models/Brand.js')).default;
        
        for (let order of orders) {
            if (order.userType === 'brand') {
                const brand = await Brand.findById(order.userId).select('brandName email');
                order.userId = brand ? { _id: brand._id, name: brand.brandName, email: brand.email } : { _id: order.userId, name: 'Unknown', email: '--' };
            } else {
                const user = await User.findById(order.userId).select('name email');
                order.userId = user ? { _id: user._id, name: user.name, email: user.email } : { _id: order.userId, name: 'Unknown', email: '--' };
            }
        }
        
        res.json(orders);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.brandId.toString() !== req.brand._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this order' });
        }

        const previousStatus = order.orderStatus;

        // ── STOCK MANAGEMENT ──────────────────────────────────────────────────
        if (orderStatus === 'Approved' && previousStatus !== 'Approved') {
            // Deduct stock when brand approves the order
            const product = await Product.findById(order.productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found, cannot approve order' });
            }
            if (product.stock < order.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock. Available: ${product.stock}, Ordered: ${order.quantity}`
                });
            }
            product.stock -= order.quantity;
            await product.save();
        }

        if (orderStatus === 'Cancelled' && previousStatus === 'Approved') {
            // Restore stock only if the order was previously approved (stock was already deducted)
            const product = await Product.findById(order.productId);
            if (product) {
                product.stock += order.quantity;
                await product.save();
            }
        }
        // ─────────────────────────────────────────────────────────────────────

        order.orderStatus = orderStatus;

        if (orderStatus === 'Approved') {
            order.approvedByBrand = true;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPublicBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ status: 'approved' }).select('brandName logo');
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
