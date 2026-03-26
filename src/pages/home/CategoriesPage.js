import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

import { API_BASE, formatPrice } from '../../utils/config';

const ProductCard = ({ product, onViewDetails }) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/500x650?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert('Vui long dang nhap de mua hang.');
            return;
        }
        try {
            await addToCart(product.id, 1);
            alert('Da them vao gio hang!');
        } catch (err) {
            alert(err.message);
        }
    };

    const imageUrl = getCoverImageUrl(product.coverImage);

    // Render stars
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
                <div className="book-thumb">
                    <img src={imageUrl} alt={product.name} />
                    <span className="book-category">{product.category?.name || 'Chua phan loai'}</span>
                    <span className={`book-availability ${product.stockQuantity > 0 ? '' : 'borrowed'}`}>
                        {product.stockQuantity > 0 ? 'Con hang' : 'Het hang'}
                    </span>
                </div>
                <div className="book-info d-flex flex-column">
                    <h5 className="book-title">{product.name}</h5>
                    <div className="mb-1">
                        {renderStars(product.averageRating)}
                        <small className="text-muted ms-1">({product.reviewCount || 0})</small>
                    </div>
                    <p className="text-success fw-bold mb-auto">{formatPrice(product.price)}</p>
                    <div className="book-actions mt-3 d-flex justify-content-between">
                        <button className="btn btn-view" onClick={(e) => { e.stopPropagation(); onViewDetails(product.id); }}>Chi tiet</button>
                        {isAuthenticated && product.stockQuantity > 0 && (
                            <button className="btn btn-view btn-add-to-cart" onClick={handleAddToCart}>
                                <i className="fas fa-cart-plus"></i> Them vao gio
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
                    <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }}>&laquo;</a>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); onPageChange(number); }}>{number + 1}</a>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }}>&raquo;</a>
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
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
    const navigate = useNavigate();

    const filters = {
        keyword: searchParams.get('keyword') || '',
        categoryId: searchParams.get('categoryId') || '',
        careLevel: searchParams.get('careLevel') || '',
        sort: searchParams.get('sort') || 'createdAt,desc',
        page: searchParams.get('page') || '0',
    };

    const handleShowDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/categories`);
                setCategories(res.data);
            } catch (error) {
                console.error("Loi khi tai danh muc:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/api/products`, {
                    params: {
                        page: filters.page,
                        size: 9,
                        keyword: filters.keyword || undefined,
                        categoryId: filters.categoryId || undefined,
                        careLevel: filters.careLevel || undefined,
                        sort: filters.sort
                    }
                });
                setProducts(res.data.content);
                setPageData({
                    number: res.data.number,
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements,
                });
            } catch (error) {
                console.error("Loi khi tai san pham:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);

    const handleFilterChange = (key, value) => {
        setSearchParams(prev => {
            if (value === '') {
                prev.delete(key);
            } else {
                prev.set(key, value);
            }
            prev.set('page', '0');
            return prev;
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange('keyword', searchTerm);
    };

    const handlePageChange = (pageNumber) => {
        setSearchParams(prev => {
            prev.set('page', pageNumber);
            return prev;
        });
    };

    return (
        <div className="categories-page">
            <section className="page-header">
                <video playsInline autoPlay muted loop id="header-video-bg">
                    <source src="/videos/7.mp4" type="video/mp4" />
                </video>
                <div className="container text-center">
                    <h1 className="fadeUp-header">Bo suu tap Bonsai</h1>
                </div>
            </section>

            <div className="container py-5">
                <div className="row">
                    <aside className="col-lg-3">
                        <div className="filter-sidebar">
                            <div className="filter-widget">
                                <h4 className="filter-title">Tim kiem</h4>
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ten cay, loai bonsai..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" type="submit">
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="filter-widget">
                                <h4 className="filter-title">Danh muc</h4>
                                <ul className="filter-list">
                                    <li className={!filters.categoryId ? 'active' : ''}>
                                        <a onClick={() => handleFilterChange('categoryId', '')}>Tat ca</a>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id} className={filters.categoryId === String(cat.id) ? 'active' : ''}>
                                            <a onClick={() => handleFilterChange('categoryId', cat.id)}>{cat.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="filter-widget">
                                <h4 className="filter-title">Muc do cham soc</h4>
                                <ul className="filter-list">
                                    <li className={!filters.careLevel ? 'active' : ''}>
                                        <a onClick={() => handleFilterChange('careLevel', '')}>Tat ca</a>
                                    </li>
                                    <li className={filters.careLevel === 'EASY' ? 'active' : ''}>
                                        <a onClick={() => handleFilterChange('careLevel', 'EASY')}>De cham soc</a>
                                    </li>
                                    <li className={filters.careLevel === 'MEDIUM' ? 'active' : ''}>
                                        <a onClick={() => handleFilterChange('careLevel', 'MEDIUM')}>Trung binh</a>
                                    </li>
                                    <li className={filters.careLevel === 'HARD' ? 'active' : ''}>
                                        <a onClick={() => handleFilterChange('careLevel', 'HARD')}>Kho</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    <section className="col-lg-9">
                        <div className="shop-controls d-flex justify-content-between align-items-center mb-4 p-3 bg-light border rounded">
                            <p className="result-count mb-0">Hien thi {products.length} tren {pageData.totalElements} ket qua</p>
                            <select
                                className="form-select w-auto"
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="createdAt,desc">Moi nhat</option>
                                <option value="name,asc">Ten A-Z</option>
                                <option value="name,desc">Ten Z-A</option>
                                <option value="price,asc">Gia tang dan</option>
                                <option value="price,desc">Gia giam dan</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center p-5"><div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div></div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} onViewDetails={handleShowDetails} />
                                ))}
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
