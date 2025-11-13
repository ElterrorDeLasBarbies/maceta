#!/bin/bash

# Script para iniciar Backend y Frontend simultáneamente
# Sistema de Riego Inteligente IoT

echo "🌱 Iniciando Sistema de Riego Inteligente..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que estamos en la carpeta correcta
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

# Verificar que las dependencias están instaladas
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd frontend && npm install && cd ..
fi

# Verificar que existe .env
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Advertencia: No se encontró backend/.env"
    echo "Copia backend/.env.example a backend/.env y configura tus credenciales"
    exit 1
fi

echo "${GREEN}✓${NC} Dependencias listas"
echo ""

# Iniciar Backend en background
echo "${BLUE}[BACKEND]${NC} Iniciando en http://localhost:3000"
cd backend
npm run dev > ../logs-backend.txt 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar 3 segundos para que el backend inicie
sleep 3

# Iniciar Frontend en background
echo "${BLUE}[FRONTEND]${NC} Iniciando en http://localhost:5173"
cd frontend
npm run dev > ../logs-frontend.txt 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "${GREEN}✓ Sistema iniciado${NC}"
echo ""
echo "📊 Backend:  http://localhost:3000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs-backend.txt"
echo "   Frontend: tail -f logs-frontend.txt"
echo ""
echo "🛑 Para detener: ./stop.sh"
echo "   O presiona Ctrl+C"
echo ""

# Guardar PIDs para poder detener después
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# Mantener el script corriendo y mostrar logs en tiempo real
echo "=== Logs en tiempo real ==="
tail -f logs-backend.txt logs-frontend.txt

# Cleanup al recibir Ctrl+C
trap 'echo ""; echo "🛑 Deteniendo servicios..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; exit 0' INT TERM
