import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Carousel, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { communityService } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/shared/Toast';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { error, info } = useToast();
    const toastShownRef = useRef(false);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        toastShownRef.current = false;
        const fetchPostAndComments = async () => {
            try {
                const [postData, commentData] = await Promise.all([
                    communityService.getPost(id),
                    communityService.getComments(id)
                ]);
                setPost(postData);
                setComments(commentData.content || []);
            } catch (err) {
                console.error(err);
                if (!toastShownRef.current) {
                    toastShownRef.current = true;
                    error('Không tìm thấy bài viết');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            info('Vui lòng đăng nhập để bình luận');
            return;
        }
        if (!commentText.trim()) return;

        setSubmittingComment(true);
        try {
            const newCmt = await communityService.addComment(id, { content: commentText, parentCommentId: null });
            newCmt.replies = newCmt.replies || [];
            setComments(prev => [...prev, newCmt]);
            setCommentText('');
            setPost(prev => ({ ...prev, commentCount: prev.commentCount + 1 }));
        } catch (err) {
            console.error(err);
            error('Không thể gửi bình luận, vui lòng thử lại');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5 mt-5">
                <Spinner animation="border" style={{ color: '#52B788' }} />
            </div>
        );
    }

    if (!post) {
        return (
            <Container className="py-5 mt-5 text-center">
                <div className="fs-1">😕</div>
                <h4>Bài viết không tồn tại hoặc đã bị xoá</h4>
                <Button variant="success" style={{ backgroundColor: '#2D6A4F' }} onClick={() => navigate('/community')}>
                    Quay lại cộng đồng
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4 mt-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    {/* Back button */}
                    <Button
                        variant="link"
                        className="text-muted mb-3 ps-0 text-decoration-none d-flex align-items-center gap-1"
                        onClick={() => navigate('/community')}
                    >
                        <ArrowLeft size={18} /> Quay lại cộng đồng
                    </Button>

                    {/* Main Post Card */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-white border-0 p-4 pb-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Image
                                    src={post.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.fullName || 'User')}&background=52B788&color=fff`}
                                    roundedCircle
                                    width={45}
                                    height={45}
                                    className="me-3 object-fit-cover"
                                    style={{ minWidth: 45 }}
                                />
                                <div>
                                    <div className="fw-bold">{post.author?.fullName || post.author?.username}</div>
                                    <small className="text-muted">
                                        @{post.author?.username} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </small>
                                </div>
                            </div>
                        </Card.Header>

                        <Card.Body className="p-4 pt-2">
                            <h3 className="fw-bold mb-3">{post.title}</h3>
                            <p className="mb-4" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#444' }}>
                                {post.content}
                            </p>

                            {/* Images */}
                            {post.images && post.images.length > 0 && (
                                <div className="mb-4 rounded-4 overflow-hidden">
                                    {post.images.length === 1 ? (
                                        <Image
                                            src={post.images[0].imageUrl}
                                            fluid
                                            className="w-100 object-fit-contain bg-light"
                                            style={{ maxHeight: '500px' }}
                                        />
                                    ) : (
                                        <Carousel fade interval={null} className="bg-dark">
                                            {post.images.map(img => (
                                                <Carousel.Item key={img.id}>
                                                    <Image
                                                        src={img.imageUrl}
                                                        className="d-block w-100 object-fit-contain"
                                                        style={{ maxHeight: '500px' }}
                                                        alt="post"
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {post.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            bg="light"
                                            text="success"
                                            className="px-3 py-2 rounded-pill fs-6 border"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/community?tag=${tag}`)}
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="text-muted small">
                                ❤️ {post.likeCount} lượt thích &nbsp;•&nbsp; 💬 {post.commentCount} bình luận
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Comments Section */}
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Header className="bg-white border-bottom p-4">
                            <h5 className="mb-0 fw-bold">💬 Bình luận ({post.commentCount})</h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {/* Comment Input */}
                            <Form onSubmit={handleComment} className="d-flex gap-2 mb-4">
                                <Image
                                    src={`https://ui-avatars.com/api/?name=You&background=52B788&color=fff`}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    style={{ minWidth: 40 }}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder={isAuthenticated ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    className="rounded-pill bg-light border-0 px-3"
                                    disabled={!isAuthenticated || submittingComment}
                                />
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: '#2D6A4F', borderColor: '#2D6A4F', width: 42, height: 42, minWidth: 42 }}
                                    disabled={!isAuthenticated || submittingComment || !commentText.trim()}
                                >
                                    {submittingComment ? <Spinner size="sm" /> : <Send size={18} />}
                                </Button>
                            </Form>

                            {/* Comment List */}
                            {comments.length === 0 ? (
                                <p className="text-muted text-center py-3">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {comments.map(c => (
                                        <div key={c.id} className="d-flex gap-3">
                                            <Image
                                                src={c.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author?.fullName || 'User')}&background=52B788&color=fff`}
                                                roundedCircle
                                                width={40}
                                                height={40}
                                                style={{ minWidth: 40 }}
                                            />
                                            <div className="flex-grow-1 bg-light rounded-4 p-3">
                                                <div className="fw-bold mb-1">
                                                    {c.author?.fullName || c.author?.username}
                                                    <small className="fw-normal text-muted ms-2">
                                                        {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                                    </small>
                                                </div>
                                                <p className="mb-0">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PostDetailPage;
