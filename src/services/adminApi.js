// src/services/adminApi.js
import { API_BASE } from '../utils/config';

const API_BASE_URL = `${API_BASE}/admin`;

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return null;
};

const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`API request failed: ${error.message}`);
        throw error;
    }
};

const adminApi = {
    // ===================== DASHBOARD =====================
    getDashboardStats: () => {
        return apiRequest(`${API_BASE_URL}/stats`);
    },

    // ===================== USER MANAGEMENT =====================
    getUsers: (params = {}) => {
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
        const queryParams = new URLSearchParams(filteredParams).toString();
        return apiRequest(`${API_BASE_URL}/users?${queryParams}`);
    },

    getUserById: (userId) => {
        return apiRequest(`${API_BASE_URL}/users/${userId}`);
    },

    createUser: (userData) => {
        return apiRequest(`${API_BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    updateUser: (userId, userData) => {
        return apiRequest(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    updateUserRole: (userId, role) => {
        return apiRequest(`${API_BASE_URL}/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    },

    deleteUser: (userId) => {
        return apiRequest(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
        });
    },

    toggleUserStatus: (userId) => {
        return apiRequest(`${API_BASE_URL}/users/${userId}/toggle-status`, {
            method: 'PUT',
        });
    },

    // ===================== PRODUCT MANAGEMENT =====================
    getProducts: (params = {}) => {
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
        const queryParams = new URLSearchParams(filteredParams).toString();
        return apiRequest(`${API_BASE}/api/products?${queryParams}`);
    },

    createProduct: (productData) => {
        return apiRequest(`${API_BASE_URL}/products`, {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    updateProduct: (productId, productData) => {
        return apiRequest(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    deleteProduct: (productId) => {
        return apiRequest(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
        });
    },

    // ===================== CATEGORY MANAGEMENT =====================
    getCategories: () => {
        return apiRequest(`${API_BASE}/api/categories`);
    },

    createCategory: (categoryData) => {
        return apiRequest(`${API_BASE_URL}/categories`, {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    },

    updateCategory: (categoryId, categoryData) => {
        return apiRequest(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    },

    deleteCategory: (categoryId) => {
        return apiRequest(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE',
        });
    },

    // ===================== ORDER MANAGEMENT =====================
    getOrders: (params = {}) => {
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
        const queryParams = new URLSearchParams(filteredParams).toString();
        return apiRequest(`${API_BASE_URL}/orders?${queryParams}`);
    },

    updateOrderStatus: (orderId, status) => {
        return apiRequest(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

export default adminApi;
