import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import macetasRoutes from './routes/macetas.js';
import sensorRoutes from './routes/sensor.js';
import riegoRoutes from './routes/riego.js';

// Configuración
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Rate Limiter - Prevenir abuso de API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(limiter);

// Log de requests (desarrollo)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/macetas', macetasRoutes);
app.use('/api/sensor-data', sensorRoutes);
app.use('/api/riego', riegoRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🌱 API Sistema de Riego Inteligente IoT',
    version: '1.0.0',
    endpoints: {
      macetas: '/api/macetas',
      sensorData: '/api/sensor-data',
      riego: '/api/riego'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Manejo de rutas no encontradas en desarrollo
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  🌱 Servidor Backend Iniciado             ║
║  Puerto: ${PORT}                           ║
║  Entorno: ${process.env.NODE_ENV || 'development'}         ║
║  Supabase: ${process.env.SUPABASE_URL ? '✓ Conectado' : '✗ No configurado'}    ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;
