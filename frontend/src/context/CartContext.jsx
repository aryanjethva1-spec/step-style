import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, brand } = useContext(AuthContext);
    const [cart, setCart] = useState({ products: [], totalPrice: 0, quantity: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user || brand) {
            fetchCart();
        } else {
             setCart({ products: [], totalPrice: 0, quantity: 0 });
        }
    }, [user, brand]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cart');
            setCart(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity, price, brandId, selectedSize) => {
        if (!user && !brand) {
            // Can be extended to local storage for guests
            console.log('User or Brand not logged in');
            return false;
        }

        try {
            const { data } = await api.post('/cart/add', { productId, quantity, price, brandId, selectedSize });
            setCart(data);
            return true;
        } catch (error) {
            console.error('Add to cart failed', error);
            return false;
        }
    };

    const removeFromCart = async (productId, selectedSize) => {
         try {
            let url = `/cart/remove/${productId}`;
            if (selectedSize) url += `?size=${encodeURIComponent(selectedSize)}`;
            const { data } = await api.delete(url);
            setCart(data);
        } catch (error) {
            console.error('Remove from cart failed', error);
        }
    }

    const updateQuantity = async (productId, quantity, selectedSize) => {
        try {
            const { data } = await api.put('/cart/update-quantity', { productId, quantity, selectedSize });
            setCart(data);
            return true;
        } catch (error) {
            console.error('Update quantity failed', error);
            return false;
        }
    };

    const [discount, setDiscount] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);

    const applyDiscount = (percent) => {
        setDiscountPercent(percent);
    };

    // Keep discount amount updated based on cart total and percent
    useEffect(() => {
        const subtotal = cart.totalPrice || 0;
        const amount = (subtotal * discountPercent) / 100;
        setDiscount(Math.min(amount, 999));
    }, [cart.totalPrice, discountPercent]);

    const clearCart = () => {
        setCart({ products: [], totalPrice: 0, quantity: 0 });
        setDiscount(0);
        setDiscountPercent(0);
    };

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart, discount, discountPercent, applyDiscount }}>
            {children}
        </CartContext.Provider>
    );
};
