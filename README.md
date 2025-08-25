# YouTube Clip Sequencer 🎬

A comprehensive, production-ready YouTube clip extraction and sequencing web application built with modern web technologies.

## ✨ Features

### 🎯 Core Functionality
- **YouTube URL Parser** - Extract videos from YouTube URLs with timestamp support (HH:MM:SS)
- **Interactive Timeline** - Frame-accurate scrubbing with drag-and-drop clip arrangement
- **Snap-to-Grid Editing** - Precise clip positioning and trimming
- **Volume Normalization** - Professional audio controls with visualization
- **Multi-format Export** - MP4 and WebM output with quality settings
- **Persistent Clip Library** - Tagging and search functionality

### 🎨 User Interface
- **Responsive Design** - Optimized for mobile and desktop
- **Dark/Light Mode Toggle** - Smooth theme transitions
- **Keyboard Shortcuts** - Power user controls (Space, arrows, F, M)
- **Accessible Components** - ARIA compliant with screen reader support
- **Professional UI Components** - Modal, dropdown, notification, and file upload systems

### 🔧 Technical Features
- **Real-time Collaboration** - WebSocket integration for team editing
- **Progress Tracking** - Live updates for processing and export operations
- **File Upload** - Drag-and-drop with validation and preview
- **Waveform Visualization** - Canvas-based audio editing interface
- **Authentication** - JWT-based user management with OAuth support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm, OR
- Docker and Docker Compose

### Installation Options

#### Option 1: Local Development (Recommended for Development)
1. **Clone or navigate to the project directory**
   ```bash
   cd your-project-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

#### Option 2: Docker Development (Fixed & Ready)
If you encounter Docker build issues, first run:
```bash
# Generate the required lockfile for Docker builds
./generate-lockfile.sh
```

Then proceed with Docker commands:
```bash
# Start development environment with hot reload
docker-compose --profile development up frontend-dev

# Access at http://localhost:3000
```

#### Troubleshooting Development Server Issues

If you encounter MIME type errors or module loading issues:

```bash
# Quick fix for development server issues
./fix-dev-server.sh

# Or manually:
# 1. Clear cache and reinstall
rm -rf node_modules package-lock.json .vite
npm install

# 2. Clear browser cache (Ctrl+Shift+R)
# 3. Restart development server
npm run dev
```

#### Option 2: Docker Development
```bash
# Start development environment with hot reload
docker-compose --profile development up frontend-dev

# Or use the convenience script
./docker-dev.sh
```

#### Option 3: Full Stack with Docker
```bash
# Start complete application stack (frontend + backend + database)
docker-compose up

# Or start only frontend
docker-compose up frontend
```

### Build for Production

#### Local Build
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

#### Docker Production
```bash
# Build and run with Docker
docker-compose -f docker-compose.yml up --build

# Or build image manually
docker build -t youtube-sequencer .
docker run -p 80:80 youtube-sequencer
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_BASE_URL=ws://localhost:3001

# Optional: OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id

# Database (for full stack)
DATABASE_URL=postgresql://user:password@localhost:5432/youtube_sequencer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PASSWORD=change-this-password-in-production
```

## 🏗️ Project Structure

```
src/
├── api/                 # Backend integration
│   ├── client.ts       # HTTP client with auth & retry
│   ├── auth.ts         # Authentication services
│   ├── projects.ts     # Project management API
│   ├── websocket.ts    # Real-time communication
│   └── index.ts        # API exports
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   │   ├── Modal.tsx
│   │   ├── Notification.tsx
│   │   ├── Waveform.tsx
│   │   ├── Dropdown.tsx
│   │   └── FileUpload.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── VideoPlayer.tsx
│   └── Timeline.tsx
├── pages/             # Page components
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── Editor.tsx
│   └── NotFound.tsx
├── store/             # Redux state management
│   ├── slices/        # Feature slices
│   │   ├── uiSlice.ts
│   │   ├── userSlice.ts
│   │   ├── projectSlice.ts
│   │   ├── clipSlice.ts
│   │   └── editorSlice.ts
│   └── index.ts       # Store configuration
├── types/             # TypeScript definitions
│   ├── index.ts       # Core entity types
│   └── api.ts         # API types
├── utils/             # Utility functions
│   ├── format.ts      # Time, file size, number formatting
│   ├── youtube.ts     # YouTube URL parsing
│   └── cn.ts          # Class name utilities
├── hooks/             # Custom React hooks
│   └── redux.ts       # Typed Redux hooks
└── assets/            # Static assets
```

## 🎬 How to Use

### 1. **Add YouTube Videos**
- Paste YouTube URLs in the editor
- Supports timestamps (e.g., `https://youtu.be/VIDEO_ID?t=120`)
- Automatic video ID extraction and metadata fetching

### 2. **Edit Your Clips**
- Drag clips on the timeline to rearrange
- Click and drag clip edges to trim
- Use keyboard shortcuts for quick navigation
- Adjust volume levels with the built-in controls

### 3. **Export Your Project**
- Choose output format (MP4/WebM)
- Select quality settings
- Monitor export progress in real-time
- Download completed video

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_BASE_URL=ws://localhost:3001

# Optional: OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Backend Requirements

The frontend expects a backend API with these endpoints:

#### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `GET /api/auth/profile`

#### Projects
- `GET /api/projects` - List projects with pagination
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Clips
- `GET /api/clips` - List clips with filters
- `POST /api/clips` - Create clip from YouTube URL
- `PATCH /api/clips/:id` - Update clip
- `DELETE /api/clips/:id` - Delete clip

#### WebSocket Events
- `processing_update` - Clip processing progress
- `export_update` - Project export progress
- `project_update` - Real-time collaboration

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for interactive elements
- **Secondary**: Neutral grays for backgrounds and text
- **Accent**: Yellow/amber for highlights and warnings
- **Success/Error**: Green and red for status indicators

### Typography
- **Primary Font**: Inter (locally hosted)
- **Monospace**: JetBrains Mono for code elements
- **Responsive Scaling**: Consistent across all screen sizes

### Components
All UI components follow these principles:
- **Accessibility First**: ARIA labels, keyboard navigation
- **Responsive**: Mobile-first design approach
- **Performance**: Optimized rendering and interactions
- **Consistent**: Unified design language throughout

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
```

### Code Quality

The project includes:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** integration (via VSCode)
- **Error boundaries** for graceful error handling

### Performance Optimizations

- **Code Splitting**: Lazy-loaded routes and components
- **Bundle Optimization**: Vendor chunking and tree shaking
- **Memory Management**: Proper cleanup of event listeners and object URLs
- **Efficient Rendering**: Memoization and conditional rendering
- **Asset Optimization**: Local fonts and optimized images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Redux Toolkit** - State management
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful icons

---

## 🐳 Docker Deployment

### Docker Setup Options

#### 1. Frontend Only (Quick Start)
```bash
# Build and run frontend container
docker build -t youtube-sequencer .
docker run -p 80:80 youtube-sequencer

# Or use Docker Compose
docker-compose up frontend
```

#### 2. Development Environment
```bash
# Start development server with hot reload
docker-compose --profile development up frontend-dev

# Access at http://localhost:3000
```

#### 3. Full Stack (Production)
```bash
# Start complete application stack
docker-compose up

# Services available:
# - Frontend: http://localhost
# - Backend API: http://localhost:3001
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

#### 4. Production Deployment
```bash
# Use production profile with reverse proxy
docker-compose --profile production up

# Or deploy to cloud platforms
# The container is optimized for:
# - AWS ECS/Fargate
# - Google Cloud Run
# - Azure Container Instances
# - DigitalOcean App Platform
```

### Docker Configuration

#### Environment Variables
```env
# Frontend Configuration
VITE_API_BASE_URL=http://your-backend-domain.com/api
VITE_WS_BASE_URL=ws://your-backend-domain.com

# Backend Configuration (for full stack)
DATABASE_URL=postgresql://user:password@postgres:5432/youtube_sequencer
JWT_SECRET=your-production-jwt-secret
REDIS_URL=redis://redis:6379
```

#### Custom Build Arguments
```bash
# Build with custom API URL
docker build \
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/api \
  --build-arg VITE_WS_BASE_URL=wss://api.yourdomain.com \
  -t youtube-sequencer .
```

### Docker Architecture

#### Multi-Stage Builds
- **Development**: Node.js with hot reload
- **Production**: Nginx serving static files
- **Optimized**: Multi-stage build reduces final image size

#### Security Features
- Non-root user execution
- Minimal base images (Alpine Linux)
- Security headers in Nginx
- Health checks for all services

#### Performance Optimizations
- Static asset caching
- Gzip compression
- Optimized bundle splitting
- CDN-ready static files

### Scaling and Deployment

#### Horizontal Scaling
```bash
# Scale frontend containers
docker-compose up --scale frontend=3

# Use load balancer for multiple instances
# Nginx reverse proxy handles distribution
```

#### Cloud Deployment Examples

**AWS ECS:**
```yaml
# task-definition.json
{
  "family": "youtube-sequencer",
  "containerDefinitions": [{
    "name": "frontend",
    "image": "your-registry/youtube-sequencer:latest",
    "portMappings": [{
      "containerPort": 80,
      "protocol": "tcp"
    }]
  }]
}
```

**Google Cloud Run:**
```bash
gcloud run deploy youtube-sequencer \
  --image your-registry/youtube-sequencer \
  --platform managed \
  --allow-unauthenticated
```

**Vercel/Netlify:**
```bash
# For static hosting platforms
npm run build
# Upload dist/ folder to your hosting provider
```

### Monitoring and Maintenance

#### Health Checks
```bash
# Check container health
docker ps
docker stats

# View logs
docker-compose logs -f frontend
```

#### Updates
```bash
# Update to latest version
docker-compose pull
docker-compose up --build

# Zero-downtime updates
docker-compose up -d --no-deps frontend
```

### Troubleshooting

#### Common Issues

**Port Conflicts:**
```bash
# Change default ports in docker-compose.yml
ports:
  - "8080:80"  # Change from 80 to 8080
```

**Memory Issues:**
```bash
# Increase Docker memory limit
# Docker Desktop > Settings > Resources > Memory
```

**Build Failures:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Advanced Configuration

#### Custom Nginx Configuration
Create `nginx.conf` for custom server configuration:

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;

    # Custom headers, redirects, etc.
    location / {
        # Your custom configuration
    }
}
```

#### SSL/TLS Setup
```bash
# Add SSL certificates
docker run -v $(pwd)/ssl:/etc/ssl/certs \
  -p 443:443 \
  your-registry/youtube-sequencer
```

### Docker Best Practices

- **Security**: Run as non-root user
- **Performance**: Use multi-stage builds
- **Monitoring**: Implement health checks
- **Updates**: Use rolling updates for zero downtime
- **Storage**: Persistent volumes for databases
- **Networking**: Use custom networks for service isolation

---

**Built with ❤️ using modern web technologies and containerization**
