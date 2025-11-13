#!/bin/bash
# Render Build Script
set -e

echo "🏗️  Starting build process..."
echo "📍 Current directory: $(pwd)"
echo "📂 Listing files:"
ls -la

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install --production=false
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --production=false

echo ""
echo "🏗️  Building frontend..."
npm run build
cd ..

echo ""
echo "✅ Build completed successfully!"
echo "📂 Backend directory:"
ls -la backend/
echo "📂 Frontend dist directory:"
ls -la frontend/dist/ || echo "⚠️  dist folder not found"
