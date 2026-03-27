import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_BASE } from '../utils/config';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/wishlist?size=100`, { withCredentials: true });
            const items = response.data?.content || [];
            setWishlistItems(items);
            setWishlistIds(new Set(items.map(item => item.productId)));
        } catch (error) {
            console.error('Lỗi khi tải danh sách yêu thích:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const addToWishlist = async (productId) => {
        try {
            await axios.post(`${API_BASE}/api/wishlist`,
                { productId },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            await fetchWishlist();
        } catch (error) {
            const msg = error.response?.data?.message || 'Lỗi khi thêm vào yêu thích';
            throw new Error(msg);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`${API_BASE}/api/wishlist/${productId}`, { withCredentials: true });
            await fetchWishlist();
        } catch (error) {
            const msg = error.response?.data?.message || 'Lỗi khi xóa khỏi yêu thích';
            throw new Error(msg);
        }
    };

    const toggleWishlist = async (productId) => {
        if (wishlistIds.has(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const clearWishlist = async () => {
        try {
            await axios.delete(`${API_BASE}/api/wishlist`, { withCredentials: true });
            setWishlistItems([]);
            setWishlistIds(new Set());
        } catch (error) {
            console.error('Lỗi khi xóa danh sách yêu thích:', error);
        }
    };

    const isInWishlist = (productId) => wishlistIds.has(productId);

    const getWishlistCount = () => wishlistItems.length;

    const value = {
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
