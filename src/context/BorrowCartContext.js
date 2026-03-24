import React, { createContext, useState, useContext } from 'react';

const BorrowCartContext = createContext(null);

export const BorrowCartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (book) => {
        if (cartItems.length >= 5) {
            alert('Giỏ mượn đã đầy! Bạn chỉ có thể thêm tối đa 5 sách.');
            return;
        }
        if (cartItems.some(item => item.id === book.id)) {
            alert('Sách này đã có trong giỏ của bạn.');
            return;
        }
        setCartItems(prevItems => [...prevItems, book]);
    };

    const removeFromCart = (bookId) => {
        setCartItems(prev => prev.filter(item => item.id !== bookId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = { cartItems, addToCart, removeFromCart, clearCart };

    return (
        <BorrowCartContext.Provider value={value}>
            {children}
        </BorrowCartContext.Provider>
    );
};

export const useBorrowCart = () => useContext(BorrowCartContext);