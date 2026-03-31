import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import AdminWrapper from './AdminWrapper';

const AdminLayout = () => {
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <AdminWrapper>
            <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 20 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar role={user?.role} />

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: '260px' }}>
                    {/* Top Header */}
                    <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                                    Xin chào, {user?.userDetail?.fullName || user?.username}!
                                </h1>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                                    Chào mừng bạn đến với hệ thống quản lý Bonsai Shop
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 36, height: 36, background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                                            {(user?.userDetail?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>
                                            {user?.userDetail?.fullName || user?.username}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textTransform: 'capitalize' }}>
                                            {user?.role?.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <footer style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '0.75rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                Bản quyền &copy; Bonsai Shop {new Date().getFullYear()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                Hệ thống quản lý cửa hàng bonsai
                            </span>
                        </div>
                    </footer>
                </div>
            </div>
        </AdminWrapper>
    );
};

export default AdminLayout;
