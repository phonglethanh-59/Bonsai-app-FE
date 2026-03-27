import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

import { API_BASE, formatPrice } from '../../utils/config';

const ReviewItem = ({ review, currentUserId, onDelete, onEdit }) => {
    const isOwner = currentUserId && review.userId === currentUserId;
    const stars = Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-light'}`}></i>
    ));
    return (
        <div className="review-item mb-3">
            <div className="d-flex justify-content-between align-items-center">
                <strong>{review.reviewerName}</strong>
                {isOwner && (
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary py-0 px-1" onClick={() => onEdit(review)} title="Sua">
                            <i className="fas fa-edit" style={{fontSize: '0.7rem'}}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => onDelete(review.id)} title="Xoa">
                            <i className="fas fa-trash" style={{fontSize: '0.7rem'}}></i>
                        </button>
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-between">
                <div className="review-stars">{stars}</div>
                <small className="text-muted">{review.reviewDate}</small>
            </div>
            <p className="mb-0 fst-italic">"{review.comment}"</p>
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
            setError(err.response?.data?.message || 'Khong the gui danh gia.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 p-3 border rounded bg-light">
            <h6 className="mb-2">{editingReview ? 'Sua danh gia' : 'Viet danh gia'}</h6>
            {error && <div className="alert alert-danger py-1 small">{error}</div>}
            <div className="mb-2">
                <label className="form-label small fw-bold">Sao</label>
                <div>
                    {[1, 2, 3, 4, 5].map(star => (
                        <i key={star}
                           className={`fas fa-star me-1 ${star <= rating ? 'text-warning' : 'text-muted'}`}
                           style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                           onClick={() => setRating(star)} />
                    ))}
                </div>
            </div>
            <div className="mb-2">
                <textarea className="form-control form-control-sm" rows="2"
                    placeholder="Nhan xet cua ban..."
                    value={comment} onChange={e => setComment(e.target.value)} required />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-sm btn-primary" disabled={submitting}>
                    {submitting ? 'Dang gui...' : (editingReview ? 'Cap nhat' : 'Gui danh gia')}
                </button>
                {editingReview && (
                    <button type="button" className="btn btn-sm btn-secondary" onClick={onCancelEdit}>Huy</button>
                )}
            </div>
        </form>
    );
};

const ProductDetailModal = ({ show, handleClose, productId }) => {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();

    const fetchDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const [productRes, reviewsRes] = await Promise.all([
                axios.get(`${API_BASE}/api/products/${productId}`),
                axios.get(`${API_BASE}/api/reviews/product/${productId}`)
            ]);
            setProduct(productRes.data);
            setReviews(reviewsRes.data?.content || []);
        } catch (err) {
            setError('Khong the tai thong tin chi tiet san pham.');
            console.error("Loi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && productId) {
            fetchDetails();
        }
    }, [show, productId]);

    const handleReviewSubmitted = async () => {
        try {
            const reviewsRes = await axios.get(`${API_BASE}/api/reviews/product/${productId}`);
            setReviews(reviewsRes.data?.content || []);
        } catch (err) {
            console.error("Loi khi tai lai review:", err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Ban co chac muon xoa danh gia nay?')) return;
        try {
            await axios.delete(`${API_BASE}/api/reviews/${reviewId}`, { withCredentials: true });
            handleReviewSubmitted();
        } catch (err) {
            alert(err.response?.data?.message || 'Khong the xoa danh gia.');
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
    };

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/500x650?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    const careLevelLabels = {
        EASY: 'De cham soc',
        MEDIUM: 'Trung binh',
        HARD: 'Kho'
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, 1);
            alert('Da them vao gio hang!');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{product?.name || 'Dang tai...'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && product && (
                    <Row>
                        <Col md={4} className="text-center">
                            <img src={getCoverImageUrl(product.coverImage)} alt={product.name} className="img-fluid rounded shadow-sm mb-3" />
                        </Col>
                        <Col md={8}>
                            <h4 className="text-success fw-bold">{formatPrice(product.price)}</h4>
                            <hr />
                            <p style={{ whiteSpace: 'pre-wrap' }}>{product.description || 'Khong co mo ta.'}</p>
                            <hr />
                            <Row>
                                <Col xs={6} className="mb-2"><strong>Danh muc:</strong> {product.category?.name || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Xuat xu:</strong> {product.origin || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Tuoi cay:</strong> {product.age ? `${product.age} nam` : 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Chieu cao:</strong> {product.height ? `${product.height} cm` : 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Loai chau:</strong> {product.potType || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Muc do cham soc:</strong> {careLevelLabels[product.careLevel] || product.careLevel || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Ton kho:</strong> <span className={`fw-bold ${product.stockQuantity > 0 ? 'text-success' : 'text-danger'}`}>{product.stockQuantity > 0 ? `Con ${product.stockQuantity} cay` : 'Het hang'}</span></Col>
                                <Col xs={6} className="mb-2"><strong>Nha cung cap:</strong> {product.supplier || 'N/A'}</Col>
                            </Row>
                            <hr />
                            <div className="reviews-section mt-3">
                                <h5><i className="fas fa-comments me-2"></i>Danh gia tu khach hang</h5>
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
                                    <p className="text-muted small">Chua co danh gia nao cho san pham nay.</p>
                                )}
                                {isAuthenticated && (
                                    <ReviewForm
                                        productId={productId}
                                        onReviewSubmitted={handleReviewSubmitted}
                                        editingReview={editingReview}
                                        onCancelEdit={() => setEditingReview(null)}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                {isAuthenticated && product?.stockQuantity > 0 && (
                    <Button variant="success" onClick={handleAddToCart}>
                        <i className="fas fa-cart-plus me-2"></i>Them vao gio
                    </Button>
                )}
                <Button variant="secondary" onClick={handleClose}>Dong</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailModal;
