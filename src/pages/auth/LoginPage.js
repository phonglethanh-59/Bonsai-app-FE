import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/config';
import AuthNavbar from '../../components/auth/AuthNavbar';
import AuthFooter from '../../components/auth/AuthFooter';
import LoginContainer from '../../components/auth/LoginContainer';
import './AuthPage.css';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const logoutSuccess = searchParams.get('logout');
    const loginError = searchParams.get('error');

    const handleLoginSubmit = async (formData) => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            params.append('username', formData.username);
            params.append('password', formData.password);

            await axios.post(`${API_BASE}/auth/login`, params, {
                withCredentials: true,
            });

            const profileResponse = await axios.get(`${API_BASE}/api/customers/profile`, {
                withCredentials: true,
            });

            const userData = profileResponse.data;
            login(userData);

            // Redirect theo role
            if (userData.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-page-container'>
            <AuthNavbar />
            <div className="login-container">
                {/* === SỬA LỖI TẠI ĐÂY === */}
                <LoginContainer 
                    onSubmit={handleLoginSubmit}  // Truyền hàm xử lý vào prop onSubmit
                    loginError={loginError} 
                    loading={loading}
                    logoutSuccess={logoutSuccess}
                />
                {/* ====================== */}
            </div>
            <AuthFooter />
        </div>
    );
};

export default LoginPage;