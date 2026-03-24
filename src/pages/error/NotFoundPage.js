import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        
        <div className="d-flex align-items-center justify-content-center vh-100 text-center">
            <div>
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <p className="fs-3"> <span className="text-danger">Oops!</span> Trang không tồn tại.</p>
                <p className="lead">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link to="/" className="btn btn-primary">
                    Về Trang Chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;