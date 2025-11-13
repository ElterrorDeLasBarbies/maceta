# 🌱 Sistema de Riego Inteligente IoT - MVP

Sistema completo de monitoreo y control de riego automatizado para macetas con sensores IoT (ESP32), backend API REST y aplicación web en tiempo real.

![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20Supabase-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Descripción

MVP funcional de un sistema IoT que permite:
- 📊 **Monitoreo en tiempo real** de humedad del suelo, temperatura y humedad ambiente
- 💧 **Control remoto de riego** desde aplicación web
- 📈 **Visualización histórica** con gráficas interactivas
- 🔔 **Alertas** de humedad baja
- 🤖 **Riego automático** por umbral configurable

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│   ESP32         │  ← Sensores (DHT22 + Humedad Suelo)
│   + WiFi        │  ← Relé → Bomba 5V
└────────┬────────┘
         │ HTTP POST (JSON)
         ↓
┌─────────────────┐
│  Backend API    │
│  Node.js +      │
│  Express        │
│  Port: 3000     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Supabase      │
│  PostgreSQL     │
│  (Base de Datos)│
└────────┬────────┘
         ↑
         │ REST API
┌────────┴────────┐
│  Frontend Web   │
│  React + Vite   │
│  Port: 5173     │
└─────────────────┘
```

## 🚀 Stack Tecnológico

### Hardware
- **ESP32** (38 pines, WiFi/Bluetooth)
- **DHT22** - Sensor temperatura/humedad ambiente
- **Sensor Capacitivo** - Humedad del suelo
- **Relé 5V** - Control de bomba
- **Bomba sumergible 5V**

### Backend
- **Node.js** v18+
- **Express.js** - API REST
- **Supabase** - PostgreSQL hosted (gratuito)
- **CORS** - Middleware
- **Rate Limiting** - Seguridad

### Frontend
- **React 19** - Framework UI
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **Recharts** - Gráficas
- **Lucide React** - Iconos

### Firmware (Próximamente)
- **Arduino IDE / PlatformIO**
- **C++** (Arduino Framework)
- **WiFi.h** - Conectividad
- **DHT.h** - Sensor temperatura/humedad
- **HTTPClient.h** - Comunicación con API

## 📦 Estructura del Proyecto

```
maceta/
├── backend/              # API REST (Node.js + Express)
│   ├── config/           # Configuración de Supabase
│   ├── routes/           # Endpoints API
│   ├── database/         # Schema SQL
│   ├── server.js         # Entry point
│   └── package.json
│
├── frontend/             # Aplicación Web (React + Vite)
│   ├── src/
│   │   ├── components/   # Componentes UI
│   │   ├── App.jsx       # App principal
│   │   └── index.css     # Estilos Tailwind
│   ├── index.html
│   └── package.json
│
├── firmware/             # Código ESP32 (próximamente)
│   └── maceta_iot/
│       └── maceta_iot.ino
│
└── docs/                 # Documentación
    ├── API.md
    ├── HARDWARE.md
    └── DEPLOYMENT.md
```

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js v18+ ([Descargar](https://nodejs.org/))
- Cuenta en Supabase ([Registrarse gratis](https://supabase.com))
- Git

### 1️⃣ Clonar/Descargar el Proyecto

```bash
# Si usas Git
git clone <tu-repositorio>
cd maceta

# O simplemente navega a la carpeta del proyecto
cd /Users/tomassubiabre/Desktop/maceta
```

### 2️⃣ Configurar Base de Datos (Supabase)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el script:

```sql
-- Copiar contenido de backend/database/schema.sql
```

4. Copia tus credenciales desde **Settings > API**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### 3️⃣ Configurar e Iniciar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# Iniciar servidor
npm run dev
```

✓ Backend corriendo en `http://localhost:3000`

### 4️⃣ Configurar e Iniciar Frontend

**Abrir una nueva terminal:**

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

✓ Frontend corriendo en `http://localhost:5173`

### 5️⃣ Crear tu Primera Maceta

Puedes usar:

**Opción A: API directamente (cURL)**

```bash
curl -X POST http://localhost:3000/api/macetas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mi Maceta","ubicacion":"Sala","umbral_humedad":30}'
```

**Opción B: Desde Supabase UI**

1. Ve a tu proyecto en Supabase
2. Abre **Table Editor**
3. Selecciona tabla `macetas`
4. Click en **Insert row**
5. Completa los campos

**Opción C: Directamente en SQL Editor**

```sql
INSERT INTO macetas (nombre, ubicacion, umbral_humedad) 
VALUES ('Mi Maceta', 'Sala', 30);
```

### 6️⃣ Probar el Sistema

Abre el navegador en `http://localhost:5173` y verás:

- ✅ Tu maceta listada
- ⚠️ "Sin datos" (normal, aún no hay lecturas)
- 💧 Botón "Regar Ahora" funcional

## 📊 API Endpoints

### Macetas

```http
GET    /api/macetas                  # Listar todas
POST   /api/macetas                  # Crear nueva
GET    /api/macetas/:id              # Obtener una
PUT    /api/macetas/:id              # Actualizar
DELETE /api/macetas/:id              # Eliminar
GET    /api/macetas/:id/datos        # Historial de lecturas
GET    /api/macetas/:id/estado       # Estado actual
```

### Sensores (ESP32)

```http
POST   /api/sensor-data              # Enviar datos desde ESP32
GET    /api/sensor-data/latest       # Últimas lecturas
```

### Riego

```http
POST   /api/riego/:id/activar        # Activar riego manual
GET    /api/riego/:id/historial      # Historial de riegos
GET    /api/riego/estadisticas       # Estadísticas generales
```

## 🧪 Probar sin Hardware

Para simular datos de sensores mientras desarrollas:

```bash
# Enviar lectura de prueba
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "maceta_id": "tu-uuid-de-maceta",
    "humedad_suelo": 45.5,
    "temperatura": 23.2,
    "humedad_ambiente": 65.8
  }'
```

Refresca el frontend y verás los datos aparecer en tiempo real.

## 🔌 Diagrama de Conexión Hardware (ESP32)

```
ESP32 Pinout:
┌─────────────┐
│    ESP32    │
└─────────────┘
│
├─ GPIO 4  ──→ DHT22 DATA
├─ GPIO 34 ──→ Sensor Humedad OUT (analógico)
├─ GPIO 5  ──→ Relé IN
│
├─ 3.3V ─────→ DHT22 VCC + Sensor VCC
├─ GND ──────→ DHT22 GND + Sensor GND
│
└─ 5V (VIN)──→ Relé VCC

Relé → Bomba:
┌──────┐
│ Relé │
└──────┘
│
├─ COM ──→ 5V Power
├─ NO  ──→ Bomba (+)
└─ NC  (no conectado)

Bomba (-) ──→ GND Power
```

## 🚀 Deploy a Producción

### Backend (Render.com - Gratuito)

1. Sube el código a GitHub
2. Ve a [render.com](https://render.com)
3. Crea un **Web Service**
4. Conecta tu repositorio
5. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Agrega variables de entorno (desde `.env`)
7. Deploy ✓

### Frontend (Vercel - Gratuito)

1. Ve a [vercel.com](https://vercel.com)
2. Importa el repositorio
3. Configura:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Agrega variable de entorno:
   - `VITE_API_URL` = URL de tu backend en Render
5. Deploy ✓

## 📱 Características Implementadas

### ✅ Backend
- [x] API REST completa con Express
- [x] CRUD de macetas
- [x] Recepción de datos de sensores
- [x] Control de riego manual
- [x] Historial de lecturas y riegos
- [x] Validación de datos
- [x] Rate limiting
- [x] Manejo de errores

### ✅ Frontend
- [x] Dashboard responsive
- [x] Cards de macetas con datos en tiempo real
- [x] Indicadores visuales de humedad
- [x] Botón de riego manual
- [x] Modal con detalles y gráficas
- [x] Gráfica de humedad del suelo
- [x] Gráfica de temperatura/humedad ambiente
- [x] Historial de riegos
- [x] Auto-actualización cada 30s
- [x] Manejo de errores de conexión

### ⏳ Pendiente (Fase 2)
- [ ] Firmware ESP32 completo
- [ ] Riego automático por umbral
- [ ] Notificaciones push
- [ ] Autenticación de usuarios
- [ ] Múltiples usuarios/organizaciones
- [ ] App móvil nativa

## 🛠️ Troubleshooting

### Backend no inicia

```bash
# Verificar que Node.js está instalado
node --version

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Frontend muestra "Error de conexión"

1. Verifica que el backend esté corriendo en puerto 3000
2. Revisa la consola del navegador (F12)
3. Verifica que Supabase esté configurado correctamente

### Supabase: "Credenciales no configuradas"

1. Verifica que `.env` existe en `backend/`
2. Verifica que las credenciales son correctas
3. Reinicia el servidor backend

## 📚 Documentación Adicional

- [API Documentation](./docs/API.md) - Guía completa de endpoints
- [Hardware Setup](./docs/HARDWARE.md) - Conexiones ESP32 detalladas
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy paso a paso

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

## 👨‍💻 Autor

Desarrollado por Tomás Subiabre

---

⭐ Si te resultó útil, ¡dale una estrella al proyecto!

🐛 ¿Encontraste un bug? [Abre un issue](../../issues)
