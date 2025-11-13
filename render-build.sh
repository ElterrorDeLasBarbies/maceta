#!/bin/bash
# Render Build Script
set -e

echo "📦 Instalando dependencias del backend..."
cd backend && npm install

echo "📦 Instalando dependencias del frontend..."
cd ../frontend && npm install

echo "🏗️  Construyendo frontend..."
npm run build

echo "✅ Build completado!"
