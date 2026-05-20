import React, { useState } from 'react';
import { Card, Image, Dropdown } from 'react-bootstrap';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { communityService } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../shared/Toast';
import { API_BASE } from '../../utils/config';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};


const PostCard = ({ post: initialPost }) => {
    const [post, setPost] = useState(initialPost);
    const { isAuthenticated } = useAuth();
    const { info, success } = useToast();
    const navigate = useNavigate();

    const handleLike = async () => {
        if (!isAuthenticated) return info('Vui lòng đăng nhập để thích bài viết');
        try {
            if (post.liked) {
                const res = await communityService.unlikePost(post.id);
                setPost({ ...post, liked: false, likeCount: res.likeCount });
            } else {
                const res = await communityService.likePost(post.id);
                setPost({ ...post, liked: true, likeCount: res.likeCount });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) return info('Vui lòng đăng nhập để lưu bài viết');
        try {
            if (post.saved) {
                await communityService.unsavePost(post.id);
                setPost({ ...post, saved: false, saveCount: post.saveCount - 1 });
            } else {
                await communityService.savePost(post.id);
                setPost({ ...post, saved: true, saveCount: post.saveCount + 1 });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card className="mb-3 border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-3 p-md-4">
                {/* Header: User Info */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to={`/community/users/${post.author.userId}`} className="text-decoration-none text-dark d-flex align-items-center">
                        <Image
                            src={getImageUrl(post.author.avatarUrl) || 'https://ui-avatars.com/api/?name=' + post.author.fullName}
                            roundedCircle
                            width={40}
                            height={40}
                            className="me-2 object-fit-cover"
                        />
                        <div>
                            <div className="fw-bold fs-6 lh-1">{post.author.fullName || post.author.username}</div>
                            <small className="text-muted" style={{ fontSize: '12px' }}>
                                @{post.author.username} • {formatDate(post.createdAt)}
                            </small>
                        </div>
                    </Link>
                    <Dropdown align="end">
                        <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} className="text-muted p-1">
                            <MoreHorizontal size={20} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate(`/community/posts/${post.id}`)}>Xem chi tiết</Dropdown.Item>
                            <Dropdown.Item href="#">Báo cáo bài viết</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* Content */}
                <div className="cursor-pointer" onClick={() => navigate(`/community/posts/${post.id}`)}>
                    <h5 className="fw-bold mb-2">{post.title}</h5>
                    <p className="mb-3 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.content}
                    </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <Link key={tag} to={`/community/explore?tag=${tag}`} className="text-decoration-none">
                                <span className="badge rounded-pill text-success" style={{ backgroundColor: '#E2EDE7' }}>
                                    #{tag}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Images (Show first image only for brevity in feed) */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-3 rounded-3 overflow-hidden bg-light text-center cursor-pointer"
                        style={{ maxHeight: '400px' }}
                        onClick={() => navigate(`/community/posts/${post.id}`)}>
                        <Image src={getImageUrl(post.images[0].imageUrl)} fluid className="object-fit-cover w-100" style={{ maxHeight: '400px' }} />
                        {post.images.length > 1 && (
                            <div className="mt-2 text-muted fw-medium">+ {post.images.length - 1} ảnh nữa</div>
                        )}
                    </div>
                )}

                <hr className="my-3 opacity-10" />

                {/* Actions */}
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-4">
                        <div className="d-flex align-items-center gap-1 cursor-pointer transition text-muted hover-success"
                            onClick={handleLike}
                            style={{ color: post.liked ? '#E63946' : 'inherit' }}
                        >
                            <Heart size={20} fill={post.liked ? '#E63946' : 'none'} color={post.liked ? '#E63946' : 'currentColor'} />
                            <span className="fs-6 fw-medium">{post.likeCount}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 cursor-pointer text-muted hover-success"
                            onClick={() => navigate(`/community/posts/${post.id}`)}>
                            <MessageCircle size={20} />
                            <span className="fs-6 fw-medium">{post.commentCount}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 cursor-pointer text-muted hover-success"
                            onClick={() => { navigator.clipboard.writeText(window.location.origin + `/community/posts/${post.id}`); success('Đã copy link!'); }}>
                            <Share2 size={20} />
                        </div>
                    </div>
                    <div className="cursor-pointer text-muted hover-save"
                        onClick={handleSave}
                        style={{ color: post.saved ? '#F4A261' : 'inherit' }}>
                        <Bookmark size={20} fill={post.saved ? '#F4A261' : 'none'} color={post.saved ? '#F4A261' : 'currentColor'} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PostCard;
