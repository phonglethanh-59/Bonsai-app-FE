export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
