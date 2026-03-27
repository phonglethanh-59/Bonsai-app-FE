import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE } from '../../utils/config';
import {
    FiHome, FiUsers, FiPackage, FiGrid, FiShoppingCart,
    FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiMessageSquare, FiBarChart2
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
            label: 'Quan ly Nguoi dung',
            icon: FiUsers,
            path: '/admin/dashboard'
        },
        {
            id: 'product-management',
            label: 'Quan ly San pham',
            icon: FiPackage,
            path: '/admin/products'
        },
        {
            id: 'category-management',
            label: 'Quan ly Danh muc',
            icon: FiGrid,
            path: '/admin/categories'
        },
        {
            id: 'order-management',
            label: 'Quan ly Don hang',
            icon: FiShoppingCart,
            path: '/admin/orders'
        },
        {
            id: 'review-management',
            label: 'Quan ly Danh gia',
            icon: FiMessageSquare,
            path: '/admin/reviews'
        },
        {
            id: 'reports',
            label: 'Bao cao Doanh thu',
            icon: FiBarChart2,
            path: '/admin/reports'
        },
    ];

    const staffItems = [
        {
            id: 'orders',
            label: 'Quan ly Don hang',
            icon: FiShoppingCart,
            path: '/staff/orders'
        },
    ];

    const handleItemClick = (itemId) => {
        // Handle item click if needed
    };

    return (
        <div className={`admin-sidebar admin-text-white admin-h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} admin-flex admin-flex-col fixed admin-lg:relative z-30`}>
            {/* Header */}
            <div className="admin-p-4 admin-border admin-border-blue-600">
                <div className="admin-flex admin-items-center admin-justify-between">
                    {!isCollapsed && (
                        <h1 className="admin-text-lg admin-font-bold admin-text-white admin-uppercase admin-tracking-wider">
                            {role === 'ADMIN' ? 'BONSAI ADMIN' : 'NHAN VIEN'}
                        </h1>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="admin-p-2 admin-rounded-full hover:admin-bg-blue-600 transition-colors duration-200"
                    >
                        {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="admin-flex-1 admin-py-4">
                <div className="admin-space-y-1">
                    {menuItems.map((item) => {
                        if (item.adminOnly && role !== 'ADMIN') return null;
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={() => handleItemClick(item.id)}
                                className={({ isActive }) =>
                                    `admin-w-full admin-flex admin-items-center admin-px-4 admin-py-3 admin-text-left hover:admin-bg-blue-600 transition-colors duration-200 ${isActive ? 'admin-bg-blue-500' : ''}`
                                }
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="admin-ml-3 admin-text-sm admin-font-medium">{item.label}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="admin-my-4 admin-border admin-border-blue-600"></div>

                {!isCollapsed && (
                    <div className="admin-px-4 admin-py-2">
                        <h3 className="admin-text-xs admin-font-semibold admin-text-blue-200 admin-uppercase admin-tracking-wider">
                            {role === 'ADMIN' ? 'QUAN TRI' : 'NGHIEP VU'}
                        </h3>
                    </div>
                )}

                <div className="admin-space-y-1">
                    {(role === 'ADMIN' ? adminItems : staffItems).map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={() => handleItemClick(item.id)}
                                className={({ isActive }) =>
                                    `admin-w-full admin-flex admin-items-center admin-px-4 admin-py-3 admin-text-left hover:admin-bg-blue-600 transition-colors duration-200 ${isActive ? 'admin-bg-blue-500' : ''}`
                                }
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="admin-ml-3 admin-text-sm admin-font-medium">{item.label}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="admin-my-4 admin-border admin-border-blue-600"></div>

                <div className="admin-space-y-1">
                    <a
                        href={`${API_BASE}/auth/logout`}
                        className="admin-w-full admin-flex admin-items-center admin-px-4 admin-py-3 admin-text-left hover:admin-bg-red-600 transition-colors duration-200"
                    >
                        <FiLogOut size={20} className="flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="admin-ml-3 admin-text-sm admin-font-medium">Dang xuat</span>
                        )}
                    </a>
                </div>
            </nav>

            {!isCollapsed && (
                <div className="admin-p-4 admin-border admin-border-blue-600">
                    <div className="admin-text-xs admin-text-blue-200 admin-text-center">
                        Bonsai Shop &copy; 2025
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
