import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/config';
import axios from 'axios';
import './AIChat.css';

const AIChat = () => {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [location, setLocation] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'ai',
                content: `Xin chào${user?.userDetail?.fullName ? ' ' + user.userDetail.fullName : ''}! 🌿\n\nTôi là trợ lý AI chuyên về cây cảnh và bonsai. Tôi có thể giúp bạn:\n\n🌱 **Tư vấn chăm sóc cây** - tưới nước, bón phân, cắt tỉa\n🔍 **Chẩn đoán bệnh cây** - gửi ảnh để tôi phân tích\n🌤️ **Tư vấn theo vùng miền** - cây phù hợp với khí hậu khu vực bạn\n\nHãy hỏi tôi bất cứ điều gì!`
            }]);
        }
    }, [isOpen, messages.length, user]);

    if (!isAuthenticated) return null;

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput && !imageFile) return;
        if (loading) return;

        const userMessage = {
            role: 'user',
            content: trimmedInput || (imageFile ? 'Hãy phân tích ảnh cây này giúp tôi' : ''),
            image: imagePreview
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            let response;

            if (imageFile) {
                const formData = new FormData();
                formData.append('message', trimmedInput || 'Hãy phân tích tình trạng cây trong ảnh này, đánh giá sức khỏe và đưa ra lời khuyên chăm sóc.');
                formData.append('image', imageFile);
                if (location) formData.append('location', location);

                response = await axios.post(`${API_BASE}/api/chat/image`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axios.post(`${API_BASE}/api/chat`, {
                    message: trimmedInput,
                    location: location || null
                }, { withCredentials: true });
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.data.reply
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau. 😔'
            }]);
        } finally {
            setLoading(false);
            setImagePreview(null);
            setImageFile(null);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh không được vượt quá 5MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        { text: '🌱 Cách chăm sóc bonsai?', message: 'Hướng dẫn cách chăm sóc bonsai cơ bản cho người mới bắt đầu' },
        { text: '💧 Lịch tưới nước?', message: 'Lịch tưới nước phù hợp cho các loại cây cảnh phổ biến' },
        { text: '🐛 Cây bị sâu bệnh?', message: 'Các loại sâu bệnh thường gặp ở cây cảnh và cách phòng trị' },
        { text: '📍 Tư vấn theo vùng', message: null }
    ];

    const handleQuickQuestion = (q) => {
        if (q.message === null) {
            setShowLocationInput(true);
            return;
        }
        setInput(q.message);
    };

    const handleLocationSubmit = () => {
        if (!location.trim()) return;
        setShowLocationInput(false);
        setInput(`Tư vấn các loại cây cảnh phù hợp trồng ở khu vực ${location}, điều kiện khí hậu và thời tiết ở đây ảnh hưởng thế nào đến việc trồng cây?`);
    };

    const formatMessage = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className={`ai-chat-fab ${isOpen ? 'ai-chat-fab--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Chat với AI tư vấn cây cảnh"
            >
                {isOpen ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <span className="ai-chat-fab__icon">🌿</span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chat-window">
                    {/* Header */}
                    <div className="ai-chat-header">
                        <div className="ai-chat-header__info">
                            <span className="ai-chat-header__avatar">🌿</span>
                            <div>
                                <h6 className="ai-chat-header__title">AI Tư Vấn Cây Cảnh</h6>
                                <span className="ai-chat-header__status">
                                    <span className="ai-chat-header__dot"></span> Online
                                </span>
                            </div>
                        </div>
                        <button className="ai-chat-header__close" onClick={() => setIsOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="ai-chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`ai-chat-bubble ai-chat-bubble--${msg.role}`}>
                                {msg.role === 'ai' && <span className="ai-chat-bubble__avatar">🌿</span>}
                                <div className="ai-chat-bubble__content">
                                    {msg.image && (
                                        <img src={msg.image} alt="Ảnh đã gửi" className="ai-chat-bubble__image" />
                                    )}
                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="ai-chat-bubble ai-chat-bubble--ai">
                                <span className="ai-chat-bubble__avatar">🌿</span>
                                <div className="ai-chat-bubble__content ai-chat-typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 1 && (
                        <div className="ai-chat-quick">
                            {quickQuestions.map((q, i) => (
                                <button key={i} className="ai-chat-quick__btn" onClick={() => handleQuickQuestion(q)}>
                                    {q.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Location Input */}
                    {showLocationInput && (
                        <div className="ai-chat-location">
                            <input
                                type="text"
                                placeholder="Nhập tên thành phố/khu vực..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLocationSubmit()}
                                className="ai-chat-location__input"
                                autoFocus
                            />
                            <button className="ai-chat-location__btn" onClick={handleLocationSubmit}>
                                <i className="fas fa-check"></i>
                            </button>
                            <button className="ai-chat-location__btn ai-chat-location__btn--cancel" onClick={() => setShowLocationInput(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="ai-chat-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button onClick={() => { setImagePreview(null); setImageFile(null); }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="ai-chat-input">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageSelect}
                            hidden
                        />
                        <button
                            className="ai-chat-input__action"
                            onClick={() => fileInputRef.current?.click()}
                            title="Gửi ảnh cây"
                        >
                            <i className="fas fa-camera"></i>
                        </button>
                        <button
                            className={`ai-chat-input__action ${location ? 'ai-chat-input__action--active' : ''}`}
                            onClick={() => setShowLocationInput(!showLocationInput)}
                            title="Chọn vị trí"
                        >
                            <i className="fas fa-map-marker-alt"></i>
                        </button>
                        <textarea
                            className="ai-chat-input__text"
                            placeholder="Hỏi về cây cảnh..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            className="ai-chat-input__send"
                            onClick={handleSend}
                            disabled={loading || (!input.trim() && !imageFile)}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>

                    {/* Location Badge */}
                    {location && !showLocationInput && (
                        <div className="ai-chat-location-badge">
                            <i className="fas fa-map-marker-alt"></i> {location}
                            <button onClick={() => setLocation('')}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AIChat;
