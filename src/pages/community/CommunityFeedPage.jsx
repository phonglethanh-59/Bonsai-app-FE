import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Nav, Spinner, Button, Container, Card } from 'react-bootstrap';
import { communityService } from '../../services/communityService';
import PostCard from '../../components/community/PostCard';
import { useToast } from '../../components/shared/Toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CommunityFeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState('for-you');

    const { isAuthenticated } = useAuth();
    const { error, info } = useToast();
    const navigate = useNavigate();

    const fetchPosts = useCallback(async (pageNumber = 0, append = false) => {
        try {
            setLoading(true);
            let data;
            if (activeTab === 'following') {
                data = await communityService.getFollowingFeed({ page: pageNumber, size: 10 });
            } else {
                data = await communityService.getFeed({ page: pageNumber, size: 10, sortBy: 'createdAt' });
            }

            const items = data.content || [];
            if (append) {
                setPosts(prev => [...prev, ...items]);
            } else {
                setPosts(items);
            }

            // Spring Boot 3 trả về data.page.number, data.page.totalPages
            // Spring Boot 2 trả về data.number, data.totalPages — hỗ trợ cả 2
            const currentPage = data.page?.number ?? data.number ?? pageNumber;
            const totalPages = data.page?.totalPages ?? data.totalPages ?? 1;
            setHasMore(currentPage < totalPages - 1);
            setPage(currentPage);
        } catch (err) {
            console.error('Lỗi khi tải bài viết:', err);
            error('Không thể tải bài viết. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    }, [activeTab, error]);

    useEffect(() => {
        if (activeTab === 'following' && !isAuthenticated) {
            info('Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi');
            setActiveTab('for-you');
            return;
        }
        setPosts([]);
        setPage(0);
        setHasMore(true);
        fetchPosts(0, false);
    }, [activeTab, isAuthenticated, fetchPosts, info]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchPosts(page + 1, true);
        }
    };

    const handleTabSelect = (key) => {
        if (key === 'following' && !isAuthenticated) {
            info('Vui lòng đăng nhập để xem bài viết từ người bạn theo dõi');
            return;
        }
        setActiveTab(key);
    };

    return (
        <Container className="py-4 mt-5">
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-3" style={{ color: '#2D6A4F' }}>🌿 Cộng Đồng</h2>
                        <Button
                            variant="success"
                            className="rounded-pill px-4"
                            style={{ backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' }}
                            onClick={() => {
                                if (isAuthenticated) navigate('/community/create');
                                else { info('Vui lòng đăng nhập để đăng bài'); navigate('/login'); }
                            }}
                        >
                            + Đăng bài
                        </Button>
                    </div>

                    <Card className="mb-4 shadow-sm border-0 rounded-4">
                        <Card.Header className="bg-white border-0 pt-3 pb-0">
                            <Nav variant="underline" activeKey={activeTab} onSelect={handleTabSelect} className="justify-content-center">
                                <Nav.Item>
                                    <Nav.Link eventKey="for-you" className="fw-medium pb-2">Dành cho bạn</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="following" className="fw-medium pb-2">Đang theo dõi</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3 bg-light rounded-bottom-4">
                                {posts.length > 0 ? (
                                    posts.map(post => <PostCard key={post.id} post={post} />)
                                ) : !loading && (
                                    <div className="text-center py-5 text-muted">
                                        <div className="fs-1 mb-2">🌿</div>
                                        <h5>Chưa có bài viết nào!</h5>
                                        <p>Hãy là người đầu tiên chia sẻ về cây của bạn.</p>
                                        {isAuthenticated && (
                                            <Button
                                                variant="success"
                                                style={{ backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' }}
                                                onClick={() => navigate('/community/create')}
                                            >
                                                Đăng bài ngay
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {loading && (
                                    <div className="text-center my-5">
                                        <Spinner animation="border" style={{ color: '#52B788' }} />
                                    </div>
                                )}

                                {!loading && hasMore && (
                                    <div className="text-center mt-3 mb-2">
                                        <Button variant="outline-success" onClick={handleLoadMore} className="rounded-pill px-4">
                                            Xem thêm
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CommunityFeedPage;
