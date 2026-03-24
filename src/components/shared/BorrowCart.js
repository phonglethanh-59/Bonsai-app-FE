import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useBorrowCart } from '../../context/BorrowCartContext';
const BorrowCart = () => {
    const { cartItems, removeFromCart, clearCart } = useBorrowCart();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleBorrow = async () => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để mượn sách.');
            return;
        }
        if (cartItems.length === 0) {
            alert('Giỏ mượn của bạn đang trống.');
            return;
        }
        try {
            const bookIds = cartItems.map(item => item.id);
            const response = await axios.post('http://localhost:8080/api/borrow', { bookIds }, {
                withCredentials: true
            });
            alert(response.data.message);
            clearCart();
            setIsOpen(false);
            window.location.reload(); // Tải lại trang để cập nhật số lượng sách
        } catch (error) {
            alert('Mượn sách thất bại: ' + (error.response?.data?.message || error.message));
        }
    };
     const getCoverImageUrl = (path) => {
        if (!path) return 'https://source.unsplash.com/50x75/?book,cover';
        if (path.startsWith('http')) return path;
        return `http://localhost:8080${path}`;
    };
    return (
        <div className={`borrow-cart-container ${isOpen ? 'active' : ''}`}>
            <div
                className="borrow-cart-icon"
                onClick={() => setIsOpen(!isOpen)} // Toggle trạng thái mở/đóng
                title="Giỏ mượn sách"
            >
                <i className="fas fa-shopping-basket fa-lg"></i>
                {cartItems.length > 0 && <span className="badge rounded-pill bg-danger">{cartItems.length}</span>}
            </div>

            {/* === PANEL GIỎ HÀNG (THEO CẤU TRÚC CỦA BẠN) === */}
            <div className="borrow-cart-panel" id="borrowCartPanel">
                <div className="cart-header">
                    <h6>Giỏ hàng của bạn</h6>
                    <button id="closeCartBtn" className="btn-close btn-sm" onClick={() => setIsOpen(false)}></button>
                </div>
                <div className="cart-body" id="cartItemList">
                    {cartItems.length > 0 ? (
                        cartItems.map(book => (
                            <div key={book.id} className="cart-item">
                                <img 
                                    src={getCoverImageUrl(book.coverImage)} 
                                    alt={book.title} 
                                    style={{width: '40px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px'}}
                                />
                                <span style={{flex: 1}}>{book.title}</span>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(book.id)}>×</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted p-3">Giỏ sách của bạn đang trống.</p>
                    )}
                </div>
                <div className="cart-footer">
                    <button className="btn btn-danger btn-sm" id="clearCartBtn" onClick={clearCart}>Xóa tất cả</button>
                    <button className="btn btn-borrow-all w-100 mt-2" id="borrowAllBtn" onClick={handleBorrow}>Hoàn tất mượn sách</button>
                </div>
            </div>
        </div>
    );
};

export default BorrowCart;