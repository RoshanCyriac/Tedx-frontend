// Main Application Logic
class AuthApp {
    constructor() {
        this.currentUser = null;
        this.refreshTimer = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleOAuthCallback();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            window.appConfig.toggleTheme();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form submissions
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeForm = document.querySelector('.form-content.active');
                if (activeForm) {
                    const formId = activeForm.id;
                    if (formId === 'login-form') {
                        this.login();
                    } else if (formId === 'signup-form') {
                        this.signup();
                    }
                }
            }
        });

        // Modal close on backdrop click
        document.getElementById('config-modal').addEventListener('click', (e) => {
            if (e.target.id === 'config-modal') {
                this.closeConfigModal();
            }
        });
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update form content
        document.querySelectorAll('.form-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-form`).classList.add('active');
    }

    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const error = urlParams.get('error');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            this.showMessage('Successfully authenticated with Google!', 'success');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            this.checkAuthStatus();
        } else if (error) {
            this.showMessage('Authentication failed: ' + error, 'error');
        }
    }

    showMessage(message, type = 'info') {
        const authStatus = document.getElementById('auth-status');
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        authStatus.innerHTML = '';
        authStatus.appendChild(messageDiv);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (authStatus.contains(messageDiv)) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (authStatus.contains(messageDiv)) {
                        authStatus.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, 5000);
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            this.showAuthForms();
            return;
        }

        try {
            const response = await this.apiCall('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.showUserDashboard();
                this.startAutoRefresh();
            } else {
                if (response.status === 401) {
                    // Try to refresh token
                    const refreshed = await this.refreshToken();
                    if (refreshed) {
                        return this.checkAuthStatus();
                    }
                }
                this.clearAuth();
                this.showAuthForms();
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            this.showMessage('Connection error. Please check your network.', 'error');
            this.clearAuth();
            this.showAuthForms();
        }
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        try {
            const response = await this.apiCall('/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.tokens.accessToken);
                localStorage.setItem('refreshToken', data.tokens.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        return false;
    }

    showAuthForms() {
        document.getElementById('auth-forms').style.display = 'block';
        document.getElementById('user-dashboard').style.display = 'none';
        this.stopAutoRefresh();
    }

    showUserDashboard() {
        document.getElementById('auth-forms').style.display = 'none';
        document.getElementById('user-dashboard').style.display = 'block';
        
        // Update user info
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-data').textContent = JSON.stringify(this.currentUser, null, 2);

        // Show admin panel if user is admin
        if (this.currentUser.role === 'admin') {
            document.getElementById('admin-panel').style.display = 'block';
            this.getAllUsers();
        } else {
            document.getElementById('admin-panel').style.display = 'none';
        }
    }

    async signup() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!this.validateSignupForm(name, email, password)) {
            return;
        }

        try {
            const response = await this.apiCall('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.tokens.accessToken);
                localStorage.setItem('refreshToken', data.tokens.refreshToken);
                this.showMessage('Account created successfully!', 'success');
                this.checkAuthStatus();
                this.clearForm('signup');
            } else {
                this.showMessage(data.message || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    async login() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        try {
            const response = await this.apiCall('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.tokens.accessToken);
                localStorage.setItem('refreshToken', data.tokens.refreshToken);
                this.showMessage('Login successful!', 'success');
                this.checkAuthStatus();
                this.clearForm('login');
            } else {
                this.showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    async logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        
        try {
            if (refreshToken) {
                await this.apiCall('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearAuth();
        this.showAuthForms();
        this.showMessage('Logged out successfully!', 'success');
    }

    googleSignIn() {
        window.location.href = `${window.appConfig.getApiUrl()}/api/auth/google`;
    }

    async getAllUsers() {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await this.apiCall('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.displayUsers(data.users);
            } else {
                const error = await response.json();
                this.showMessage(error.message || 'Failed to fetch users', 'error');
            }
        } catch (error) {
            console.error('Get users error:', error);
            this.showMessage('Failed to fetch users', 'error');
        }
    }

    async updateUserRole(userId, newRole) {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await this.apiCall(`/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                this.showMessage(`User role updated to ${newRole}`, 'success');
                this.getAllUsers();
            } else {
                const error = await response.json();
                this.showMessage(error.message || 'Failed to update user role', 'error');
            }
        } catch (error) {
            console.error('Update role error:', error);
            this.showMessage('Failed to update user role', 'error');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const response = await this.apiCall(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.showMessage('User deleted successfully', 'success');
                this.getAllUsers();
            } else {
                const error = await response.json();
                this.showMessage(error.message || 'Failed to delete user', 'error');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            this.showMessage('Failed to delete user', 'error');
        }
    }

    displayUsers(users) {
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '';

        if (users.length === 0) {
            usersList.innerHTML = '<p class="text-muted">No users found.</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${this.escapeHtml(user.name)}</h3>
                <p><strong>Email:</strong> ${this.escapeHtml(user.email)}</p>
                <p><strong>Role:</strong> <span class="role-badge role-${user.role}">${user.role}</span></p>
                <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> ${new Date(user.updatedAt).toLocaleString()}</p>
                ${user.googleId ? '<p><strong>Google Account:</strong> Yes</p>' : ''}
                ${user.id !== this.currentUser.id ? `
                    <div class="user-actions">
                        <button class="btn btn-secondary" onclick="app.updateUserRole('${user.id}', '${user.role === 'admin' ? 'user' : 'admin'}')">
                            <i class="fas fa-user-${user.role === 'admin' ? 'minus' : 'plus'}"></i>
                            ${user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button class="btn btn-outline btn-danger" onclick="app.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                            Delete User
                        </button>
                    </div>
                ` : '<p class="current-user-badge"><em><i class="fas fa-star"></i> Current User</em></p>'}
            `;
            usersList.appendChild(userCard);
        });
    }

    // Configuration Modal
    openConfigModal() {
        const modal = document.getElementById('config-modal');
        const apiUrlInput = document.getElementById('api-url');
        apiUrlInput.value = window.appConfig.getApiUrl();
        modal.classList.add('active');
    }

    closeConfigModal() {
        document.getElementById('config-modal').classList.remove('active');
    }

    saveConfig() {
        const apiUrl = document.getElementById('api-url').value.trim();
        if (apiUrl) {
            window.appConfig.setApiUrl(apiUrl);
            this.showMessage('Configuration saved successfully!', 'success');
            this.closeConfigModal();
            // Re-check auth status with new API URL
            this.checkAuthStatus();
        } else {
            this.showMessage('Please enter a valid API URL', 'error');
        }
    }

    // Utility methods
    async apiCall(endpoint, options = {}) {
        const url = `${window.appConfig.getApiUrl()}${endpoint}`;
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        return password.length >= 6 && /\d/.test(password);
    }

    validateSignupForm(name, email, password) {
        if (!name) {
            this.showMessage('Please enter your name', 'error');
            return false;
        }
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }
        if (!this.validatePassword(password)) {
            this.showMessage('Password must be at least 6 characters long and contain at least one number', 'error');
            return false;
        }
        return true;
    }

    validateLoginForm(email, password) {
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }
        if (!password) {
            this.showMessage('Please enter your password', 'error');
            return false;
        }
        return true;
    }

    clearForm(formType) {
        if (formType === 'signup') {
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        } else if (formType === 'login') {
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
        }
    }

    clearAuth() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.currentUser = null;
        this.stopAutoRefresh();
    }

    startAutoRefresh() {
        if (window.appConfig.get('autoRefresh') && !this.refreshTimer) {
            this.refreshTimer = setInterval(() => {
                if (this.currentUser && this.currentUser.role === 'admin') {
                    this.getAllUsers();
                }
            }, window.appConfig.get('refreshInterval'));
        }
    }

    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for HTML onclick handlers
function login() { app.login(); }
function signup() { app.signup(); }
function logout() { app.logout(); }
function googleSignIn() { app.googleSignIn(); }
function getAllUsers() { app.getAllUsers(); }
function openConfigModal() { app.openConfigModal(); }
function closeConfigModal() { app.closeConfigModal(); }
function saveConfig() { app.saveConfig(); }

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AuthApp();
});