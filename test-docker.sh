#!/bin/bash

# Quick test script to verify Docker setup

echo "🧪 Testing Docker YouTube Clip Sequencer..."
echo ""

# Check if container is running
if ! docker-compose ps frontend-dev | grep -q "Up"; then
    echo "❌ Frontend container is not running"
    echo "Start it with: docker-compose --profile development up frontend-dev"
    exit 1
fi

echo "✅ Frontend container is running"

# Wait a moment for the server to be ready
sleep 5

# Test if the server is responding
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ Server is responding on http://localhost:3000"
else
    echo "❌ Server is not responding on http://localhost:3000"
    echo "Checking container logs..."
    docker-compose logs frontend-dev | tail -20
    exit 1
fi

# Test if we can access the application
if curl -s http://localhost:3000 | grep -q "YouTube Clip Sequencer"; then
    echo "✅ Application is loading correctly"
else
    echo "❌ Application is not loading correctly"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your application should be working."
echo ""
echo "🌐 Access your application at:"
echo "   Local:   http://localhost:3000"
echo "   Network: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "If you're accessing from a different machine, replace 'localhost'"
echo "with the IP address of this machine (e.g., 192.168.5.5:3000)"
