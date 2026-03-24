import React from 'react';
import './admin.css';

const AdminWrapper = ({ children }) => {
    return (
        <div className="admin-container">
            {children}
        </div>
    );
};

export default AdminWrapper;
