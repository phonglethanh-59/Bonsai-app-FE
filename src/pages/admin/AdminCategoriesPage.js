import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiRefreshCw } from 'react-icons/fi';
import adminApi from '../../services/adminApi';

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
    const [form, setForm] = useState({ name: '', description: '' });

    useEffect(() => {
        if (category) {
            setForm({ name: category.name || '', description: category.description || '' });
        } else {
            setForm({ name: '', description: '' });
        }
    }, [category, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '500px', padding: '1.5rem' }}>
                <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
                    <h3 className="admin-text-lg admin-font-semibold">{category ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
                    <button onClick={onClose} className="admin-p-1"><FiX className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="admin-space-y-4">
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Tên danh mục *</label>
                            <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Mô tả</label>
                            <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="admin-input" rows={3} />
                        </div>
                    </div>
                    <div className="admin-flex admin-justify-between" style={{ marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="admin-button admin-button-secondary">Hủy</button>
                        <button type="submit" className="admin-button admin-button-primary">{category ? 'Cập nhật' : 'Thêm mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const loadCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminApi.getCategories();
            setCategories(res || []);
        } catch (err) {
            console.error('Error loading categories:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadCategories(); }, [loadCategories]);

    const handleSave = async (data) => {
        try {
            if (editingCategory) {
                await adminApi.updateCategory(editingCategory.id, data);
                alert('Cập nhật danh mục thành công!');
            } else {
                await adminApi.createCategory(data);
                alert('Thêm danh mục thành công!');
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa danh mục sẽ ảnh hưởng đến các sản phẩm thuộc danh mục này. Bạn có chắc?')) {
            try {
                await adminApi.deleteCategory(id);
                alert('Xóa danh mục thành công!');
                loadCategories();
            } catch (err) {
                alert(`Lỗi: ${err.message}`);
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                <div className="admin-flex admin-items-center admin-justify-between">
                    <h1 className="admin-text-2xl admin-font-bold admin-text-gray-900">Quản lý danh mục</h1>
                    <button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} className="admin-button admin-button-primary admin-flex admin-items-center" style={{ gap: '0.5rem' }}>
                        <FiPlus /> Thêm danh mục
                    </button>
                </div>

                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                    <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sách danh mục ({categories.length})</h2>
                    </div>
                    <div className="admin-overflow-x-auto">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">ID</th>
                                    <th className="admin-table-header">Tên danh mục</th>
                                    <th className="admin-table-header">Mô tả</th>
                                    <th className="admin-table-header">Số sản phẩm</th>
                                    <th className="admin-table-header admin-text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" className="admin-table-cell admin-text-center"><FiRefreshCw className="w-5 h-5 animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                                ) : categories.length > 0 ? categories.map(cat => (
                                    <tr key={cat.id} className="admin-table-row">
                                        <td className="admin-table-cell admin-font-medium">{cat.id}</td>
                                        <td className="admin-table-cell admin-font-medium">{cat.name}</td>
                                        <td className="admin-table-cell admin-text-sm admin-text-gray-500">{cat.description || '-'}</td>
                                        <td className="admin-table-cell admin-text-sm">{cat.products?.length || 0}</td>
                                        <td className="admin-table-cell admin-text-center">
                                            <div className="admin-flex admin-items-center admin-justify-center admin-space-x-2">
                                                <button onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} className="admin-text-blue-600 admin-p-1" title="Sửa"><FiEdit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(cat.id)} className="admin-text-red-600 admin-p-1" title="Xóa"><FiTrash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="admin-table-cell admin-text-center">Không có danh mục nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} category={editingCategory} />
        </div>
    );
};

export default AdminCategoriesPage;
