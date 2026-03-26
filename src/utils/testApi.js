import { API_BASE } from './config';

// Test API connection
const testApiConnection = async () => {
    console.log('Testing API connection...');
    
    try {
        // Test basic connectivity
        const response = await fetch('${API_BASE}/admin/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API connection successful! Data:', data);
            return true;
        } else {
            const errorText = await response.text();
            console.error('API error:', errorText);
            return false;
        }
    } catch (error) {
        console.error('Connection failed:', error);
        return false;
    }
};

// Test CORS
const testCors = async () => {
    console.log('Testing CORS...');
    
    try {
        const response = await fetch('${API_BASE}/admin/stats', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type',
            },
        });
        
        console.log('CORS preflight status:', response.status);
        console.log('CORS headers:', response.headers);
        
        return response.ok;
    } catch (error) {
        console.error('CORS test failed:', error);
        return false;
    }
};

export { testApiConnection, testCors };
