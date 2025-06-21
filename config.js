// Configuration Management
class Config {
    constructor() {
        this.defaultConfig = {
            apiUrl: window.envConfig ? window.envConfig.getApiUrl() : 'https://tedx-task-backends.onrender.com',
            theme: window.envConfig ? window.envConfig.getTheme() : 'light',
            autoRefresh: window.envConfig ? window.envConfig.getAutoRefresh() : true,
            refreshInterval: window.envConfig ? window.envConfig.getRefreshInterval() : 300000
        };
        
        this.config = this.loadConfig();
        this.applyTheme();
    }

    loadConfig() {
        const savedConfig = localStorage.getItem('tedx-auth-config');
        if (savedConfig) {
            try {
                return { ...this.defaultConfig, ...JSON.parse(savedConfig) };
            } catch (error) {
                console.warn('Failed to parse saved config, using defaults');
                return { ...this.defaultConfig };
            }
        }
        return { ...this.defaultConfig };
    }

    saveConfig() {
        localStorage.setItem('tedx-auth-config', JSON.stringify(this.config));
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        this.saveConfig();
        
        // Apply theme immediately if theme is changed
        if (key === 'theme') {
            this.applyTheme();
        }
    }

    getApiUrl() {
        return this.config.apiUrl;
    }

    setApiUrl(url) {
        // Remove trailing slash
        url = url.replace(/\/$/, '');
        this.set('apiUrl', url);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.config.theme);
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.config.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.config.theme === 'light' ? 'dark' : 'light';
        this.set('theme', newTheme);
    }

    reset() {
        localStorage.removeItem('tedx-auth-config');
        this.config = { ...this.defaultConfig };
        this.applyTheme();
    }

    // Detect API URL automatically
    async detectApiUrl() {
        const commonUrls = [
            'https://tedx-task-backends.onrender.com'
        ];

        for (const url of commonUrls) {
            try {
                const response = await fetch(`${url}/health`, { 
                    method: 'GET',
                    timeout: 3000 
                });
                if (response.ok) {
                    this.setApiUrl(url);
                    return url;
                }
            } catch (error) {
                // Continue to next URL
            }
        }
        return null;
    }
}

// Initialize global config
window.appConfig = new Config();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
} 