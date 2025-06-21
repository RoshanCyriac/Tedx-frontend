// Environment Configuration Loader
// This file loads environment variables for the frontend application

class EnvironmentConfig {
    constructor() {
        this.env = {};
        this.loadEnvironment();
    }

    loadEnvironment() {
        // Try to load from various sources
        
        // 1. Check for build-time environment variables (Vite, Create React App, etc.)
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            this.env = { ...import.meta.env };
        } else if (typeof process !== 'undefined' && process.env) {
            this.env = { ...process.env };
        }

        // 2. Check for runtime environment variables
        if (window.ENV) {
            this.env = { ...this.env, ...window.ENV };
        }

        // 3. Set defaults if not found
        this.setDefaults();
    }

    setDefaults() {
        const defaults = {
            API_URL: 'https://tedx-task-backends.onrender.com',
            VITE_API_URL: 'https://tedx-task-backends.onrender.com',
            REACT_APP_API_URL: 'https://tedx-task-backends.onrender.com',
            DEFAULT_THEME: 'light',
            AUTO_REFRESH: 'true',
            REFRESH_INTERVAL: '300000'
        };

        for (const [key, value] of Object.entries(defaults)) {
            if (!this.env[key]) {
                this.env[key] = value;
            }
        }
    }

    get(key) {
        return this.env[key] || this.env[`VITE_${key}`] || this.env[`REACT_APP_${key}`];
    }

    getApiUrl() {
        return this.get('API_URL') || this.get('VITE_API_URL') || this.get('REACT_APP_API_URL') || 'https://tedx-task-backends.onrender.com';
    }

    getTheme() {
        return this.get('DEFAULT_THEME') || 'light';
    }

    getAutoRefresh() {
        return this.get('AUTO_REFRESH') === 'true';
    }

    getRefreshInterval() {
        return parseInt(this.get('REFRESH_INTERVAL')) || 300000;
    }
}

// Initialize environment config
window.envConfig = new EnvironmentConfig();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentConfig;
} 