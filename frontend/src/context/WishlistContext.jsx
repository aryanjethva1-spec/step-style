import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState({ products: [] });

    useEffect(() => {
        const fetchWishlist = async () => {
            if (user && user.role !== 'admin') {
                try {
                    const { data } = await api.get('/wishlist');
                    setWishlist(data);
                } catch (error) {
                    console.error('Failed to fetch wishlist', error);
                }
            } else {
                setWishlist({ products: [] });
            }
        };

        fetchWishlist();
    }, [user]);

    const addToWishlist = async (productId) => {
        if (!user) {
            console.log('User not logged in');
            return false;
        }

        try {
            const { data } = await api.post('/wishlist/add', { productId });
            setWishlist(data);
            return true;
        } catch (error) {
            console.error('Add to wishlist failed', error);
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await api.delete(`/wishlist/remove/${productId}`);
            setWishlist(data);
            return true;
        } catch (error) {
            console.error('Remove from wishlist failed', error);
            return false;
        }
    };

    // Helper to check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlist.products.some(p => p.productId && p.productId._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
