import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

import { API_BASE, formatPrice } from '../../utils/config';
import { useToast } from '../../components/shared/Toast';

const ProductCard = ({ product, onViewDetails }) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const toast = useToast();

    const handleToggleWishlist = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.warning('Vui lòng đăng nhập để sử dụng danh sách yêu thích.');
            return;
        }
        try {
            await toggleWishlist(product.id);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/500x650?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.warning('Vui lòng đăng nhập để mua hàng.');
            return;
        }
        try {
            await addToCart(product.id, 1);
            toast.success('Đã thêm vào giỏ hàng!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const imageUrl = getCoverImageUrl(product.coverImage);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className={`fas fa-star ${i <= Math.round(rating || 0) ? 'text-warning' : 'text-light'}`} style={{ fontSize: '0.8rem' }}></i>
            );
        }
        return stars;
    };

    return (
        <div className="col">
            <div className="book-card h-100" style={{ cursor: 'pointer' }} onClick={() => onViewDetails(product.id)}>
                <div className="book-thumb" style={{ position: 'relative' }}>
                    <img src={imageUrl} alt={product.name} />
                    <span className="book-category">{product.category?.name || 'Chưa phân loại'}</span>
                    <span className={`book-availability ${product.stockQuantity > 0 ? '' : 'borrowed'}`}>
                        {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                    <button
                        className="btn btn-sm wishlist-heart-btn"
                        onClick={handleToggleWishlist}
                        title={isInWishlist(product.id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 2,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}
                           style={{ color: isInWishlist(product.id) ? '#e74c3c' : '#999', fontSize: '1rem' }}></i>
                    </button>
                </div>
                <div className="book-info d-flex flex-column">
                    <h5 className="book-title">{product.name}</h5>
                    <div className="mb-1">
                        {renderStars(product.averageRating)}
                        <small className="text-muted ms-1">({product.reviewCount || 0})</small>
                    </div>
                    <p className="text-success fw-bold mb-auto">{formatPrice(product.price)}</p>
                    <div className="book-actions mt-3 d-flex justify-content-between">
                        <button className="btn btn-view" onClick={(e) => { e.stopPropagation(); onViewDetails(product.id); }}>Chi tiết</button>
                        {isAuthenticated && product.stockQuantity > 0 && (
                            <button className="btn btn-view btn-add-to-cart" onClick={handleAddToCart}>
                                <i className="fas fa-cart-plus"></i> Thêm vào giỏ
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
    return (
        <nav className="mt-5 d-flex justify-content-center">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>&laquo;</button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(number)}>{number + 1}</button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>&raquo;</button>
                </li>
            </ul>
        </nav>
    );
};

const CategoriesPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pageData, setPageData] = useState({ number: 0, totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filter state
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [careLevel, setCareLevel] = useState('');
    const [sortBy, setSortBy] = useState('createdAt,desc');
    const [page, setPage] = useState(0);

    // Load categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/categories`);
                setCategories(res.data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // Load products when filters change
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: page,
                size: 9,
                sort: sortBy,
            };
            if (keyword) params.keyword = keyword;
            if (categoryId) params.categoryId = categoryId;
            if (careLevel) params.careLevel = careLevel;

            const res = await axios.get(`${API_BASE}/api/products`, { params });
            setProducts(res.data.content || []);
            setPageData({
                number: res.data.number,
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements,
            });
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [keyword, categoryId, careLevel, sortBy, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setKeyword(searchInput.trim());
        // Reset các filter khác khi tìm kiếm để kết quả chính xác hơn
        setCategoryId('');
        setCareLevel('');
        setPage(0);
    };

    const handleCategoryChange = (catId) => {
        setCategoryId(catId);
        // Giữ keyword khi chọn danh mục
        setPage(0);
    };

    const handleCareLevelChange = (level) => {
        setCareLevel(level);
        setPage(0);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setPage(0);
    };

    // Cho phép tìm kiếm khi nhấn Enter trong input (đã handle qua form submit)
    // Thêm nút xóa keyword
    const handleClearSearch = () => {
        setSearchInput('');
        setKeyword('');
        setPage(0);
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleShowDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="categories-page">
            <section className="page-header">
                <video playsInline autoPlay muted loop id="header-video-bg">
                    <source src="/videos/7.mp4" type="video/mp4" />
                </video>
                <div className="container text-center">
                    <h1 className="fadeUp-header">Bộ sưu tập Bonsai</h1>
                </div>
            </section>

            <div className="container py-5">
                <div className="row">
                    <aside className="col-lg-3">
                        <div className="filter-sidebar">
                            <div className="filter-widget">
                                <h4 className="filter-title">Tìm kiếm</h4>
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tên cây, loại bonsai..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                        />
                                        <button className="btn btn-outline-secondary" type="submit">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </form>
                                {keyword && (
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <small className="text-muted">Đang tìm: <strong>"{keyword}"</strong></small>
                                        <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={handleClearSearch} title="Xóa tìm kiếm">
                                            <i className="fas fa-times" style={{ fontSize: '0.7rem' }}></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="filter-widget">
                                <h4 className="filter-title">Danh mục</h4>
                                <ul className="filter-list">
                                    <li className={!categoryId ? 'active' : ''}>
                                        <a onClick={() => handleCategoryChange('')} style={{ cursor: 'pointer' }}>Tất cả</a>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id} className={categoryId === String(cat.id) ? 'active' : ''}>
                                            <a onClick={() => handleCategoryChange(String(cat.id))} style={{ cursor: 'pointer' }}>{cat.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="filter-widget">
                                <h4 className="filter-title">Mức độ chăm sóc</h4>
                                <ul className="filter-list">
                                    <li className={!careLevel ? 'active' : ''}>
                                        <a onClick={() => handleCareLevelChange('')} style={{ cursor: 'pointer' }}>Tất cả</a>
                                    </li>
                                    <li className={careLevel === 'EASY' ? 'active' : ''}>
                                        <a onClick={() => handleCareLevelChange('EASY')} style={{ cursor: 'pointer' }}>Dễ chăm sóc</a>
                                    </li>
                                    <li className={careLevel === 'MEDIUM' ? 'active' : ''}>
                                        <a onClick={() => handleCareLevelChange('MEDIUM')} style={{ cursor: 'pointer' }}>Trung bình</a>
                                    </li>
                                    <li className={careLevel === 'HARD' ? 'active' : ''}>
                                        <a onClick={() => handleCareLevelChange('HARD')} style={{ cursor: 'pointer' }}>Khó</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    <section className="col-lg-9">
                        <div className="shop-controls d-flex justify-content-between align-items-center mb-4 p-3 bg-light border rounded">
                            <p className="result-count mb-0">Hiển thị {products.length} trên {pageData.totalElements} kết quả</p>
                            <select
                                className="form-select w-auto"
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="createdAt,desc">Mới nhất</option>
                                <option value="name,asc">Tên A-Z</option>
                                <option value="name,desc">Tên Z-A</option>
                                <option value="price,asc">Giá tăng dần</option>
                                <option value="price,desc">Giá giảm dần</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center p-5"><div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div></div>
                        ) : products.length > 0 ? (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} onViewDetails={handleShowDetails} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                <p className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</p>
                            </div>
                        )}
                        <Pagination
                            currentPage={pageData.number}
                            totalPages={pageData.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
