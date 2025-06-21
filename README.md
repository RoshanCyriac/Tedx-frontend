# TEDx Authentication Portal - Frontend

A modern, responsive frontend application for the TEDx Authentication Service.

## 🚀 Quick Start

### Backend URL Configuration
The frontend is pre-configured to connect to your backend at:
```
https://tedx-task-backends.onrender.com
```

### Local Development
1. Open `index.html` in your browser
2. Or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8080
   ```

## 📁 Project Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # Modern CSS with dark mode
├── app.js             # Main application logic
├── config.js          # Configuration management
├── env.js             # Environment loader
├── deploy-config.js   # Deployment configuration
├── .env               # Environment variables
└── deploy.sh          # Deployment script
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)
1. Drag and drop the `frontend` folder to [Netlify](https://netlify.com)
2. Your site will be live instantly!

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

### Option 3: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select source folder as `frontend`

### Option 4: Using Deploy Script
```bash
chmod +x deploy.sh
./deploy.sh
```

## ⚙️ Configuration

### Environment Variables
The app supports multiple ways to configure the backend URL:

1. **Runtime Configuration** (Recommended for deployment):
   - Edit `deploy-config.js`
   - Update `API_URL` value

2. **Environment File**:
   - Edit `.env` file
   - Set `API_URL=your_backend_url`

3. **User Configuration**:
   - Click the settings gear icon in the app
   - Enter your backend URL

### Backend URL Options
- **Production**: `https://tedx-task-backends.onrender.com`
- **Development**: `https://tedx-task-backends.onrender.com` (or your local backend if running locally)
- **Custom**: Any URL where your backend is hosted

## 🎨 Features

- ✅ **Modern UI/UX** with TEDx branding
- ✅ **Responsive Design** for all devices
- ✅ **Dark/Light Mode** toggle
- ✅ **Google OAuth** integration
- ✅ **Admin Panel** for user management
- ✅ **Real-time Updates** with auto-refresh
- ✅ **Configuration Modal** for API settings
- ✅ **Error Handling** with user-friendly messages
- ✅ **Token Management** with auto-refresh
- ✅ **Security Features** with input validation

## 🔧 API Integration

The frontend automatically connects to your backend at:
```
https://tedx-task-backends.onrender.com
```

### API Endpoints Used:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/users/me` - Current user info
- `GET /api/users` - All users (admin only)
- `PATCH /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## 🎯 User Roles

### Regular User
- Sign up / Sign in
- View profile information
- Google OAuth login

### Admin User
- All regular user features
- View all users
- Promote/demote user roles
- Delete users
- Real-time user management

## 🔒 Security Features

- JWT token authentication
- Automatic token refresh
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure password requirements

## 🎨 Customization

### Changing Backend URL
1. **For deployment**: Edit `deploy-config.js`
2. **For development**: Edit `.env` file
3. **Runtime**: Use the settings modal in the app

### Theming
- Supports light and dark themes
- Automatically detects system preference
- Manual toggle available

### Branding
- Update logo and colors in `styles.css`
- Modify app name in `deploy-config.js`

## 📱 Browser Support

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+

## 🚀 Performance

- **Lightweight**: ~50KB total size
- **Fast Loading**: Optimized assets
- **Responsive**: Mobile-first design
- **Accessible**: WCAG 2.1 compliant

## 🛠️ Troubleshooting

### Connection Issues
1. Check if backend is running
2. Verify backend URL in settings
3. Check browser console for errors

### Authentication Issues
1. Clear browser localStorage
2. Check Google OAuth configuration
3. Verify JWT tokens

### CORS Issues
1. Ensure backend allows your domain
2. Check backend CORS configuration
3. Use HTTPS for production

## 📞 Support

- **Backend URL**: https://tedx-task-backends.onrender.com
- **Repository**: Check your GitHub repository
- **Issues**: Report via GitHub Issues

---

**Ready to deploy!** 🎉

Your frontend is pre-configured and ready to connect to your backend at `https://tedx-task-backends.onrender.com`. 