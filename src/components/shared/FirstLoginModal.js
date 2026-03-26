import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/config';

const FirstLoginModal = () => {
    const { showFirstLogin, setShowFirstLogin, user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        gender: 'Chưa xác định'
    });
    const [error, setError] = useState('');

    // Điền thông tin sẵn có của user vào form khi modal mở
    useEffect(() => {
        if (user?.userDetail) {
            setFormData({
                fullName: user.userDetail.fullName || '',
                email: user.userDetail.email || '',
                phone: user.userDetail.phone || '',
                address: user.userDetail.address || '',
                dob: user.userDetail.dob || '',
                gender: user.userDetail.gender || 'Chưa xác định',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        // Validation cơ bản
        if (!formData.fullName || !formData.email || !formData.phone) {
            setError('Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE}/api/customers/profile/update`, formData, {
                withCredentials: true,
            });
            
            // Cập nhật lại thông tin user trong context
            refreshUser({ ...user, userDetail: { ...user.userDetail, ...formData } });
            setShowFirstLogin(false); // Đóng modal
            alert(response.data.message);

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <Modal show={showFirstLogin} onHide={() => {}} backdrop="static" keyboard={false} centered>
            <Modal.Header>
                <Modal.Title>Chào mừng! Vui lòng cập nhật thông tin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Để có trải nghiệm tốt nhất, bạn hãy dành chút thời gian để hoàn thiện hồ sơ của mình nhé.</p>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ và Tên*</Form.Label>
                        <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại*</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    Lưu và Bắt đầu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FirstLoginModal;