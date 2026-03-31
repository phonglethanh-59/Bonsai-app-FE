import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiRefreshCw, FiEdit, FiTrash2, FiPlus, FiX, FiUpload, FiImage, FiStar } from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import { formatPrice, API_BASE } from '../../utils/config';
import { useToast } from '../../components/shared/Toast';

// ========== IMAGE MANAGER COMPONENT ==========
const ImageManager = ({ productId, existingImages, coverImage, onImagesChange }) => {
    const [images, setImages] = useState(existingImages || []);
    const [pendingFiles, setPendingFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        setImages(existingImages || []);
    }, [existingImages]);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            toast.warning('Một số file không phải ảnh đã bị bỏ qua.');
        }
        if (validFiles.length > 10) {
            toast.warning('Tối đa 10 ảnh mỗi lần upload.');
            return;
        }

        setPendingFiles(prev => [...prev, ...validFiles]);

        // Generate previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreviews(prev => [...prev, { file, url: ev.target.result }]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePending = (index) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (pendingFiles.length === 0) return;
        setUploading(true);
        try {
            const result = await adminApi.uploadProductImages(productId, pendingFiles);
            toast.success(result.message || 'Upload thành công!');
            setPendingFiles([]);
            setPreviews([]);
            if (onImagesChange) onImagesChange();
        } catch (err) {
            toast.error('Lỗi upload: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId, imageUrl) => {
        const yes = await toast.confirm('Bạn có chắc muốn xóa ảnh này?');
        if (!yes) return;
        try {
            await adminApi.deleteProductImage(productId, imageId);
            toast.success('Đã xóa ảnh.');
            if (onImagesChange) onImagesChange();
        } catch (err) {
            toast.error('Lỗi xóa ảnh: ' + err.message);
        }
    };

    const handleSetCover = async (imageId) => {
        try {
            await adminApi.setCoverImage(productId, imageId);
            toast.success('Đã đặt làm ảnh bìa!');
            if (onImagesChange) onImagesChange();
        } catch (err) {
            toast.error('Lỗi: ' + err.message);
        }
    };

    // Check if coverImage is an external URL (not from uploaded images)
    const hasExternalCover = coverImage && coverImage.startsWith('http') && !images.some(img => img.imageUrl === coverImage);

    const handleRemoveExternalCover = async () => {
        const yes = await toast.confirm('Xóa ảnh bìa URL cũ? Ảnh upload (nếu có) sẽ được dùng thay thế.');
        if (!yes) return;
        try {
            await adminApi.removeCoverImage(productId);
            toast.success('Đã xóa ảnh bìa URL cũ.');
            if (onImagesChange) onImagesChange();
        } catch (err) {
            toast.error('Lỗi: ' + err.message);
        }
    };

    if (!productId) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', background: '#f9fafb', borderRadius: '0.5rem', border: '2px dashed #e5e7eb' }}>
                <FiImage size={32} style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Vui lòng lưu sản phẩm trước khi upload ảnh.</p>
            </div>
        );
    }

    return (
        <div>
            {/* External Cover Image (from URL) */}
            {hasExternalCover && (
                <div style={{ marginBottom: '1rem' }}>
                    <label className="admin-block admin-text-sm admin-font-medium" style={{ marginBottom: '0.5rem', color: '#d97706' }}>Ảnh bìa URL cũ</label>
                    <div style={{ position: 'relative', width: 120, height: 120, borderRadius: '0.5rem', overflow: 'hidden', border: '2px dashed #f59e0b' }}>
                        <img src={coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={handleRemoveExternalCover}
                            style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Xóa ảnh URL cũ">
                            <FiX size={14} />
                        </button>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(217,119,6,0.9)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px' }}>URL bên ngoài</div>
                    </div>
                </div>
            )}

            {/* Uploaded Images */}
            {images.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <label className="admin-block admin-text-sm admin-font-medium" style={{ marginBottom: '0.5rem' }}>Ảnh hiện tại ({images.length})</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {images.map((img, idx) => {
                            const isCover = img.imageUrl === coverImage;
                            return (
                                <div key={img.id || idx} style={{ position: 'relative', width: 100, height: 100, borderRadius: '0.5rem', overflow: 'hidden', border: isCover ? '3px solid #10b981' : '1px solid #e5e7eb' }}>
                                    <img src={getImageUrl(img.imageUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {isCover && (
                                        <div style={{ position: 'absolute', top: 2, left: 2, background: '#10b981', color: 'white', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 600 }}>Bìa</div>
                                    )}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', background: 'rgba(0,0,0,0.6)' }}>
                                        {!isCover && (
                                            <button onClick={() => handleSetCover(img.id)} style={{ flex: 1, background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: '3px', fontSize: '0.65rem' }} title="Đặt làm bìa">
                                                <FiStar size={12} />
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteImage(img.id, img.imageUrl)} style={{ flex: 1, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '3px', fontSize: '0.65rem' }} title="Xóa">
                                            <FiTrash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Pending Previews */}
            {previews.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                    <label className="admin-block admin-text-sm admin-font-medium" style={{ marginBottom: '0.5rem', color: '#2563eb' }}>Ảnh sẽ upload ({previews.length})</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {previews.map((p, idx) => (
                            <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: '0.5rem', overflow: 'hidden', border: '2px dashed #3b82f6' }}>
                                <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button onClick={() => removePending(idx)} style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                                    <FiX size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Area */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" style={{ display: 'none' }} />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                    <FiUpload size={16} /> Chọn ảnh
                </button>
                {pendingFiles.length > 0 && (
                    <button type="button" onClick={handleUpload} disabled={uploading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', opacity: uploading ? 0.6 : 1 }}>
                        {uploading ? <FiRefreshCw size={16} className="animate-spin" /> : <FiUpload size={16} />}
                        {uploading ? 'Đang upload...' : `Upload ${pendingFiles.length} ảnh`}
                    </button>
                )}
            </div>
        </div>
    );
};

// ========== PRODUCT MODAL ==========
const ProductModal = ({ isOpen, onClose, onSave, product, categories, onImagesChange }) => {
    const [form, setForm] = useState({
        sku: '', name: '', description: '', price: '', origin: '', supplier: '',
        coverImage: '', age: '', height: '', potType: '', careLevel: 'EASY',
        stockQuantity: '', featured: false, categoryId: '', careGuide: ''
    });
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        if (product) {
            setForm({
                sku: product.sku || '', name: product.name || '', description: product.description || '',
                price: product.price || '', origin: product.origin || '', supplier: product.supplier || '',
                coverImage: product.coverImage || '', age: product.age || '', height: product.height || '',
                potType: product.potType || '', careLevel: product.careLevel || 'EASY',
                stockQuantity: product.stockQuantity || '', featured: product.featured || false,
                categoryId: product.categoryId || product.category?.id || '',
                careGuide: product.careGuide || ''
            });
            setActiveTab('info');
        } else {
            setForm({ sku: '', name: '', description: '', price: '', origin: '', supplier: '', coverImage: '', age: '', height: '', potType: '', careLevel: 'EASY', stockQuantity: '', featured: false, categoryId: '', careGuide: '' });
            setActiveTab('info');
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            sku: form.sku, name: form.name, description: form.description,
            price: Number(form.price), origin: form.origin, supplier: form.supplier,
            coverImage: form.coverImage,
            age: form.age ? Number(form.age) : null, height: form.height ? Number(form.height) : null,
            potType: form.potType, careLevel: form.careLevel,
            stockQuantity: Number(form.stockQuantity), featured: form.featured,
            careGuide: form.careGuide,
            category: form.categoryId ? { id: Number(form.categoryId) } : null,
        };
        onSave(data);
    };

    if (!isOpen) return null;

    const tabStyle = (active) => ({
        padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
        borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
        color: active ? '#10b981' : '#6b7280', background: 'none', border: 'none',
        borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: active ? '#10b981' : 'transparent'
    });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', width: '90%', maxWidth: '750px', maxHeight: '90vh', overflow: 'auto', padding: '1.5rem' }}>
                <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
                    <h3 className="admin-text-lg admin-font-semibold">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                    <button onClick={onClose} className="admin-p-1"><FiX className="w-5 h-5" /></button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
                    <button type="button" onClick={() => setActiveTab('info')} style={tabStyle(activeTab === 'info')}>Thông tin</button>
                    <button type="button" onClick={() => setActiveTab('images')} style={tabStyle(activeTab === 'images')}>
                        Ảnh sản phẩm {product?.images?.length > 0 && `(${product.images.length})`}
                    </button>
                </div>

                {activeTab === 'info' && (
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
                                <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Mô tả</label>
                                <textarea name="description" value={form.description} onChange={handleChange} className="admin-input" rows={3} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="admin-block admin-text-sm admin-font-medium admin-mb-2">Hướng dẫn chăm sóc</label>
                                <textarea name="careGuide" value={form.careGuide} onChange={handleChange} className="admin-input" rows={4} placeholder="Nhập hướng dẫn chăm sóc cây bonsai..." />
                            </div>
                        </div>
                        <div className="admin-flex admin-justify-between" style={{ marginTop: '1.5rem' }}>
                            <button type="button" onClick={onClose} className="admin-button admin-button-secondary">Hủy</button>
                            <button type="submit" className="admin-button admin-button-primary">{product ? 'Cập nhật' : 'Thêm mới'}</button>
                        </div>
                    </form>
                )}

                {activeTab === 'images' && (
                    <ImageManager
                        productId={product?.id}
                        existingImages={product?._loadedImages || []}
                        coverImage={product?.coverImage}
                        onImagesChange={onImagesChange}
                    />
                )}
            </div>
        </div>
    );
};

// ========== MAIN PAGE ==========
const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({ keyword: '', categoryId: '', careLevel: '' });
    const [appliedFilters, setAppliedFilters] = useState({ keyword: '', categoryId: '', careLevel: '' });
    const [pagination, setPagination] = useState({ currentPage: 1, perPage: 8, totalPages: 0, total: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const toast = useToast();

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1,
                size: pagination.perPage,
                keyword: appliedFilters.keyword || undefined,
                categoryId: appliedFilters.categoryId || undefined,
                careLevel: appliedFilters.careLevel || undefined,
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
    }, [pagination.currentPage, pagination.perPage, appliedFilters]);

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

    // Load full product detail (with images) when editing
    const handleEditProduct = async (p) => {
        try {
            // Load images with IDs from dedicated endpoint
            const images = await adminApi.getProductImages(p.id);
            const loadedProduct = { ...p, _loadedImages: images || [] };
            setEditingProduct(loadedProduct);
            setIsModalOpen(true);
        } catch (err) {
            setEditingProduct({ ...p, _loadedImages: [] });
            setIsModalOpen(true);
        }
    };

    const handleSave = async (data) => {
        try {
            if (editingProduct) {
                await adminApi.updateProduct(editingProduct.id, data);
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                const result = await adminApi.createProduct(data);
                toast.success('Thêm sản phẩm thành công! Chuyển sang tab Ảnh để upload ảnh.');
                // After creating, open modal with the new product for image upload
                if (result?.product?.id) {
                    setEditingProduct(result.product);
                    setIsModalOpen(true);
                    loadProducts();
                    return;
                }
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (err) {
            toast.error(`Lỗi: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        const yes = await toast.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
        if (yes) {
            try {
                await adminApi.deleteProduct(id);
                toast.success('Xóa thành công!');
                loadProducts();
            } catch (err) {
                toast.error(`Lỗi: ${err.message}`);
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setAppliedFilters({ ...filters });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleReset = () => {
        const empty = { keyword: '', categoryId: '', careLevel: '' };
        setFilters(empty);
        setAppliedFilters(empty);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleImagesChange = () => {
        loadProducts();
        // Refresh the editing product too
        if (editingProduct?.id) {
            handleEditProduct(editingProduct);
        }
    };

    const careLevelText = { EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó' };

    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/50x50?text=No';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

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
                                    <th className="admin-table-header">Ảnh</th>
                                    <th className="admin-table-header admin-text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center"><FiRefreshCw className="w-5 h-5 animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                                ) : products.length > 0 ? products.map(p => (
                                    <tr key={p.id} className="admin-table-row">
                                        <td className="admin-table-cell">
                                            <img src={getImageUrl(p.coverImage)} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '0.375rem' }} />
                                        </td>
                                        <td className="admin-table-cell admin-text-sm">{p.sku}</td>
                                        <td className="admin-table-cell admin-font-medium">{p.name}</td>
                                        <td className="admin-table-cell admin-text-sm">{p.categoryName || p.category?.name || '-'}</td>
                                        <td className="admin-table-cell admin-text-sm" style={{ color: '#059669', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                                        <td className="admin-table-cell admin-text-sm">{p.stockQuantity}</td>
                                        <td className="admin-table-cell admin-text-sm">{careLevelText[p.careLevel] || p.careLevel}</td>
                                        <td className="admin-table-cell admin-text-sm">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                                                <FiImage size={14} /> {p.images?.length || 0}
                                            </span>
                                        </td>
                                        <td className="admin-table-cell admin-text-center">
                                            <div className="admin-flex admin-items-center admin-justify-center admin-space-x-2">
                                                <button onClick={() => handleEditProduct(p)} className="admin-text-blue-600 admin-p-1" title="Sửa"><FiEdit className="w-4 h-4" /></button>
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

            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} product={editingProduct} categories={categories} onImagesChange={handleImagesChange} />
        </div>
    );
};

export default AdminProductsPage;
