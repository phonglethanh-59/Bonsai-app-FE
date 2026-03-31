import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE } from '../../utils/config';
import {
    FiHome, FiUsers, FiPackage, FiGrid, FiShoppingCart,
    FiLogOut, FiChevronLeft, FiChevronRight, FiMessageSquare, FiBarChart2
} from 'react-icons/fi';

const Sidebar = ({ role }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            path: role === 'ADMIN' ? '/admin/dashboard' : '/staff/home'
        },
    ];

    const adminItems = [
        {
            id: 'user-management',
            label: 'Quản lý Người dùng',
            icon: FiUsers,
            path: '/admin/users'
        },
        {
            id: 'product-management',
            label: 'Quản lý Sản phẩm',
            icon: FiPackage,
            path: '/admin/products'
        },
        {
            id: 'category-management',
            label: 'Quản lý Danh mục',
            icon: FiGrid,
            path: '/admin/categories'
        },
        {
            id: 'order-management',
            label: 'Quản lý Đơn hàng',
            icon: FiShoppingCart,
            path: '/admin/orders'
        },
        {
            id: 'review-management',
            label: 'Quản lý Đánh giá',
            icon: FiMessageSquare,
            path: '/admin/reviews'
        },
        {
            id: 'reports',
            label: 'Báo cáo Doanh thu',
            icon: FiBarChart2,
            path: '/admin/reports'
        },
    ];

    const staffItems = [
        {
            id: 'orders',
            label: 'Quản lý Đơn hàng',
            icon: FiShoppingCart,
            path: '/staff/orders'
        },
    ];

    return (
        <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '72px' : '260px', transition: 'width 0.3s ease' }}>
            {/* Header */}
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem' }}>
                    {!isCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>B</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                                {role === 'ADMIN' ? 'Bonsai Admin' : 'Nhân viên'}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="sidebar-toggle-btn"
                    >
                        {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, paddingTop: '0.5rem' }}>
                <div className="sidebar-section">
                    {menuItems.map((item) => {
                        if (item.adminOnly && role !== 'ADMIN') return null;
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                end
                                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </div>

                {!isCollapsed && (
                    <div className="sidebar-label">
                        {role === 'ADMIN' ? 'QUẢN TRỊ' : 'NGHIỆP VỤ'}
                    </div>
                )}

                <div className="sidebar-section">
                    {(role === 'ADMIN' ? adminItems : staffItems).map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </div>

                <div style={{ marginTop: 'auto', padding: '0.5rem' }}>
                    <a
                        href={`${API_BASE}/auth/logout`}
                        className="sidebar-nav-item logout-item"
                    >
                        <FiLogOut size={20} />
                        {!isCollapsed && <span>Đăng xuất</span>}
                    </a>
                </div>
            </nav>

            {!isCollapsed && (
                <div className="sidebar-footer">
                    Bonsai Shop &copy; 2025
                </div>
            )}
        </div>
    );
};

export default Sidebar;
