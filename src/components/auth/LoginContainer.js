import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../utils/config';

const LoginContainer = ({ loginError }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                    <div className="card">
                        <div className="card-header">
                            <h3>Đăng Nhập Bonsai Shop</h3>
                        </div>
                        <div className="card-body">
                            {loginError && <div className="alert alert-danger p-2 small">Tên đăng nhập hoặc mật khẩu không chính xác.</div>}

                            <form action={`${API_BASE}/auth/login`} method="POST">
                                <div className="mb-4">
                                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <div className="input-group" >
                                        <input
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            required
                                        />
                                        <div className="input-group-append mb">
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                id="togglePassword"
                                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                                style={{ borderLeft: 'none', borderColor: '#F8F5F2' }}
                                            >
                                                <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fas fa-eye'}`}></i>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-3 btn-submit-auth">
                                    Đăng nhập
                                </button>
                                <div className="form-footer">
                                    <Link to="/register" className="text-decoration-none">Chưa có tài khoản? Đăng ký</Link>
                                </div>
                               
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;