// Deployment Configuration
// This file contains environment-specific settings for deployment

// Set runtime environment variables
window.ENV = {
    API_URL: 'https://tedx-task-backends.onrender.com',
    DEFAULT_THEME: 'light',
    AUTO_REFRESH: 'true',
    REFRESH_INTERVAL: '300000', // 5 minutes
    
    // Deployment specific settings
    ENVIRONMENT: 'production',
    DEBUG: 'false',
    
    // API endpoints
    API_BASE_URL: 'https://tedx-task-backends.onrender.com',
    AUTH_ENDPOINT: '/api/auth',
    USERS_ENDPOINT: '/api/users',
    
    // OAuth settings
    GOOGLE_AUTH_URL: 'https://tedx-task-backends.onrender.com/api/auth/google',
    
    // App settings
    APP_NAME: 'TEDx Authentication Portal',
    APP_VERSION: '1.0.0'
};

// Override console.log in production
if (window.ENV.DEBUG === 'false') {
    console.log = function() {};
    console.warn = function() {};
}

console.log('🚀 TEDx Authentication Portal - Environment loaded:', window.ENV.ENVIRONMENT); 