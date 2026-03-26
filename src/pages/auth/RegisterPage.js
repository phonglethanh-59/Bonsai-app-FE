import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../utils/config';
import AuthNavbar from '../../components/auth/AuthNavbar';
import AuthFooter from '../../components/auth/AuthFooter';
import './AuthPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', rawPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.rawPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (formData.rawPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);

        try {
            // Dùng URLSearchParams để gửi dữ liệu dạng form
            const params = new URLSearchParams();
            params.append('username', formData.username);
            params.append('rawPassword', formData.rawPassword);
            
            // Gọi API đăng ký của backend
            const response = await axios.post(`${API_BASE}/auth/register`, params);

            setSuccess(response.data);
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng sang trang đăng nhập sau khi thành công
            }, 2000);

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data); // Hiển thị lỗi từ server (ví dụ: "Tên đăng nhập đã tồn tại")
            } else {
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-page-container'>
            <AuthNavbar />
            <div className="register-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 col-lg-5">
                            <div className="logo-container">
                                <div className="logo"><i className="fas fa-user-plus"></i></div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">Tạo Tài Khoản Mới</h3>
                                </div>
                                <div className="card-body">
                                    {success && <div className="alert alert-success">{success}</div>}
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label>Tên đăng nhập</label>
                                            <input type="text" name="username" className="form-control" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                                        </div>
                                        <div className="mb-3">
                                            <label>Mật khẩu</label>
                                            <input type="password" name="rawPassword" className="form-control" onChange={(e) => setFormData({...formData, rawPassword: e.target.value})} required />
                                        </div>
                                        <div className="mb-4">
                                            <label>Xác nhận mật khẩu</label>
                                            <input type="password" name="confirmPassword" className="form-control" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                                {loading ? 'Đang xử lý...' : 'Đăng ký'}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="form-footer">
                                        <Link to="/login" className="text-decoration-none">Đã có tài khoản? Đăng nhập</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthFooter />
        </div>
    );
};

export default RegisterPage;