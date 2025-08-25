#!/bin/bash

# Fix Docker container configuration issues

echo "🔧 Fixing Docker container issues..."
echo ""

# Stop all containers
echo "Stopping all containers..."
docker-compose down

# Remove the problematic container
echo "Removing problematic container..."
docker rm -f youtuber_frontend-dev_1 2>/dev/null || true

# Clean up Docker system
echo "Cleaning up Docker system..."
docker system prune -f

# Remove all unused images
echo "Removing unused images..."
docker image prune -f

# Rebuild the image from scratch
echo "Rebuilding image from scratch..."
docker-compose build --no-cache frontend-dev

# Start the container
echo "Starting container..."
docker-compose --profile development up -d frontend-dev

# Wait for container to start
echo "Waiting for container to start..."
sleep 5

# Check container status
if docker-compose ps frontend-dev | grep -q "Up"; then
    echo ""
    echo "✅ Container is running successfully!"
    echo ""
    echo "🌐 Access your application at:"
    echo "   Local:   http://localhost:3000"
    echo "   Network: http://$(hostname -I | awk '{print $1}'):3000"
    echo ""
    echo "📋 Container logs:"
    docker-compose logs frontend-dev | tail -10
else
    echo ""
    echo "❌ Container failed to start"
    echo ""
    echo "📋 Container logs:"
    docker-compose logs frontend-dev
    echo ""
    echo "🔧 Trying alternative approach..."
    echo "Restarting with fresh environment..."
    docker-compose --profile development up --build --force-recreate frontend-dev
fi

echo ""
echo "🎯 If you still have issues, try:"
echo "   1. docker system prune -a  # Remove all unused containers and images"
echo "   2. Restart Docker Desktop (if applicable)"
echo "   3. Check if ports 3000 are available"
