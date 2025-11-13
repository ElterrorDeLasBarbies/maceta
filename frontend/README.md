# 🌱 Frontend - Sistema de Riego Inteligente IoT

Aplicación web React para monitoreo y control de macetas inteligentes con sensores IoT.

## 🚀 Tecnologías

- **React 19** - Framework UI
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Framework CSS utility-first
- **Recharts** - Gráficas y visualización de datos
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Barra superior
│   │   ├── Dashboard.jsx        # Vista principal con grid de macetas
│   │   ├── MacetaCard.jsx       # Card individual de maceta
│   │   └── MacetaDetail.jsx     # Modal con gráficas y detalles
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globales + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## ⚙️ Instalación

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno (opcional)

Crea un archivo `.env` si necesitas cambiar la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

Por defecto usa `http://localhost:3000/api`

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos optimizados se generan en la carpeta `dist/`

## 📱 Características

### Dashboard Principal
- ✅ Vista grid responsive de todas las macetas
- ✅ Estado en tiempo real de humedad, temperatura y humedad ambiente
- ✅ Indicadores visuales de nivel de humedad
- ✅ Alertas de humedad baja/crítica
- ✅ Botón de riego manual
- ✅ Auto-actualización cada 30 segundos

### Vista Detallada (Modal)
- ✅ Gráfica histórica de humedad del suelo
- ✅ Gráfica de temperatura y humedad ambiente
- ✅ Selector de periodo (24h, 7d, 30d)
- ✅ Historial de riegos recientes

## 🔗 Integración con Backend

El frontend se comunica con el backend en `http://localhost:3000/api`

Endpoints usados:
- `GET /api/macetas` - Lista de macetas
- `GET /api/macetas/:id/estado` - Estado actual
- `GET /api/macetas/:id/datos` - Datos históricos
- `POST /api/riego/:id/activar` - Activar riego

## 🚢 Deploy a Producción

### Vercel (Recomendado - Gratuito)

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio
4. Deploy automático ✓

## 📄 Licencia

MIT
