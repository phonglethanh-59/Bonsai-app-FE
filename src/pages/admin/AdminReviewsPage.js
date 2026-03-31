import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiTrash2, FiStar } from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import { useToast } from '../../components/shared/Toast';

const StarDisplay = ({ rating }) => (
    <div style={{ display: 'flex', gap: '1px' }}>
        {Array.from({ length: 5 }, (_, i) => (
            <FiStar key={i} size={14} style={{ fill: i < rating ? '#f59e0b' : 'none', color: i < rating ? '#f59e0b' : '#d1d5db' }} />
        ))}
    </div>
);

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, perPage: 10, totalPages: 0, total: 0 });
    const [ratingFilter, setRatingFilter] = useState('');
    const toast = useToast();

    const loadReviews = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1,
                size: pagination.perPage,
            };
            const res = await adminApi.getReviews(params);
            let content = res.content || [];
            if (ratingFilter) {
                content = content.filter(r => r.rating === parseInt(ratingFilter));
            }
            setReviews(content);
            setPagination(prev => ({ ...prev, totalPages: res.totalPages || 0, total: res.totalElements || 0 }));
        } catch (err) {
            console.error('Error loading reviews:', err);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.currentPage, pagination.perPage, ratingFilter]);

    useEffect(() => { loadReviews(); }, [loadReviews]);

    const handleDelete = async (reviewId) => {
        const yes = await toast.confirm('Bạn có chắc muốn xóa đánh giá này? Hành động này không thể hoàn tác.');
        if (yes) {
            try {
                await adminApi.deleteReview(reviewId);
                toast.success('Xóa đánh giá thành công!');
                loadReviews();
            } catch (err) {
                toast.error(`Lỗi: ${err.message}`);
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                <div className="admin-flex admin-items-center admin-justify-between">
                    <h1 className="admin-text-2xl admin-font-bold admin-text-gray-900">Quản lý đánh giá</h1>
                    <button onClick={loadReviews} className="admin-button admin-button-secondary admin-flex admin-items-center" style={{ gap: '0.375rem' }}>
                        <FiRefreshCw size={16} /> Làm mới
                    </button>
                </div>

                {/* Rating Filter */}
                <div className="admin-flex admin-space-x-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button onClick={() => { setRatingFilter(''); setPagination(prev => ({ ...prev, currentPage: 1 })); }}
                        className="admin-button" style={{ background: !ratingFilter ? '#2563eb' : 'white', color: !ratingFilter ? 'white' : '#374151', border: '1px solid #d1d5db' }}>
                        Tất cả
                    </button>
                    {[5, 4, 3, 2, 1].map(star => (
                        <button key={star} onClick={() => { setRatingFilter(String(star)); setPagination(prev => ({ ...prev, currentPage: 1 })); }}
                            className="admin-button admin-flex admin-items-center"
                            style={{
                                gap: '0.25rem',
                                background: ratingFilter === String(star) ? '#fef3c7' : 'white',
                                color: ratingFilter === String(star) ? '#92400e' : '#374151',
                                border: `1px solid ${ratingFilter === String(star) ? '#f59e0b' : '#d1d5db'}`
                            }}>
                            {star} <FiStar size={12} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="admin-card" style={{ padding: 0 }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sách đánh giá ({pagination.total})</h2>
                    </div>
                    <div className="admin-overflow-x-auto">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">ID</th>
                                    <th className="admin-table-header">Người đánh giá</th>
                                    <th className="admin-table-header">Sao</th>
                                    <th className="admin-table-header" style={{ minWidth: '250px' }}>Nội dung</th>
                                    <th className="admin-table-header">Ngày</th>
                                    <th className="admin-table-header admin-text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="6" className="admin-table-cell admin-text-center"><FiRefreshCw className="w-5 h-5 animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                                ) : reviews.length > 0 ? reviews.map(review => (
                                    <tr key={review.id} className="admin-table-row">
                                        <td className="admin-table-cell admin-font-medium">#{review.id}</td>
                                        <td className="admin-table-cell admin-text-sm">{review.reviewerName}</td>
                                        <td className="admin-table-cell"><StarDisplay rating={review.rating} /></td>
                                        <td className="admin-table-cell admin-text-sm">
                                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={review.comment}>
                                                {review.comment}
                                            </div>
                                        </td>
                                        <td className="admin-table-cell admin-text-sm">{review.reviewDate}</td>
                                        <td className="admin-table-cell admin-text-center">
                                            <button onClick={() => handleDelete(review.id)} className="admin-p-1" style={{ color: '#dc2626' }} title="Xóa đánh giá">
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="admin-table-cell admin-text-center admin-text-gray-500">Không có đánh giá nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="admin-px-6 admin-py-4 admin-border-t admin-border-gray-200 admin-flex admin-items-center admin-justify-between" style={{ padding: '1rem 1.5rem' }}>
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
        </div>
    );
};

export default AdminReviewsPage;
