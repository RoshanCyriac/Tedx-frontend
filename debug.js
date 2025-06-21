// Debug utilities for TEDx Authentication Portal
window.debugTedx = {
    // Show current configuration
    showConfig: function() {
        console.group('🔧 Current Configuration');
        console.log('Window ENV:', window.ENV);
        console.log('Environment Config:', window.envConfig);
        console.log('App Config:', window.appConfig);
        console.log('API URL from config:', window.appConfig?.getApiUrl());
        console.groupEnd();
    },

    // Test API connection
    testApiConnection: async function() {
        console.group('🌐 API Connection Test');
        try {
            const apiUrl = window.appConfig.getApiUrl();
            console.log('Testing API URL:', apiUrl);
            
            // Test basic API endpoint
            const response = await fetch(`${apiUrl}/api`);
            const data = await response.json();
            console.log('✅ API Response:', data);
            
            // Test health endpoint
            const healthResponse = await fetch(`${apiUrl}/health`);
            const healthData = await healthResponse.json();
            console.log('✅ Health Response:', healthData);
            
        } catch (error) {
            console.error('❌ API Connection Error:', error);
        }
        console.groupEnd();
    },

    // Test login endpoint
    testLogin: async function(email = 'test@example.com', password = 'password123') {
        console.group('🔐 Login Test');
        try {
            const apiUrl = window.appConfig.getApiUrl();
            console.log('Testing login with:', { email, password: '***' });
            
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            console.log('Response status:', response.status);
            console.log('Response data:', data);
            
            if (response.ok) {
                console.log('✅ Login successful!');
            } else {
                console.log('❌ Login failed:', data.message);
            }
            
        } catch (error) {
            console.error('❌ Login Error:', error);
        }
        console.groupEnd();
    },

    // Clear all localStorage
    clearStorage: function() {
        localStorage.clear();
        console.log('🗑️ LocalStorage cleared');
    },

    // Reset configuration
    resetConfig: function() {
        if (window.appConfig) {
            window.appConfig.reset();
            console.log('🔄 Configuration reset');
        }
    },

    // Show all debug info
    showAll: function() {
        this.showConfig();
        this.testApiConnection();
    }
};

// Auto-run debug on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐛 Debug utilities loaded. Use window.debugTedx to access debug functions.');
    console.log('Available functions:');
    console.log('- debugTedx.showConfig()');
    console.log('- debugTedx.testApiConnection()');
    console.log('- debugTedx.testLogin()');
    console.log('- debugTedx.clearStorage()');
    console.log('- debugTedx.resetConfig()');
    console.log('- debugTedx.showAll()');
    
    // Show config automatically
    setTimeout(() => {
        window.debugTedx.showConfig();
    }, 1000);
}); 