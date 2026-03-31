import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, formatPrice } from '../../utils/config';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../components/shared/Toast';

const ReviewItem = ({ review, currentUserId, onDelete, onEdit }) => {
    const isOwner = currentUserId && review.userId === currentUserId;
    const stars = Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-light'}`}></i>
    ));
    return (
        <div className="review-item mb-3 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center">
                <strong>{review.reviewerName}</strong>
                <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">{review.reviewDate}</small>
                    {isOwner && (
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary py-0 px-1" onClick={() => onEdit(review)} title="Sửa">
                                <i className="fas fa-edit" style={{fontSize: '0.75rem'}}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => onDelete(review.id)} title="Xóa">
                                <i className="fas fa-trash" style={{fontSize: '0.75rem'}}></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="review-stars my-1">{stars}</div>
            <p className="mb-0 fst-italic text-muted">"{review.comment}"</p>
        </div>
    );
};

const ReviewForm = ({ productId, onReviewSubmitted, editingReview, onCancelEdit }) => {
    const [rating, setRating] = useState(editingReview ? editingReview.rating : 5);
    const [comment, setComment] = useState(editingReview ? editingReview.comment : '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (editingReview) {
            setRating(editingReview.rating);
            setComment(editingReview.comment);
        } else {
            setRating(5);
            setComment('');
        }
    }, [editingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            if (editingReview) {
                await axios.put(`${API_BASE}/api/reviews/${editingReview.id}`,
                    { rating, comment },
                    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
                );
            } else {
                await axios.post(`${API_BASE}/api/reviews`,
                    { productId, rating, comment },
                    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
                );
            }
            setComment('');
            setRating(5);
            if (onCancelEdit) onCancelEdit();
            onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể gửi đánh giá.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-3 border rounded bg-light">
            <h6 className="mb-3">{editingReview ? 'Sửa đánh giá' : 'Viết đánh giá của bạn'}</h6>
            {error && <div className="alert alert-danger py-1 small">{error}</div>}
            <div className="mb-3">
                <label className="form-label small fw-bold">Đánh giá sao</label>
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
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    value={comment} onChange={e => setComment(e.target.value)} required />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : (editingReview ? 'Cập nhật' : 'Gửi đánh giá')}
                </button>
                {editingReview && (
                    <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                        Hủy
                    </button>
                )}
            </div>
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
    const [editingReview, setEditingReview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const toast = useToast();

    const handleToggleWishlist = async () => {
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

    const careLevelLabels = {
        EASY: 'Dễ chăm sóc',
        MEDIUM: 'Trung bình',
        HARD: 'Khó'
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
                console.error('Lỗi:', err);
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
            toast.success('Đã thêm vào giỏ hàng!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const refreshReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/reviews/product/${id}`);
            setReviews(res.data?.content || []);
        } catch (err) {
            console.error('Lỗi tải review:', err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const yes = await toast.confirm('Bạn có chắc muốn xóa đánh giá này?');
        if (!yes) return;
        try {
            await axios.delete(`${API_BASE}/api/reviews/${reviewId}`, { withCredentials: true });
            refreshReviews();
            toast.success('Đã xóa đánh giá.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Không thể xóa đánh giá.');
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
    };

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
                <h4>Không tìm thấy sản phẩm</h4>
                <Link to="/categories" className="btn btn-primary mt-3">Quay lại cửa hàng</Link>
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
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/categories">Sản phẩm</Link></li>
                            <li className="breadcrumb-item active">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Product Info */}
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-5">
                        {/* Main Image */}
                        <div style={{ borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '0.75rem' }}>
                            <img
                                src={getCoverImageUrl(selectedImage || product.coverImage)}
                                alt={product.name}
                                className="img-fluid"
                                style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                        {/* Thumbnail Gallery */}
                        {(() => {
                            // Gộp coverImage + images thành 1 danh sách không trùng lặp
                            const allImages = [];
                            if (product.coverImage) allImages.push(product.coverImage);
                            if (product.images) {
                                product.images.forEach(url => {
                                    if (!allImages.includes(url)) allImages.push(url);
                                });
                            }
                            if (allImages.length <= 1) return null;

                            const current = selectedImage || product.coverImage;
                            return (
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                                    {allImages.map((imgUrl, idx) => (
                                        <img
                                            key={idx}
                                            src={getCoverImageUrl(imgUrl)}
                                            alt={`${product.name} ${idx + 1}`}
                                            onClick={() => setSelectedImage(imgUrl)}
                                            style={{
                                                width: 64, height: 64, objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer',
                                                border: current === imgUrl ? '2px solid #10b981' : '2px solid #e5e7eb',
                                                opacity: current === imgUrl ? 1 : 0.7,
                                                transition: 'all 0.15s', flexShrink: 0
                                            }}
                                        />
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                    <div className="col-md-7">
                        <h2 className="fw-bold">{product.name}</h2>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="text-warning">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <i key={i} className={`fas fa-star ${i < Math.round(product.averageRating || 0) ? '' : 'text-muted'}`}></i>
                                ))}
                            </div>
                            <span className="text-muted">({product.reviewCount || 0} đánh giá)</span>
                        </div>
                        <h3 className="text-success fw-bold mb-3">{formatPrice(product.price)}</h3>
                        <div className="row mb-3">
                            <div className="col-6 mb-2"><strong>Danh mục:</strong> {product.category?.name || 'N/A'}</div>
                            <div className="col-6 mb-2"><strong>Xuất xứ:</strong> {product.origin || 'N/A'}</div>
                            <div className="col-6 mb-2"><strong>Nhà cung cấp:</strong> {product.supplier || 'N/A'}</div>
                            <div className="col-6 mb-2"><strong>Mức độ:</strong> {careLevelLabels[product.careLevel] || 'N/A'}</div>
                        </div>
                        <div className="mb-3">
                            <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                                {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} cây` : 'Hết hàng'}
                            </span>
                        </div>

                        {isAuthenticated && (
                            <div className="d-flex align-items-center gap-3">
                                {product.stockQuantity > 0 && (
                                    <>
                                        <div className="input-group" style={{ width: '130px' }}>
                                            <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                            <input type="text" className="form-control text-center" value={quantity} readOnly />
                                            <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}>+</button>
                                        </div>
                                        <button className="btn btn-success btn-lg" onClick={handleAddToCart}>
                                            <i className="fas fa-cart-plus me-2"></i>Thêm vào giỏ
                                        </button>
                                    </>
                                )}
                                <button
                                    className={`btn btn-lg ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                                    onClick={handleToggleWishlist}
                                    title={isInWishlist(product.id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                >
                                    <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
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
                                <i className="fas fa-info-circle me-1"></i>Giới thiệu
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'care' ? 'active' : ''}`}
                                onClick={() => setActiveTab('care')}>
                                <i className="fas fa-seedling me-1"></i>Hướng dẫn chăm sóc
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}>
                                <i className="fas fa-star me-1"></i>Đánh giá ({reviews.length})
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content p-4 border border-top-0 rounded-bottom">
                        {activeTab === 'intro' && (
                            <div>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                                <hr />
                                <h6 className="fw-bold mb-3">Thông số chi tiết</h6>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr><td className="fw-bold" style={{width: '30%'}}>SKU</td><td>{product.sku}</td></tr>
                                        <tr><td className="fw-bold">Tuổi cây</td><td>{product.age ? `${product.age} năm` : 'N/A'}</td></tr>
                                        <tr><td className="fw-bold">Chiều cao</td><td>{product.height ? `${product.height} cm` : 'N/A'}</td></tr>
                                        <tr><td className="fw-bold">Loại chậu</td><td>{product.potType || 'N/A'}</td></tr>
                                        <tr><td className="fw-bold">Mức độ chăm sóc</td><td>{careLevelLabels[product.careLevel] || 'N/A'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'care' && (
                            <div>
                                {product.careGuide ? (
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{product.careGuide}</div>
                                ) : (
                                    <p className="text-muted">Chưa có hướng dẫn chăm sóc cho sản phẩm này.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                {reviews.length > 0 ? (
                                    reviews.map((review, idx) => (
                                        <ReviewItem
                                            key={review.id || idx}
                                            review={review}
                                            currentUserId={user?.userId}
                                            onDelete={handleDeleteReview}
                                            onEdit={handleEditReview}
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                                )}
                                {isAuthenticated && (
                                    <ReviewForm
                                        productId={product.id}
                                        onReviewSubmitted={refreshReviews}
                                        editingReview={editingReview}
                                        onCancelEdit={() => setEditingReview(null)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-5">
                        <h4 className="fw-bold mb-4"><i className="fas fa-leaf me-2 text-success"></i>Sản phẩm liên quan</h4>
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
