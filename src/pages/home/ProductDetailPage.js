import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, formatPrice } from '../../utils/config';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ReviewItem = ({ review }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-light'}`}></i>
    ));
    return (
        <div className="review-item mb-3 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center">
                <strong>{review.reviewerName}</strong>
                <small className="text-muted">{review.reviewDate}</small>
            </div>
            <div className="review-stars my-1">{stars}</div>
            <p className="mb-0 fst-italic text-muted">"{review.comment}"</p>
        </div>
    );
};

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await axios.post(`${API_BASE}/api/reviews`,
                { productId, rating, comment },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            setComment('');
            setRating(5);
            onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Khong the gui danh gia.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-3 border rounded bg-light">
            <h6 className="mb-3">Viet danh gia cua ban</h6>
            {error && <div className="alert alert-danger py-1 small">{error}</div>}
            <div className="mb-3">
                <label className="form-label small fw-bold">Danh gia sao</label>
                <div>
                    {[1, 2, 3, 4, 5].map(star => (
                        <i key={star}
                           className={`fas fa-star me-1 ${star <= rating ? 'text-warning' : 'text-muted'}`}
                           style={{ cursor: 'pointer', fontSize: '1.4rem' }}
                           onClick={() => setRating(star)} />
                    ))}
                </div>
            </div>
            <div className="mb-3">
                <textarea className="form-control" rows="3"
                    placeholder="Chia se trai nghiem cua ban ve san pham nay..."
                    value={comment} onChange={e => setComment(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Dang gui...' : 'Gui danh gia'}
            </button>
        </form>
    );
};

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('intro');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const careLevelLabels = {
        EASY: 'De cham soc',
        MEDIUM: 'Trung binh',
        HARD: 'Kho'
    };

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/500x650?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, reviewsRes, relatedRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/products/${id}`),
                    axios.get(`${API_BASE}/api/reviews/product/${id}`),
                    axios.get(`${API_BASE}/api/products/${id}/related`)
                ]);
                setProduct(productRes.data);
                setReviews(reviewsRes.data?.content || []);
                setRelatedProducts(relatedRes.data || []);
            } catch (err) {
                console.error('Loi:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, quantity);
            alert('Da them vao gio hang!');
        } catch (err) {
            alert(err.message);
        }
    };

    const refreshReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/reviews/product/${id}`);
            setReviews(res.data?.content || []);
        } catch (err) {
            console.error('Loi tai review:', err);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Dang tai san pham...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
                <h4>Khong tim thay san pham</h4>
                <Link to="/categories" className="btn btn-primary mt-3">Quay lai cua hang</Link>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '80px' }}>
            {/* Breadcrumb */}
            <div className="bg-light py-2">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item"><Link to="/">Trang chu</Link></li>
                            <li className="breadcrumb-item"><Link to="/categories">San pham</Link></li>
                            <li className="breadcrumb-item active">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Product Info */}
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-5 text-center">
                        <img
                            src={getCoverImageUrl(product.coverImage)}
                            alt={product.name}
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: '450px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-md-7">
                        <h2 className="fw-bold">{product.name}</h2>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="text-warning">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <i key={i} className={`fas fa-star ${i < Math.round(product.averageRating || 0) ? '' : 'text-muted'}`}></i>
                                ))}
                            </div>
                            <span className="text-muted">({product.reviewCount || 0} danh gia)</span>
                        </div>
                        <h3 className="text-success fw-bold mb-3">{formatPrice(product.price)}</h3>
                        <div className="row mb-3">
                            <div className="col-6 mb-2"><strong>Danh muc:</strong> {product.category?.name || 'N/A'}</div>
                            <div className="col-6 mb-2"><strong>Xuat xu:</strong> {product.origin || 'N/A'}</div>
                            <div className="col-6 mb-2"><strong>Nha cung cap:</strong> {product.supplier || 'N/A'}</div>
                            <div className="col-6 mb-2"><strong>Muc do:</strong> {careLevelLabels[product.careLevel] || 'N/A'}</div>
                        </div>
                        <div className="mb-3">
                            <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                                {product.stockQuantity > 0 ? `Con ${product.stockQuantity} cay` : 'Het hang'}
                            </span>
                        </div>

                        {isAuthenticated && product.stockQuantity > 0 && (
                            <div className="d-flex align-items-center gap-3">
                                <div className="input-group" style={{ width: '130px' }}>
                                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <input type="text" className="form-control text-center" value={quantity} readOnly />
                                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}>+</button>
                                </div>
                                <button className="btn btn-success btn-lg" onClick={handleAddToCart}>
                                    <i className="fas fa-cart-plus me-2"></i>Them vao gio
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-5">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'intro' ? 'active' : ''}`}
                                onClick={() => setActiveTab('intro')}>
                                <i className="fas fa-info-circle me-1"></i>Gioi thieu
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'care' ? 'active' : ''}`}
                                onClick={() => setActiveTab('care')}>
                                <i className="fas fa-seedling me-1"></i>Huong dan cham soc
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}>
                                <i className="fas fa-star me-1"></i>Danh gia ({reviews.length})
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content p-4 border border-top-0 rounded-bottom">
                        {activeTab === 'intro' && (
                            <div>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{product.description || 'Chua co mo ta cho san pham nay.'}</p>
                                <hr />
                                <h6 className="fw-bold mb-3">Thong so chi tiet</h6>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr><td className="fw-bold" style={{width: '30%'}}>SKU</td><td>{product.sku}</td></tr>
                                        <tr><td className="fw-bold">Tuoi cay</td><td>{product.age ? `${product.age} nam` : 'N/A'}</td></tr>
                                        <tr><td className="fw-bold">Chieu cao</td><td>{product.height ? `${product.height} cm` : 'N/A'}</td></tr>
                                        <tr><td className="fw-bold">Loai chau</td><td>{product.potType || 'N/A'}</td></tr>
                                        <tr><td className="fw-bold">Muc do cham soc</td><td>{careLevelLabels[product.careLevel] || 'N/A'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'care' && (
                            <div>
                                {product.careGuide ? (
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{product.careGuide}</div>
                                ) : (
                                    <p className="text-muted">Chua co huong dan cham soc cho san pham nay.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                {reviews.length > 0 ? (
                                    reviews.map((review, idx) => <ReviewItem key={idx} review={review} />)
                                ) : (
                                    <p className="text-muted">Chua co danh gia nao. Hay la nguoi dau tien danh gia!</p>
                                )}
                                {isAuthenticated && (
                                    <ReviewForm productId={product.id} onReviewSubmitted={refreshReviews} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-5">
                        <h4 className="fw-bold mb-4"><i className="fas fa-leaf me-2 text-success"></i>San pham lien quan</h4>
                        <div className="row">
                            {relatedProducts.map(p => (
                                <div key={p.id} className="col-6 col-md-4 col-lg-2 mb-3">
                                    <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }}
                                         onClick={() => navigate(`/product/${p.id}`)}>
                                        <img src={getCoverImageUrl(p.coverImage)} alt={p.name}
                                             className="card-img-top" style={{ height: '160px', objectFit: 'cover' }} />
                                        <div className="card-body p-2">
                                            <h6 className="card-title small mb-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h6>
                                            <span className="text-success fw-bold small">{formatPrice(p.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
