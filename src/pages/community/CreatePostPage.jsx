import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, CloseButton } from 'react-bootstrap';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { communityService } from '../../services/communityService';
import { useToast } from '../../components/shared/Toast';
import { API_BASE } from '../../utils/config';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsText, setTagsText] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { success, error, warning } = useToast();

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            warning('Chỉ được tải lên tối đa 5 ảnh');
            return;
        }

        try {
            const uploadPromises = files.map(file => communityService.uploadImage(file));
            const results = await Promise.all(uploadPromises);
            const newImageUrls = results.map(res => res.imageUrl);
            setImages([...images, ...newImageUrls]);
        } catch (err) {
            console.error('Lỗi upload:', err);
            error('Có lỗi xảy ra khi tải ảnh lên. Yêu cầu file < 20MB');
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            warning('Vui lòng nhập đủ tiêu đề và nội dung');
            return;
        }

        setIsSubmitting(true);
        try {
            const tags = tagsText.split(/[\s,]+/).filter(t => t.startsWith('#')).map(t => t.substring(1));

            const postData = {
                title,
                content,
                tags,
                imageUrls: images
            };

            const res = await communityService.createPost(postData);
            success('Đăng bài thành công!');
            navigate(`/community/posts/${res.id}`);
        } catch (err) {
            error(err.response?.data?.message || 'Có lỗi khi đăng bài');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-4 mt-5">
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
                            <h3 className="fw-bold" style={{ color: '#2D6A4F' }}>Tạo bài viết mới</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                {/* Upload Hình Ảnh */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium">Hình ảnh ({images.length}/5)</Form.Label>
                                    <div className="d-flex flex-wrap gap-3">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="position-relative" style={{ width: '120px', height: '120px' }}>
                                                <Image src={getImageUrl(img)} rounded className="object-fit-cover w-100 h-100 border" />
                                                <CloseButton
                                                    className="position-absolute bg-white rounded-circle p-1"
                                                    style={{ top: '5px', right: '5px' }}
                                                    onClick={() => removeImage(idx)}
                                                />
                                            </div>
                                        ))}
                                        {images.length < 5 && (
                                            <label className="border border-2 border-dashed rounded d-flex flex-column align-items-center justify-content-center cursor-pointer text-muted"
                                                style={{ width: '120px', height: '120px', backgroundColor: '#F8FAF7', borderColor: '#95D5B2' }}>
                                                <UploadCloud size={28} className="mb-2" />
                                                <small>Tải ảnh lên</small>
                                                <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} disabled={isSubmitting} />
                                            </label>
                                        )}
                                    </div>
                                </Form.Group>

                                {/* Tiêu đề */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">Tiêu đề *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ: Cây monstera của mình sau 3 tháng..."
                                        maxLength={255}
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        disabled={isSubmitting}
                                        className="py-2"
                                    />
                                    <Form.Text muted>{title.length}/255</Form.Text>
                                </Form.Group>

                                {/* Nội dung */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">Nội dung chia sẻ *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={8}
                                        placeholder="Hãy chia sẻ câu chuyện, kinh nghiệm chăm sóc... của bạn nhé!"
                                        maxLength={5000}
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </Form.Group>

                                {/* Hashtags */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium">Hashtags</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ: #monstera #caytrongnha #tips (cách nhau bởi khoảng trắng)"
                                        value={tagsText}
                                        onChange={e => setTagsText(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </Form.Group>

                                {/* Nút Acton */}
                                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                                    <Button variant="outline-secondary" className="px-4" onClick={() => navigate(-1)} disabled={isSubmitting}>
                                        Hủy
                                    </Button>
                                    <Button type="submit" variant="success" className="px-5" style={{ backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' }} disabled={isSubmitting}>
                                        {isSubmitting ? 'Đang xử lý...' : 'Đăng bài'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreatePostPage;
