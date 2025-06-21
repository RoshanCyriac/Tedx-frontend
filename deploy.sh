#!/bin/bash

# TEDx Authentication Frontend Deployment Script
# This script helps deploy the frontend to various hosting platforms

set -e

echo "🚀 TEDx Authentication Frontend Deployment Helper"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to deploy to Netlify
deploy_netlify() {
    echo "📡 Deploying to Netlify..."
    if command_exists netlify; then
        netlify deploy --prod --dir .
    else
        echo "❌ Netlify CLI not found. Install with: npm install -g netlify-cli"
        echo "   Or use drag-and-drop at: https://app.netlify.com/drop"
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "▲ Deploying to Vercel..."
    if command_exists vercel; then
        vercel --prod
    else
        echo "❌ Vercel CLI not found. Install with: npm install -g vercel"
        echo "   Or use the web interface at: https://vercel.com"
    fi
}

# Function to deploy to Firebase
deploy_firebase() {
    echo "🔥 Deploying to Firebase..."
    if command_exists firebase; then
        if [ ! -f "firebase.json" ]; then
            echo "Initializing Firebase..."
            firebase init hosting
        fi
        firebase deploy
    else
        echo "❌ Firebase CLI not found. Install with: npm install -g firebase-tools"
    fi
}

# Function to prepare for GitHub Pages
prepare_github_pages() {
    echo "📚 Preparing for GitHub Pages..."
    echo "1. Push these files to your GitHub repository"
    echo "2. Go to Settings > Pages in your repository"
    echo "3. Select 'Deploy from a branch' and choose 'main'"
    echo "4. Your site will be available at: https://username.github.io/repository-name"
}

# Function to create ZIP for manual deployment
create_zip() {
    echo "📦 Creating deployment package..."
    zip -r "tedx-frontend-$(date +%Y%m%d-%H%M%S).zip" . -x "*.git*" "deploy.sh" "*.zip"
    echo "✅ ZIP file created! Upload this to your hosting provider."
}

# Main menu
echo ""
echo "Choose deployment option:"
echo "1) Netlify"
echo "2) Vercel" 
echo "3) Firebase Hosting"
echo "4) GitHub Pages (instructions)"
echo "5) Create ZIP package"
echo "6) Local development server"
echo "0) Exit"

read -p "Enter your choice [0-6]: " choice

case $choice in
    1)
        deploy_netlify
        ;;
    2)
        deploy_vercel
        ;;
    3)
        deploy_firebase
        ;;
    4)
        prepare_github_pages
        ;;
    5)
        create_zip
        ;;
    6)
        echo "🖥️  Starting local development server..."
        echo "Frontend will be available at: http://localhost:8080"
        echo "Press Ctrl+C to stop the server"
        if command_exists python3; then
            python3 -m http.server 8080
        elif command_exists python; then
            python -m http.server 8080
        elif command_exists php; then
            php -S localhost:8080
        elif command_exists npx; then
            npx http-server -p 8080
        else
            echo "❌ No suitable server found. Please install Python, PHP, or Node.js"
        fi
        ;;
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process completed!"
echo ""
echo "📝 Don't forget to:"
echo "   • Configure your API URL using the settings gear icon"
echo "   • Update CORS settings in your backend to allow your new domain"
echo "   • Test all functionality after deployment" 