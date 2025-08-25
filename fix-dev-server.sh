#!/bin/bash

# Fix common development server issues

echo "🔧 Fixing development server issues..."

# Clear Vite cache
if [ -d "node_modules/.vite" ]; then
    echo "🗑️  Clearing Vite cache..."
    rm -rf node_modules/.vite
fi

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# Clear browser cache reminder
echo ""
echo "🌐 Please also clear your browser cache:"
echo "   Chrome: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "   Firefox: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo ""

echo "🚀 Starting development server..."
npm run dev
