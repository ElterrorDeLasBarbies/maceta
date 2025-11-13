# 🌱 Deploy en Render - Guía Paso a Paso

## Preparación

### 1. Crear cuenta en Render
- Ve a https://render.com
- Regístrate con GitHub (recomendado)

### 2. Subir código a GitHub
```bash
cd /Users/tomassubiabre/Desktop/maceta
git init
git add .
git commit -m "Sistema de riego inteligente"
# Crea un repo en GitHub y súbelo
git remote add origin https://github.com/TU_USUARIO/maceta.git
git push -u origin main
```

## Deploy Backend

### 1. En Render Dashboard
- Click "New +" → "Web Service"
- Conecta tu repositorio GitHub
- Configura:
  - **Name**: maceta-backend
  - **Region**: Oregon (más cercano a Chile)
  - **Branch**: main
  - **Root Directory**: backend
  - **Runtime**: Node
  - **Build Command**: npm install
  - **Start Command**: npm start

### 2. Variables de entorno
Agregar en "Environment":
- `SUPABASE_URL`: https://byiaxfnuxriealexklsu.supabase.co
- `SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `PORT`: 3000
- `NODE_ENV`: production

### 3. Deploy
- Click "Create Web Service"
- Espera 2-3 minutos
- URL del backend: https://maceta-backend-XXXX.onrender.com

## Deploy Frontend

### 1. En Render Dashboard
- Click "New +" → "Static Site"
- Selecciona el mismo repositorio
- Configura:
  - **Name**: maceta-frontend
  - **Branch**: main
  - **Root Directory**: frontend
  - **Build Command**: npm install && npm run build
  - **Publish Directory**: dist

### 2. Variables de entorno
- `VITE_API_URL`: https://maceta-backend-XXXX.onrender.com/api

### 3. Deploy
- Click "Create Static Site"
- URL del frontend: https://maceta-frontend-XXXX.onrender.com

## Actualizar ESP32

Cambia en el firmware:
```cpp
const char* API_URL = "https://maceta-backend-XXXX.onrender.com/api/sensor-data";
```

## ✅ Listo!

Ahora puedes acceder desde cualquier dispositivo:
- https://maceta-frontend-XXXX.onrender.com

## 📝 Notas
- El backend se "duerme" después de 15 min sin uso
- Primera petición puede tardar 30-50s en despertar
- Si necesitas que esté siempre activo, considera upgrade ($7/mes)
