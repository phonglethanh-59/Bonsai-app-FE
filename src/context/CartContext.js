import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

import { API_BASE } from '../utils/config';
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Lấy giỏ hàng từ server
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/cart`, { withCredentials: true });
            setCartItems(response.data?.content || []);
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Thêm sản phẩm vào giỏ
    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await axios.post(`${API_BASE}/api/cart`,
                { productId, quantity },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            await fetchCart(); // Refresh giỏ hàng
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng';
            throw new Error(msg);
        }
    };

    // Cập nhật số lượng
    const updateCartItem = async (productId, quantity) => {
        try {
            await axios.put(`${API_BASE}/api/cart`,
                { productId, quantity },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            await fetchCart();
        } catch (error) {
            const msg = error.response?.data?.message || 'Lỗi khi cập nhật giỏ hàng';
            throw new Error(msg);
        }
    };

    // Xóa sản phẩm khỏi giỏ
    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`${API_BASE}/api/cart/${productId}`, { withCredentials: true });
            await fetchCart();
        } catch (error) {
            const msg = error.response?.data?.message || 'Lỗi khi xóa khỏi giỏ hàng';
            throw new Error(msg);
        }
    };

    // Xóa toàn bộ giỏ
    const clearCart = async () => {
        try {
            await axios.delete(`${API_BASE}/api/cart`, { withCredentials: true });
            setCartItems([]);
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
        }
    };

    // Tính tổng tiền
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Tổng số lượng sản phẩm
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
