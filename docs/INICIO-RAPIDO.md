# 🚀 Guía de Inicio Rápido

Esta guía te llevará desde cero a tener el sistema funcionando en **10 minutos**.

## ✅ Checklist Pre-requisitos

Antes de comenzar, asegúrate de tener:

- [ ] **Node.js v18+** instalado ([Descargar](https://nodejs.org/))
- [ ] **Git** instalado (opcional)
- [ ] Navegador web moderno (Chrome, Firefox, Safari)
- [ ] Cuenta en **Supabase** ([Registrarse gratis](https://supabase.com))
- [ ] Terminal/línea de comandos abierta

## 📝 Paso a Paso

### 1. Preparar el Proyecto (1 min)

```bash
# Navega a la carpeta del proyecto
cd /Users/tomassubiabre/Desktop/maceta
```

### 2. Configurar Base de Datos en Supabase (3 min)

1. **Crear proyecto:**
   - Ve a [supabase.com](https://supabase.com)
   - Click en "New Project"
   - Nombre: `maceta-iot`
   - Password: (elige una segura)
   - Region: Más cercana a ti
   - Click "Create new project" (espera 1-2 min)

2. **Crear tablas:**
   - Click en "SQL Editor" en el menú izquierdo
   - Click "New query"
   - Copia y pega el contenido de `backend/database/schema.sql`
   - Click "Run" (Ctrl/Cmd + Enter)
   - ✓ Deberías ver "Success. No rows returned"

3. **Obtener credenciales:**
   - Click en "Settings" (⚙️) en la barra lateral
   - Click en "API"
   - Copia:
     - **URL**: `https://xxx.supabase.co`
     - **anon public**: `eyJhbGc...` (es largo)

### 3. Configurar Backend (2 min)

```bash
# Ir a carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env

# Editar archivo .env (usa tu editor favorito)
nano .env
# O abre con tu editor: code .env
```

**Pega tus credenciales en `.env`:**

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

Guarda y cierra (Ctrl+O, Enter, Ctrl+X en nano).

**Iniciar servidor:**

```bash
npm run dev
```

✅ Deberías ver:
```
╔═══════════════════════════════════════════╗
║  🌱 Servidor Backend Iniciado             ║
║  Puerto: 3000                             ║
║  Entorno: development                     ║
║  Supabase: ✓ Conectado                    ║
╚═══════════════════════════════════════════╝
```

**¡No cierres esta terminal!**

### 4. Configurar Frontend (2 min)

**Abre una NUEVA terminal** (deja la anterior corriendo):

```bash
# Ir a carpeta frontend (desde raíz del proyecto)
cd /Users/tomassubiabre/Desktop/maceta/frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

✅ Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. Crear Primera Maceta (1 min)

**Abrir una TERCERA terminal:**

```bash
# Crear maceta vía API
curl -X POST http://localhost:3000/api/macetas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Primera Maceta",
    "ubicacion": "Sala",
    "umbral_humedad": 30
  }'
```

✅ Deberías ver:
```json
{
  "success": true,
  "data": {
    "id": "uuid-generado-aqui",
    "nombre": "Mi Primera Maceta",
    ...
  },
  "message": "Maceta creada exitosamente"
}
```

**Copia el `id` generado** (lo necesitarás en el siguiente paso).

### 6. Simular Datos de Sensores (1 min)

```bash
# Enviar lectura de prueba (reemplaza UUID_DE_TU_MACETA)
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "maceta_id": "UUID_DE_TU_MACETA",
    "humedad_suelo": 45.5,
    "temperatura": 23.2,
    "humedad_ambiente": 65.8
  }'
```

✅ Deberías ver:
```json
{
  "success": true,
  "message": "Datos guardados exitosamente"
}
```

### 7. Ver en el Navegador (30 seg)

1. Abre tu navegador en: **http://localhost:5173**
2. ¡Deberías ver tu maceta con los datos!
3. Click en **"Regar Ahora"** para probar el control
4. Click en **"Ver Más"** para ver gráficas

🎉 **¡Felicitaciones! El sistema está funcionando.**

## 🧪 Pruebas Rápidas

### Test 1: Enviar Más Datos

Ejecuta varias veces para generar historial:

```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "maceta_id": "TU_UUID",
    "humedad_suelo": 42.0,
    "temperatura": 24.5,
    "humedad_ambiente": 68.0
  }'
```

Refresca el navegador para ver las gráficas con más datos.

### Test 2: Activar Riego

```bash
curl -X POST http://localhost:3000/api/riego/TU_UUID/activar \
  -H "Content-Type: application/json" \
  -d '{"duracion": 5}'
```

### Test 3: Ver Todas las Macetas

```bash
curl http://localhost:3000/api/macetas
```

### Test 4: Ver Historial

```bash
curl http://localhost:3000/api/macetas/TU_UUID/datos?hours=24
```

## 📊 Interfaz Web - Tour Rápido

### Vista Principal (Dashboard)
- **Cards de macetas**: Cada card muestra el estado actual
- **Indicador de humedad**: Barra de progreso con colores:
  - 🟢 Verde (>30%): Óptimo
  - 🟠 Naranja (20-30%): Bajo
  - 🔴 Rojo (<20%): Crítico
- **Botón "Regar Ahora"**: Activa riego por 5 segundos
- **Botón "Ver Más"**: Abre modal con detalles

### Modal de Detalles
- **Gráfica de humedad**: Histórico de las últimas 24h
- **Selector de periodo**: 24h, 7 días, 30 días
- **Gráfica dual**: Temperatura y humedad ambiente
- **Historial de riegos**: Últimos 10 riegos con fecha/hora
- **Botón riego manual**: Control directo

### Auto-actualización
- El dashboard se actualiza automáticamente cada 30 segundos
- Puedes forzar actualización con el botón "Actualizar"

## 🔧 Comandos Útiles

### Backend

```bash
# Modo desarrollo (auto-reload)
npm run dev

# Modo producción
npm start

# Ver logs en tiempo real
# (Los logs se muestran automáticamente en la terminal)
```

### Frontend

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Previsualizar build
npm run preview
```

### Supabase (Alternativas a cURL)

**Ver datos en la UI:**
1. Ve a tu proyecto en Supabase
2. Click en "Table Editor"
3. Explora tablas: `macetas`, `lecturas`, `riegos`

**Insertar maceta manualmente:**
1. Table Editor → `macetas`
2. Click "Insert row"
3. Completa campos
4. Click "Save"

## ⚠️ Problemas Comunes

### Error: "Cannot find module 'express'"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Supabase: ✗ No configurado"
- Verifica que `.env` existe en `backend/`
- Verifica que copiaste correctamente URL y KEY
- Reinicia el servidor: Ctrl+C y `npm run dev`

### Error: "CORS policy" en el navegador
- Verifica que el backend está corriendo
- Verifica que usas `http://localhost:5173` (no otra URL)

### Frontend muestra "No hay macetas registradas"
- Verifica que creaste al menos una maceta
- Verifica en Supabase Table Editor si hay datos en tabla `macetas`

### Gráficas vacías en "Ver Más"
- Envía más datos con `curl` (al menos 3-5 lecturas)
- Verifica que el `maceta_id` es correcto
- Revisa tabla `lecturas` en Supabase

## 📱 Próximos Pasos

Ahora que el sistema funciona:

1. **Crear más macetas:**
   ```bash
   curl -X POST http://localhost:3000/api/macetas \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Maceta 2","ubicacion":"Balcón","umbral_humedad":35}'
   ```

2. **Simular datos periódicos:** (script de ejemplo)
   ```bash
   # crear archivo test-data.sh
   #!/bin/bash
   while true; do
     curl -X POST http://localhost:3000/api/sensor-data \
       -H "Content-Type: application/json" \
       -d "{\"maceta_id\":\"TU_UUID\",\"humedad_suelo\":$((RANDOM % 50 + 30)),\"temperatura\":$((RANDOM % 10 + 20)),\"humedad_ambiente\":$((RANDOM % 20 + 50))}"
     sleep 60
   done
   ```

3. **Conectar Hardware ESP32:** Ver guía en `docs/HARDWARE.md`

4. **Personalizar umbrales:** Edita la maceta en Supabase Table Editor

5. **Deploy a producción:** Ver guía en `README.md`

## 🎓 Recursos Adicionales

- **Documentación completa:** Ver `README.md` en la raíz
- **Hardware setup:** Ver `docs/HARDWARE.md`
- **Código ESP32:** (próximamente en `/firmware`)

## 🆘 ¿Necesitas Ayuda?

1. Revisa la sección Troubleshooting arriba
2. Verifica los logs en las terminales
3. Revisa la consola del navegador (F12)
4. Consulta los README de cada carpeta
5. Abre un issue en GitHub

---

**¡Listo para regar tus plantas inteligentemente! 🌱💧**
