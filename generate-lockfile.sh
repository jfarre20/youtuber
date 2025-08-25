#!/bin/bash

# Generate package-lock.json for Docker builds
# This script ensures the lockfile exists before Docker build

echo "🔧 Generating package-lock.json for Docker builds..."

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json already exists"
else
    echo "📦 Creating package-lock.json..."
    npm install --package-lock-only
    echo "✅ package-lock.json created successfully"
fi

echo ""
echo "🚀 You can now build the Docker image:"
echo "docker build -t youtube-sequencer ."
echo ""
echo "Or use Docker Compose:"
echo "docker-compose --profile development up frontend-dev"
