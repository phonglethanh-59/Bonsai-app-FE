// src/components/admin/AdminLayout.js

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
            <div className="admin-flex admin-h-screen admin-bg-gray-100">
                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 admin-lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
                
                {/* Sidebar */}
                <div className={`${isMobileMenuOpen ? 'admin-translate-x-0' : '-translate-x-full'} admin-lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <Sidebar role={user?.role} />
                </div>
                
                {/* Main Content */}
                <div className="admin-flex-1 admin-flex admin-flex-col admin-overflow-hidden">
                    {/* Top Header */}
                    <header className="admin-bg-white admin-shadow-sm admin-border admin-border-gray-200 admin-px-4 admin-lg:px-6 admin-py-4">
                        <div className="admin-flex admin-items-center admin-justify-between">
                            {/* === PHẦN ĐÃ SỬA LỖI === */}
                            <div className="admin-flex admin-items-center">
                                {/* Mobile Menu Button */}
                               
                                <div>
                                    <h1 className="admin-text-xl admin-lg:text-2xl admin-font-bold admin-text-gray-900">
                                        Xin chào {user?.userDetail?.fullName || user?.username}!
                                    </h1>
                                    <p className="admin-text-sm admin-text-gray-600 admin-mt-1 admin-hidden admin-sm:block">
                                        Chào mừng bạn đến với hệ thống quản lý thư viện
                                    </p>
                                </div>
                            </div>
                            {/* ======================= */}

                            <div className="admin-flex admin-items-center admin-space-x-4">
                               
                                
                                {/* User Profile */}
                                <div className="admin-flex admin-items-center admin-space-x-3">
                                    <div className="admin-w-8 admin-h-8 admin-bg-blue-500 admin-rounded-full admin-flex admin-items-center admin-justify-center">
                                        <span className="admin-text-white admin-text-sm admin-font-medium">
                                            {(user?.userDetail?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="admin-hidden admin-md:block">
                                        <p className="admin-text-sm admin-font-medium admin-text-gray-900">
                                            {user?.userDetail?.fullName || user?.username}
                                        </p>
                                        <p className="admin-text-xs admin-text-gray-500 capitalize">
                                            {user?.role?.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="admin-flex-1 admin-overflow-y-auto admin-bg-gray-50">
                        <div className="admin-p-6">
                            <Outlet />
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="admin-bg-white admin-border admin-border-gray-200 admin-px-6 admin-py-4">
                        <div className="admin-flex admin-items-center admin-justify-between">
                            <div className="admin-text-sm admin-text-gray-500">
                                Bản quyền &copy; Thư viện VTI {new Date().getFullYear()}
                            </div>
                            <div className="admin-text-sm admin-text-gray-500">
                                Hệ thống quản lý thư viện thông minh
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </AdminWrapper>
    );
};

export default AdminLayout;