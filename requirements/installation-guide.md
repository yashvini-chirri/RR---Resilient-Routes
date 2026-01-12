# Installation & Setup Guide - Resilient Routes

## 1. Prerequisites

### 1.1 System Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 1GB free space
- **Internet**: Stable broadband connection for API calls

### 1.2 Browser Requirements
- **Chrome**: 90+ (Recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### 1.3 Development Tools (Optional)
- **VS Code**: Recommended code editor
- **Git**: For version control
- **Chrome DevTools**: For debugging

## 2. Installation Steps

### 2.1 Clone the Repository
```bash
# Using HTTPS
git clone https://github.com/username/resilient-routes.git

# Or using SSH (if configured)
git clone git@github.com:username/resilient-routes.git

# Navigate to project directory
cd resilient-routes
```

### 2.2 Install Dependencies
```bash
# Install all project dependencies
npm install

# Alternative: Use npm ci for faster, reliable, reproducible builds
npm ci
```

### 2.3 Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify dependencies installation
npm list --depth=0
```

## 3. Configuration

### 3.1 Environment Variables (Optional)
Create a `.env` file in the project root:
```bash
# Development environment variables
VITE_APP_TITLE="Resilient Routes"
VITE_APP_VERSION="1.0.0"

# API Configuration (optional - using defaults)
VITE_OSRM_BASE_URL="https://router.project-osrm.org"
VITE_NOMINATIM_BASE_URL="https://nominatim.openstreetmap.org"

# Development settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL="debug"
```

### 3.2 Port Configuration
Default development server runs on port 5173. To use a different port:
```bash
# In package.json, modify the dev script:
"dev": "vite --port 3000"

# Or set via environment variable
PORT=3000 npm run dev
```

## 4. Running the Application

### 4.1 Development Server
```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5173
# or the next available port if 5173 is in use
```

### 4.2 Build for Production
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### 4.3 Available Scripts
```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Maintenance
npm run clean        # Clear build artifacts
npm install          # Reinstall dependencies
npm update           # Update dependencies
```

## 5. Project Structure Overview

```
resilient-routes/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   ├── data/             # Static data files
│   ├── services/         # API and business logic
│   ├── App.jsx           # Main app component
│   ├── App.css           # Global app styles
│   ├── index.css         # CSS reset and base styles
│   └── main.jsx          # Application entry point
├── requirements/         # Project documentation
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── README.md            # Project documentation
└── .gitignore          # Git ignore rules
```

## 6. Development Workflow

### 6.1 Making Changes
```bash
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:5173

# 3. Edit files in src/ directory
# Changes will automatically reload in browser

# 4. Test your changes thoroughly
```

### 6.2 Adding New Features
```bash
# 1. Create new component files in src/components/
# 2. Add corresponding CSS files if needed
# 3. Import and use components in parent components
# 4. Test functionality in browser
```

### 6.3 Building for Production
```bash
# 1. Build the application
npm run build

# 2. Test production build
npm run preview

# 3. Deploy contents of dist/ folder to hosting service
```

## 7. Troubleshooting

### 7.1 Common Issues

#### Node.js Version Issues
```bash
# Check current Node.js version
node --version

# If version is too old, update Node.js:
# Visit https://nodejs.org and download latest LTS version
```

#### Port Already in Use
```bash
# If port 5173 is in use, Vite will automatically try the next available port
# Look for output like: "Local: http://localhost:5174/"
```

#### Dependencies Installation Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### API Connection Issues
```bash
# Check internet connection
# Verify API endpoints are accessible:
curl https://router.project-osrm.org/route/v1/driving/77.1025,28.7041;77.2090,28.6139

# Check browser console for CORS or network errors
```

### 7.2 Error Messages

#### "Module not found" errors
- Ensure all dependencies are installed: `npm install`
- Check import paths in your code
- Verify file names and extensions

#### "Failed to fetch" API errors
- Check internet connection
- Verify API endpoints are responding
- Look for CORS issues in browser console

#### Build fails
- Clear build cache: `rm -rf dist/`
- Check for syntax errors in code
- Ensure all imports are valid

### 7.3 Performance Issues

#### Slow development server
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart development server
npm run dev
```

#### Large bundle size
```bash
# Analyze bundle size
npm run build

# Check dist/ folder sizes
# Consider code splitting for large components
```

## 8. IDE Setup (VS Code)

### 8.1 Recommended Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-css-peek"
  ]
}
```

### 8.2 VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### 8.3 Debugging Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## 9. Deployment Guide

### 9.1 Static Hosting (Recommended)

#### Vercel Deployment
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel --prod
```

#### Netlify Deployment
```bash
# 1. Build the project
npm run build

# 2. Drag and drop dist/ folder to Netlify
# Or connect GitHub repository for automatic deployments
```

#### GitHub Pages
```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add deploy script to package.json
"deploy": "gh-pages -d dist"

# 3. Build and deploy
npm run build
npm run deploy
```

### 9.2 Custom Server
```bash
# 1. Build the project
npm run build

# 2. Upload dist/ folder contents to web server
# 3. Configure server to serve static files
# 4. Ensure HTTPS for geolocation APIs
```

## 10. Maintenance

### 10.1 Regular Updates
```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Update major versions (carefully)
npm install react@latest react-dom@latest
```

### 10.2 Security Updates
```bash
# Check for security vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Review and fix remaining issues manually
```

### 10.3 Backup and Version Control
```bash
# Commit changes regularly
git add .
git commit -m "Add new feature"
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

## 11. Getting Help

### 11.1 Documentation
- **React**: https://reactjs.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Leaflet**: https://leafletjs.com/reference.html
- **React-Leaflet**: https://react-leaflet.js.org/

### 11.2 Community Support
- **Stack Overflow**: Tag questions with react, leaflet, vite
- **GitHub Issues**: For project-specific problems
- **Discord/Slack**: Development community channels

### 11.3 Professional Support
- Consider hiring React developers for complex customizations
- Consult with mapping specialists for advanced features
- Engage UX designers for interface improvements