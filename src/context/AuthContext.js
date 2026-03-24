import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFirstLogin, setShowFirstLogin] = useState(false);

    const checkFirstLogin = (userData) => {
        if (userData && userData.role === 'CUSTOMER') {
            const detail = userData.userDetail;
            if (!detail || !detail.email) {
                setShowFirstLogin(true);
            }
        }
    };
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/customers/profile`, {
                    withCredentials: true,
                });
                if (response.data && typeof response.data === 'object') {
                    setUser(response.data);
                    checkFirstLogin(response.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.log('Không có phiên đăng nhập hợp lệ.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const login = (userData) => {
        setUser(userData);
        checkFirstLogin(userData);
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        } finally {
            setUser(null);
            setShowFirstLogin(false);
            window.location.href = '/login?logout=true';
        }
    };
    const refreshUser = (updatedUserData) => {
        setUser(updatedUserData);
    };

    const value = {
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
        refreshUser, // <-- Thêm hàm refresh
        showFirstLogin, // <-- Thêm state
        setShowFirstLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};