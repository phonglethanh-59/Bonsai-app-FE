import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { API_BASE } from '../../utils/config';

const BorrowedBooksModal = ({ show, handleClose }) => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            const fetchBorrowedBooks = async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await axios.get('${API_BASE}/api/readers/borrowed-books', {
                        withCredentials: true,
                    });
                    setBorrowedBooks(response.data);
                } catch (err) {
                    setError('Không thể tải danh sách sách đang mượn.');
                } finally {
                    setLoading(false);
                }
            };
            fetchBorrowedBooks();
        }
    }, [show]);
    
    const getCoverImageUrl = (path) => {
        if (!path) return 'https://source.unsplash.com/80x120/?book,cover';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title><i className="fas fa-book-reader me-2"></i>Sách đang mượn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <div className="text-center"><Spinner animation="border" /></div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                    borrowedBooks.length > 0 ? (
                        borrowedBooks.map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-3 border-bottom pb-3">
                                <img src={getCoverImageUrl(item.bookCoverImage)} alt={item.bookTitle} style={{ width: '80px', height: '120px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px' }} />
                                <div>
                                    <h6 className="mb-1">{item.bookTitle}</h6>
                                    <p className="text-muted mb-1">Tác giả: {item.bookAuthor}</p>
                                    <small className="d-block">Ngày mượn: {new Date(item.borrowDate).toLocaleDateString('vi-VN')}</small>
                                    <small className="d-block fw-bold text-danger">Ngày hẹn trả: {new Date(item.dueDate).toLocaleDateString('vi-VN')}</small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">Bạn chưa mượn cuốn sách nào.</p>
                    )
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BorrowedBooksModal;