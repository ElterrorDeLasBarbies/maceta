#!/bin/bash
# Render Build Script
set -e

echo "📦 Instalando dependencias del backend..."
cd backend && npm install --production=false

echo "📦 Instalando dependencias del frontend (incluyendo devDependencies)..."
cd ../frontend && npm install --production=false

echo "🏗️  Construyendo frontend..."
npm run build

echo "✅ Build completado!"
