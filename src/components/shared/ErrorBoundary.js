import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-5">
                    <h2>Oops! Co loi xay ra.</h2>
                    <p className="text-muted">Vui long tai lai trang hoac quay lai sau.</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Tai lai trang
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
