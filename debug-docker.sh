#!/bin/bash

# Debug script for Docker development issues

echo "🔍 Debugging Docker development environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Clean up
echo "🧹 Cleaning up..."
docker system prune -f

# Build fresh
echo "🔨 Building fresh development image..."
docker-compose build --no-cache frontend-dev

# Start in detached mode
echo "🚀 Starting development server..."
docker-compose --profile development up -d frontend-dev

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Check container status
if docker-compose ps frontend-dev | grep -q "Up"; then
    echo "✅ Container is running!"
    echo ""
    echo "🌐 Access your application at:"
    echo "   Local:   http://localhost:3000"
    echo "   Network: http://$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' youtuber_frontend-dev_1):3000"
    echo ""
    echo "📋 Container logs:"
    docker-compose logs frontend-dev
else
    echo "❌ Container failed to start"
    echo ""
    echo "📋 Container logs:"
    docker-compose logs frontend-dev
fi

echo ""
echo "🔧 If you still have issues:"
echo "   1. Clear browser cache (Ctrl+Shift+R)"
echo "   2. Try accessing from incognito/private mode"
echo "   3. Check if port 3000 is available"
echo "   4. Run: docker-compose --profile development up frontend-dev (without -d for logs)"
