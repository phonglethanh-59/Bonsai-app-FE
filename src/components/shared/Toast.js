import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmState, setConfirmState] = useState(null);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, duration }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration || 4000), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration || 3500), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    const confirm = useCallback((message, title = 'Xác nhận') => {
        return new Promise((resolve) => {
            setConfirmState({ message, title, resolve });
        });
    }, []);

    const handleConfirmYes = () => {
        if (confirmState) {
            confirmState.resolve(true);
            setConfirmState(null);
        }
    };

    const handleConfirmNo = () => {
        if (confirmState) {
            confirmState.resolve(false);
            setConfirmState(null);
        }
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="toast-container-custom">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>

            {/* Confirm Modal */}
            {confirmState && (
                <div className="confirm-overlay" onClick={handleConfirmNo}>
                    <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3 className="confirm-title">{confirmState.title}</h3>
                        <p className="confirm-message">{confirmState.message}</p>
                        <div className="confirm-buttons">
                            <button className="confirm-btn confirm-btn-cancel" onClick={handleConfirmNo}>Hủy</button>
                            <button className="confirm-btn confirm-btn-ok" onClick={handleConfirmYes}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (toast.duration > 0) {
            const timer = setTimeout(() => setIsExiting(true), toast.duration - 300);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const icons = {
        success: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
        warning: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        info: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    };

    return (
        <div className={`toast-item toast-${toast.type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
            <div className="toast-icon">{icons[toast.type]}</div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => { setIsExiting(true); setTimeout(onClose, 300); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
};

export default ToastProvider;
