#!/bin/bash

# Script para detener Backend y Frontend

echo "🛑 Deteniendo Sistema de Riego Inteligente..."

# Leer PIDs guardados
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    kill $BACKEND_PID 2>/dev/null
    rm .backend.pid
    echo "✓ Backend detenido"
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    kill $FRONTEND_PID 2>/dev/null
    rm .frontend.pid
    echo "✓ Frontend detenido"
fi

# Matar cualquier proceso de node en los puertos 3000 y 5173
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "✓ Sistema detenido completamente"
