import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { TrendingUp } from 'lucide-react';
import { communityService } from '../../services/communityService';

const TrendingTags = ({ onTagClick }) => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        communityService.getTrendingTags()
            .then(data => setTags(data || []))
            .catch(err => console.error('Error fetching trending tags:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="text-center py-4">
                    <Spinner animation="border" size="sm" style={{ color: '#52B788' }} />
                </Card.Body>
            </Card>
        );
    }

    if (tags.length === 0) {
        return (
            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="text-center py-4 text-muted">
                    <TrendingUp size={24} className="mb-2" />
                    <div>Chưa có tag thịnh hành</div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm rounded-4" style={{ position: 'sticky', top: '90px' }}>
            <Card.Body>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <TrendingUp size={20} color="#E63946" />
                    <h5 className="mb-0 fw-bold">Thịnh hành</h5>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            bg="light"
                            text="dark"
                            className="fs-6 py-2 px-3 border"
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderColor: '#E2EDE7',
                                fontWeight: 500
                            }}
                            onClick={() => onTagClick && onTagClick(tag)}
                            onMouseEnter={e => { e.target.style.backgroundColor = '#E2EDE7'; e.target.style.color = '#2D6A4F'; }}
                            onMouseLeave={e => { e.target.style.backgroundColor = ''; e.target.style.color = ''; }}
                        >
                            #{tag.toLowerCase()}
                        </Badge>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default TrendingTags;
