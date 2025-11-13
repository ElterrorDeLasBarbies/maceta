# 🌱 Backend - Sistema de Riego Inteligente IoT

API REST para gestión de macetas inteligentes con sensores IoT (ESP32).

## 🚀 Tecnologías

- **Node.js** v18+
- **Express.js** - Framework web
- **Supabase** - Base de datos PostgreSQL
- **CORS** - Middleware para permitir requests desde frontend

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js       # Configuración Supabase
├── routes/
│   ├── macetas.js        # CRUD macetas
│   ├── sensor.js         # Recepción datos ESP32
│   └── riego.js          # Control de riego
├── database/
│   └── schema.sql        # Schema de BD
├── server.js             # Punto de entrada
├── package.json
└── .env.example          # Variables de entorno
```

## ⚙️ Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
NODE_ENV=development
```

### 3. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el contenido de `database/schema.sql`
4. Copia tu `URL` y `anon key` desde **Settings > API**

### 4. Iniciar servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 API Endpoints

### Macetas

```http
GET    /api/macetas              # Listar todas las macetas
GET    /api/macetas/:id          # Obtener una maceta
POST   /api/macetas              # Crear nueva maceta
PUT    /api/macetas/:id          # Actualizar maceta
DELETE /api/macetas/:id          # Eliminar maceta
GET    /api/macetas/:id/datos    # Historial de lecturas
GET    /api/macetas/:id/estado   # Estado actual
```

### Sensores (ESP32)

```http
POST   /api/sensor-data          # Enviar datos desde ESP32
GET    /api/sensor-data/latest   # Últimas lecturas
```

### Riego

```http
POST   /api/riego/:id/activar    # Activar riego manual
GET    /api/riego/:id/historial  # Historial de riegos
GET    /api/riego/estadisticas   # Estadísticas generales
```

## 📝 Ejemplo de Request (ESP32)

```cpp
// POST /api/sensor-data
{
  "maceta_id": "uuid-de-la-maceta",
  "humedad_suelo": 45.5,
  "temperatura": 23.2,
  "humedad_ambiente": 65.8
}
```

## 🧪 Testing con cURL

```bash
# Health check
curl http://localhost:3000/health

# Crear maceta
curl -X POST http://localhost:3000/api/macetas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mi Maceta","ubicacion":"Sala","umbral_humedad":30}'

# Enviar datos de sensor
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"maceta_id":"uuid","humedad_suelo":45,"temperatura":23,"humedad_ambiente":65}'

# Activar riego
curl -X POST http://localhost:3000/api/riego/uuid/activar \
  -H "Content-Type: application/json" \
  -d '{"duracion":5}'
```

## 🐛 Debug

Ver logs en consola:
```bash
npm run dev
```

Verificar conexión a Supabase:
- El servidor mostrará "✓ Conectado" al iniciar si las credenciales son correctas

## 🚢 Deploy a Producción

### Render.com (Gratuito)

1. Sube el código a GitHub
2. Ve a [render.com](https://render.com)
3. Crea un nuevo **Web Service**
4. Conecta tu repositorio
5. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Agrega las del archivo `.env`
6. Deploy automático ✓

## 📊 Base de Datos

Ver estructura completa en `database/schema.sql`

**Tablas:**
- `macetas` - Información de cada maceta
- `lecturas` - Historial de sensores
- `riegos` - Registro de activaciones de riego

## 🔐 Seguridad

- Rate limiting: 100 requests / 15 minutos
- Validación de datos de entrada
- CORS habilitado
- Variables sensibles en `.env`

## 📄 Licencia

MIT
