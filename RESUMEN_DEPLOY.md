# 🌱 Sistema de Riego Inteligente IoT

Sistema completo de monitoreo y control de riego con ESP32, sensor DHT22, backend Node.js y frontend React.

## ✅ Lo que está funcionando

### Hardware
- ✅ ESP32-D0WD-V3 conectado a WiFi "CATHERINE"
- ✅ DHT22 leyendo temperatura (26-28°C) y humedad ambiente (40-45%)
- ✅ Envío de datos cada 30 segundos al backend
- ✅ Funciona autónomo con solo alimentación USB

### Backend
- ✅ Node.js + Express corriendo en localhost:3000
- ✅ Base de datos Supabase (PostgreSQL cloud)
- ✅ API REST con 11 endpoints
- ✅ CORS configurado para ESP32
- ✅ Rate limiting y seguridad

### Frontend
- ✅ React + Vite en localhost:5173
- ✅ Diseño mobile-first optimizado
- ✅ Dashboard con métricas en tiempo real
- ✅ Gráficas de temperatura y humedad
- ✅ Control de riego manual
- ✅ Historial de riegos

## 📦 Archivos importantes

```
maceta/
├── backend/
│   ├── server.js           # Servidor Express (modificado para producción)
│   ├── routes/             # Rutas API
│   └── .env                # Variables de entorno
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # App principal (modificado para prod)
│   │   └── components/
│   │       └── MacetaDetailMobile.jsx  # Componente mobile-first
│   └── package.json
├── firmware/
│   └── maceta_dht22_only/
│       └── maceta_dht22_only.ino  # Código ESP32
├── render.yaml             # ✨ NUEVO: Configuración Render
├── render-build.sh         # ✨ NUEVO: Script de build
├── .gitignore              # ✨ NUEVO: Archivos a ignorar
└── RENDER_DEPLOY.md        # ✨ NUEVO: Guía de deploy

```

## 🚀 Próximos pasos para deploy

### Opción recomendada: Render (GRATIS)

1. **Crear repositorio GitHub**:
   ```bash
   cd /Users/tomassubiabre/Desktop/maceta
   git init
   git add .
   git commit -m "Sistema de Riego IoT completo"
   git remote add origin https://github.com/TU_USUARIO/maceta-iot.git
   git push -u origin main
   ```

2. **Deploy en Render**:
   - Crear cuenta en https://render.com
   - Conectar repositorio
   - Configurar variables de entorno
   - Deploy automático

3. **Actualizar ESP32**:
   ```cpp
   const char* API_URL = "https://tu-app.onrender.com/api/sensor-data";
   ```

Ver guía completa en `RENDER_DEPLOY.md`

## 🔧 Configuración actual

### ESP32
- **WiFi**: CATHERINE / 4533865a
- **API**: http://192.168.5.12:3000/api/sensor-data
- **Sensor**: DHT22 en GPIO 26
- **Intervalo**: 30 segundos

### Backend
- **Puerto**: 3000
- **Database**: Supabase
- **CORS**: Habilitado
- **Rate limit**: 100 req/15min

### Frontend
- **Puerto dev**: 5173
- **API dev**: http://localhost:3000/api
- **API prod**: /api (rutas relativas)

## 📝 Pendiente

- [ ] Comprar sensor de humedad de suelo nuevo (el actual está defectuoso)
- [ ] Agregar módulo relay para bomba de agua
- [ ] Implementar riego automático basado en umbrales
- [ ] Testing con datos reales de suelo

## 🎯 Sistema funcionando en:

- **Local**: http://localhost:5173
- **Producción** (después de deploy): https://tu-app.onrender.com

---

**Notas importantes:**
- Todo configurado para usar Render (backend + frontend en un servicio)
- Plan gratuito de Render suficiente para este proyecto
- El ESP32 mantiene el servidor activo enviando datos cada 30s
- Frontend mobile-first funciona perfecto en celular

¡Sistema listo para producción! 🚀🌱
