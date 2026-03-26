import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/config';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const ProfileModal = ({ show, handleClose }) => {
    const { user, login, refreshUser } = useAuth(); // Dùng login để cập nhật lại context
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        gender: 'Chưa xác định'
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState('/images/default-avatar.jpg');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

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
            setPreview(user.userDetail.avatar || null);
        }
    }, [user, show]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        setError('');
        try {
            // Bước 1: Cập nhật avatar nếu có file mới
            let avatarUrl = user.userDetail.avatar;
            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatarFile', avatarFile);
                const avatarRes = await axios.post('${API_BASE}/api/customers/profile/avatar', avatarFormData, {
                    withCredentials: true,
                });
                avatarUrl = avatarRes.data.avatarUrl; // Lấy URL mới
            }

            // Bước 2: Cập nhật thông tin text
            await axios.post('${API_BASE}/api/customers/profile/update', formData, {
                withCredentials: true,
            });

            // Bước 3: Cập nhật lại context với dữ liệu MỚI NHẤT và đóng modal
            const updatedUser = {
                ...user,
                userDetail: {
                    ...user.userDetail,
                    ...formData,
                    avatar: avatarUrl
                }
            };
            refreshUser(updatedUser); // <-- GỌI HÀM REFRESH
            handleClose();
            alert('Cập nhật thông tin thành công!');

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="text-center mb-4">
                    <img src={preview ? (preview.startsWith('blob:') ? preview : `${API_BASE}${preview}`) : '/images/default-avatar.jpg'} alt="Avatar" className="rounded-circle" width="120" height="120" style={{ objectFit: 'cover' }} />
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="d-none" accept="image/*" />
                    <Button variant="outline-primary" size="sm" className="mt-2" onClick={() => fileInputRef.current.click()}>
                        <i className="fas fa-camera"></i> Đổi ảnh
                    </Button>
                </div>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày sinh (dob)</Form.Label>
                                <Form.Control type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                            <option value="Chưa xác định">Chưa xác định</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProfileModal;