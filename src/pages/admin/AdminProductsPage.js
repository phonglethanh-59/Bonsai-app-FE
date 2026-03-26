import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import { formatPrice } from '../../utils/config';

const ProductModal = ({ isOpen, onClose, onSave, product, categories }) => {
    const [form, setForm] = useState({
        sku: '', name: '', description: '', price: '', origin: '', supplier: '',
        coverImage: '', age: '', height: '', potType: '', careLevel: 'EASY',
        stockQuantity: '', featured: false, categoryId: ''
    });

    useEffect(() => {
        if (product) {
            setForm({
                sku: product.sku || '', name: product.name || '', description: product.description || '',
                price: product.price || '', origin: product.origin || '', supplier: product.supplier || '',
                coverImage: product.coverImage || '', age: product.age || '', height: product.height || '',
                potType: product.potType || '', careLevel: product.careLevel || 'EASY',
                stockQuantity: product.stockQuantity || '', featured: product.featured || false,
                categoryId: product.categoryId || product.category?.id || ''
            });
        } else {
            setForm({ sku: '', name: '', description: '', price: '', origin: '', supplier: '', coverImage: '', age: '', height: '', potType: '', careLevel: 'EASY', stockQuantity: '', featured: false, categoryId: '' });
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            price: Number(form.price),
            age: form.age ? Number(form.age) : null,
            height: form.height ? Number(form.height) : null,
            stockQuantity: Number(form.stockQuantity),
            categoryId: form.categoryId ? Number(form.categoryId) : null,
        });
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', padding: '1.5rem' }}>
                <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
                    <h3 className="admin-text-lg admin-font-semibold">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                    <button onClick={onClose} className="admin-p-1"><FiX className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="admin-grid admin-grid-cols-2 admin-gap-4">
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">SKU *</label>
                            <input name="sku" value={form.sku} onChange={handleChange} required className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Tên sản phẩm *</label>
                            <input name="name" value={form.name} onChange={handleChange} required className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Giá (VND) *</label>
                            <input name="price" type="number" value={form.price} onChange={handleChange} required className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Danh mục</label>
                            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="admin-input">
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Xuất xứ</label>
                            <input name="origin" value={form.origin} onChange={handleChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Nhà cung cấp</label>
                            <input name="supplier" value={form.supplier} onChange={handleChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Tuổi cây (năm)</label>
                            <input name="age" type="number" value={form.age} onChange={handleChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Chiều cao (cm)</label>
                            <input name="height" type="number" value={form.height} onChange={handleChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Loại chậu</label>
                            <input name="potType" value={form.potType} onChange={handleChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Mức chăm sóc</label>
                            <select name="careLevel" value={form.careLevel} onChange={handleChange} className="admin-input">
                                <option value="EASY">Dễ</option>
                                <option value="MEDIUM">Trung bình</option>
                                <option value="HARD">Khó</option>
                            </select>
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Số lượng tồn *</label>
                            <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required className="admin-input" />
                        </div>
                        <div className="admin-flex admin-items-end">
                            <label className="admin-flex admin-items-center" style={{ gap: '0.5rem' }}>
                                <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
                                <span className="admin-text-sm admin-font-medium">Sản phẩm nổi bật</span>
                            </label>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">URL ảnh bìa</label>
                            <input name="coverImage" value={form.coverImage} onChange={handleChange} className="admin-input" placeholder="https://..." />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Mô tả</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="admin-input" rows={3} />
                        </div>
                    </div>
                    <div className="admin-flex admin-justify-between" style={{ marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="admin-button admin-button-secondary">Hủy</button>
                        <button type="submit" className="admin-button admin-button-primary">{product ? 'Cập nhật' : 'Thêm mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({ keyword: '', categoryId: '', careLevel: '' });
    const [pagination, setPagination] = useState({ currentPage: 1, perPage: 8, totalPages: 0, total: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1,
                size: pagination.perPage,
                keyword: filters.keyword || undefined,
                categoryId: filters.categoryId || undefined,
                careLevel: filters.careLevel || undefined,
                sort: 'createdAt,desc'
            };
            Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
            const res = await adminApi.getProducts(params);
            setProducts(res.content || []);
            setPagination(prev => ({ ...prev, totalPages: res.totalPages || 0, total: res.totalElements || 0 }));
        } catch (err) {
            console.error('Error loading products:', err);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.currentPage, pagination.perPage, filters]);

    const loadCategories = useCallback(async () => {
        try {
            const res = await adminApi.getCategories();
            setCategories(res || []);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    }, []);

    useEffect(() => { loadCategories(); }, [loadCategories]);
    useEffect(() => { loadProducts(); }, [loadProducts]);

    const handleSave = async (data) => {
        try {
            if (editingProduct) {
                await adminApi.updateProduct(editingProduct.id, data);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await adminApi.createProduct(data);
                alert('Thêm sản phẩm thành công!');
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await adminApi.deleteProduct(id);
                alert('Xóa thành công!');
                loadProducts();
            } catch (err) {
                alert(`Lỗi: ${err.message}`);
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => setPagination(prev => ({ ...prev, currentPage: 1 }));
    const handleReset = () => { setFilters({ keyword: '', categoryId: '', careLevel: '' }); setPagination(prev => ({ ...prev, currentPage: 1 })); };

    const careLevelText = { EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó' };

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                <div className="admin-flex admin-items-center admin-justify-between">
                    <h1 className="admin-text-2xl admin-font-bold admin-text-gray-900">Quản lý sản phẩm</h1>
                    <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="admin-button admin-button-primary admin-flex admin-items-center" style={{ gap: '0.5rem' }}>
                        <FiPlus /> Thêm sản phẩm
                    </button>
                </div>

                {/* Filters */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-p-6">
                    <div className="admin-grid admin-grid-cols-1 admin-sm:grid-cols-2 admin-lg:grid-cols-4 admin-gap-4">
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Từ khóa</label>
                            <input name="keyword" placeholder="Tên sản phẩm..." value={filters.keyword} onChange={handleFilterChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Danh mục</label>
                            <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} className="admin-input">
                                <option value="">Tất cả</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Mức chăm sóc</label>
                            <select name="careLevel" value={filters.careLevel} onChange={handleFilterChange} className="admin-input">
                                <option value="">Tất cả</option>
                                <option value="EASY">Dễ</option>
                                <option value="MEDIUM">Trung bình</option>
                                <option value="HARD">Khó</option>
                            </select>
                        </div>
                        <div className="admin-flex admin-items-end admin-space-x-2">
                            <button onClick={handleSearch} className="admin-flex-1 admin-button admin-button-primary">Lọc</button>
                            <button onClick={handleReset} className="admin-button" style={{ border: '1px solid #d1d5db' }}>Reset</button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                    <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sách sản phẩm ({pagination.total})</h2>
                    </div>
                    <div className="admin-overflow-x-auto">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">Ảnh</th>
                                    <th className="admin-table-header">SKU</th>
                                    <th className="admin-table-header">Tên</th>
                                    <th className="admin-table-header">Danh mục</th>
                                    <th className="admin-table-header">Giá</th>
                                    <th className="admin-table-header">Tồn kho</th>
                                    <th className="admin-table-header">Chăm sóc</th>
                                    <th className="admin-table-header">Nổi bật</th>
                                    <th className="admin-table-header admin-text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center"><FiRefreshCw className="w-5 h-5 animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                                ) : products.length > 0 ? products.map(p => (
                                    <tr key={p.id} className="admin-table-row">
                                        <td className="admin-table-cell">
                                            <img src={p.coverImage || 'https://placehold.co/50x50?text=No'} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '0.25rem' }} />
                                        </td>
                                        <td className="admin-table-cell admin-text-sm">{p.sku}</td>
                                        <td className="admin-table-cell admin-font-medium">{p.name}</td>
                                        <td className="admin-table-cell admin-text-sm">{p.categoryName || p.category?.name || '-'}</td>
                                        <td className="admin-table-cell admin-text-sm" style={{ color: '#059669', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                                        <td className="admin-table-cell admin-text-sm">{p.stockQuantity}</td>
                                        <td className="admin-table-cell admin-text-sm">{careLevelText[p.careLevel] || p.careLevel}</td>
                                        <td className="admin-table-cell admin-text-sm">{p.featured ? '⭐' : '-'}</td>
                                        <td className="admin-table-cell admin-text-center">
                                            <div className="admin-flex admin-items-center admin-justify-center admin-space-x-2">
                                                <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="admin-text-blue-600 admin-p-1" title="Sửa"><FiEdit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(p.id)} className="admin-text-red-600 admin-p-1" title="Xóa"><FiTrash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center">Không có sản phẩm nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="admin-px-6 admin-py-4 admin-border-t admin-border-gray-200 admin-flex admin-items-center admin-justify-between">
                            <span className="admin-text-sm admin-text-gray-500">Trang {pagination.currentPage} / {pagination.totalPages}</span>
                            <div className="admin-flex admin-space-x-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
                                    <button key={num} onClick={() => setPagination(prev => ({ ...prev, currentPage: num }))}
                                        className="admin-button" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: num === pagination.currentPage ? '#2563eb' : 'white', color: num === pagination.currentPage ? 'white' : '#374151', border: '1px solid #d1d5db' }}>
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} product={editingProduct} categories={categories} />
        </div>
    );
};

export default AdminProductsPage;
