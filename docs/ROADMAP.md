# 🗺️ ROADMAP - Sistema de Riego Inteligente IoT

## 📍 ESTADO ACTUAL (Lo que YA funciona)

### ✅ Completado - MVP Software (Fase 1)

#### Backend API (100%)
- [x] Servidor Express corriendo en puerto 3000
- [x] Conexión a Supabase funcionando
- [x] Base de datos con 3 tablas: `macetas`, `lecturas`, `riegos`
- [x] API REST completa con 11 endpoints
- [x] CRUD de macetas (crear, leer, actualizar, eliminar)
- [x] Recepción de datos de sensores (POST /api/sensor-data)
- [x] Control de riego manual (POST /api/riego/:id/activar)
- [x] Historial de lecturas y riegos
- [x] Validación de datos
- [x] Rate limiting (seguridad)
- [x] Manejo de errores
- [x] Variables de entorno configuradas

#### Frontend Web (100%)
- [x] Aplicación React funcionando en puerto 5173
- [x] Dashboard con grid de macetas
- [x] Cards individuales con datos en tiempo real
- [x] Indicadores visuales de humedad (barra de progreso con colores)
- [x] Estados de alerta (Crítico, Bajo, Óptimo, Alto)
- [x] Botón "Regar Ahora" funcional
- [x] Modal de detalles con gráficas (Recharts)
- [x] Gráfica histórica de humedad del suelo
- [x] Gráfica dual de temperatura y humedad ambiente
- [x] Selector de periodo (24h, 7 días, 30 días)
- [x] Historial de riegos recientes
- [x] Auto-actualización cada 30 segundos
- [x] Diseño responsive (mobile, tablet, desktop)
- [x] Manejo de errores de conexión

#### Base de Datos (100%)
- [x] 3 macetas de ejemplo creadas
- [x] Schema completo en Supabase
- [x] Índices optimizados para consultas rápidas

#### Infraestructura (100%)
- [x] Scripts de inicio/detención (./start.sh, ./stop.sh)
- [x] Documentación completa (README, guías)
- [x] Archivo .env configurado

---

## 🎯 FASE 2 - Hardware ESP32 (SIGUIENTE PASO)

### Objetivo: Conectar el hardware físico al sistema

#### 1. Preparación del Hardware (1-2 días)
**Qué necesitas comprar:**
- [ ] ESP32 (38 pines, WiFi)
- [ ] Sensor DHT22 (temperatura/humedad ambiente)
- [ ] Sensor de humedad de suelo capacitivo
- [ ] Módulo relé 5V (1 canal)
- [ ] Mini bomba sumergible 5V
- [ ] Protoboard
- [ ] Cables jumper
- [ ] Fuente USB 5V 2A (o power bank)
- [ ] Manguera pequeña (para bomba)
- [ ] Recipiente para agua

**Costo estimado: $30-50 USD**

#### 2. Montaje del Circuito (2-3 horas)
- [ ] Seguir diagrama en `docs/HARDWARE.md`
- [ ] Conectar DHT22 a GPIO 4
- [ ] Conectar sensor humedad a GPIO 34
- [ ] Conectar relé a GPIO 5
- [ ] Conectar bomba al relé
- [ ] Verificar alimentación (5V para bomba, 3.3V para sensores)

#### 3. Instalación del Firmware (1-2 horas)
- [ ] Instalar Arduino IDE
- [ ] Instalar soporte para ESP32
- [ ] Instalar librerías:
  - DHT sensor library
  - ArduinoJson
  - HTTPClient (incluida)
- [ ] Configurar WiFi en el código
- [ ] Configurar IP del backend (tu Mac)
- [ ] Obtener UUID de maceta desde Supabase
- [ ] Subir código al ESP32

#### 4. Calibración de Sensores (30 min)
- [ ] Calibrar sensor de humedad (aire vs agua)
- [ ] Ajustar rangos en el código
- [ ] Probar lectura de DHT22
- [ ] Verificar que el relé activa correctamente

#### 5. Pruebas Integradas (1 hora)
- [ ] Verificar envío de datos al backend
- [ ] Ver datos aparecer en la webapp
- [ ] Probar riego manual desde la webapp
- [ ] Verificar que la bomba se activa
- [ ] Ajustar tiempos de riego

**RESULTADO:** Sistema IoT completo funcionando end-to-end

---

## 🚀 FASE 3 - Riego Automático Inteligente

### Objetivo: El sistema riega automáticamente cuando detecta humedad baja

#### Backend
- [ ] Crear endpoint para verificar umbrales: GET /api/macetas/:id/check-threshold
- [ ] Agregar lógica: Si humedad < umbral → activar riego
- [ ] Registrar riegos automáticos en BD (tipo: 'automatico')

#### Frontend
- [ ] Agregar toggle "Riego Automático ON/OFF" en cada card
- [ ] Editor de umbral de humedad en modal
- [ ] Indicador visual "Modo automático activo"

#### Firmware ESP32
- [ ] Después de enviar datos, escuchar respuesta del servidor
- [ ] Si respuesta incluye `{"regar": true}`, activar bomba
- [ ] Agregar cooldown (no regar más de 1 vez cada X horas)
- [ ] LED indicador de estado

**RESULTADO:** Sistema 100% automático, intervención humana opcional

---

## 🔔 FASE 4 - Notificaciones y Alertas

### Objetivo: Recibir alertas en tiempo real

#### Opción A: Email (Más fácil)
- [ ] Integrar Nodemailer en backend
- [ ] Enviar email cuando humedad < 20% (crítico)
- [ ] Email al completar riego
- [ ] Resumen diario

#### Opción B: Notificaciones Push
- [ ] Integrar Firebase Cloud Messaging
- [ ] Push notifications en navegador
- [ ] Soporte para mobile

#### Frontend
- [ ] Sistema de notificaciones in-app
- [ ] Centro de notificaciones (campana en header)
- [ ] Configuración de alertas por usuario

**RESULTADO:** Usuario informado sin necesidad de revisar constantemente

---

## 👤 FASE 5 - Multi-Usuario y Autenticación

### Objetivo: Múltiples usuarios pueden gestionar sus propias macetas

#### Backend
- [ ] Integrar Supabase Auth
- [ ] Sistema de sesiones/JWT
- [ ] Middleware de autenticación
- [ ] Asociar macetas a usuarios (user_id en tabla)
- [ ] Row Level Security en Supabase

#### Frontend
- [ ] Pantalla de Login/Registro
- [ ] Gestión de sesión
- [ ] Perfil de usuario
- [ ] Solo ver/controlar tus propias macetas

**RESULTADO:** App lista para producción multi-tenant

---

## 📱 FASE 6 - App Móvil Nativa

### Objetivo: App nativa para iOS y Android

#### Opción A: React Native
- [ ] Reutilizar componentes de React
- [ ] Adaptación móvil del UI
- [ ] Push notifications nativas

#### Opción B: PWA (Más rápido)
- [ ] Convertir webapp actual en PWA
- [ ] Service Worker para offline
- [ ] Installable en móvil
- [ ] Notificaciones push

**RESULTADO:** Control desde cualquier dispositivo

---

## 🤖 FASE 7 - Inteligencia Artificial (Avanzado)

### Objetivo: Predicción y optimización del riego

#### ML/AI Features
- [ ] Modelo de predicción de necesidad de riego
- [ ] Basado en historial + temperatura + humedad ambiente
- [ ] Optimización de horarios de riego
- [ ] Detección de anomalías (sensor desconectado)
- [ ] Recomendaciones personalizadas por tipo de planta

#### Backend
- [ ] Endpoint de predicción: GET /api/macetas/:id/predict
- [ ] Python microservice con TensorFlow/scikit-learn
- [ ] Entrenamiento con datos históricos

**RESULTADO:** Sistema ultra inteligente que aprende

---

## 📊 FASE 8 - Analytics y Reportes

### Objetivo: Insights y análisis de datos

#### Features
- [ ] Dashboard de analytics
- [ ] Consumo de agua por maceta/periodo
- [ ] Tendencias de humedad
- [ ] Comparación entre macetas
- [ ] Exportar reportes (PDF, CSV)
- [ ] Gráficas avanzadas (D3.js o Chart.js)

**RESULTADO:** Tomar decisiones basadas en datos

---

## 🌐 FASE 9 - Deploy a Producción

### Objetivo: Sistema accesible desde internet

#### Backend
- [ ] Deploy en Render.com (gratuito)
- [ ] Variables de entorno en producción
- [ ] HTTPS automático
- [ ] Domain custom (opcional)

#### Frontend
- [ ] Deploy en Vercel (gratuito)
- [ ] Conectar a backend en producción
- [ ] CDN global
- [ ] Domain custom (opcional)

#### Infraestructura
- [ ] Monitoreo (UptimeRobot)
- [ ] Logs centralizados
- [ ] Backups automáticos de BD

**RESULTADO:** Acceso desde cualquier lugar del mundo

---

## 🔧 FASE 10 - Escalabilidad y Mejoras

### Features Avanzadas
- [ ] Soporte para múltiples tipos de plantas (con configs predefinidas)
- [ ] Sistema de "recetas de riego"
- [ ] Integración con sensores adicionales (luz, pH, nutrientes)
- [ ] Control por voz (Alexa, Google Home)
- [ ] Integración con APIs del clima
- [ ] Modo vacaciones (riego programado)
- [ ] Compartir macetas con otros usuarios
- [ ] Red social de jardineros IoT
- [ ] Marketplace de sensores/componentes

---

## 📋 PLAN DE ACCIÓN INMEDIATO (Próximos 7 días)

### Esta Semana - Prioridad Alta

#### Día 1-2: Comprar Hardware
- [ ] Hacer pedido en AliExpress/Amazon/tienda local
- [ ] Mientras llega: Simular más datos en la webapp

#### Día 3-4: Preparar Firmware
- [ ] Instalar Arduino IDE
- [ ] Probar código de ejemplo con LED
- [ ] Familiarizarse con ESP32

#### Día 5-6: Montaje y Testing
- [ ] Armar circuito según diagrama
- [ ] Subir firmware
- [ ] Calibrar sensores
- [ ] Primera prueba de riego

#### Día 7: Integración Completa
- [ ] ESP32 → Backend → Frontend funcionando
- [ ] Probar riego manual desde webapp
- [ ] Documentar el proceso

---

## 🎯 Siguiente Acción AHORA

**Paso 1:** Comprar los componentes de hardware (o confirmar que ya los tienes)

**Paso 2:** Mientras tanto, puedes:

1. **Agregar más macetas desde la webapp:**
   ```bash
   curl -X POST http://localhost:3000/api/macetas \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Maceta Balcón","ubicacion":"Balcón Sur","umbral_humedad":35}'
   ```

2. **Simular datos de sensores para probar gráficas:**
   ```bash
   # Script para generar datos aleatorios cada minuto
   # Crea archivo: simulate-data.sh
   ```

3. **Personalizar el frontend:**
   - Cambiar colores en `frontend/tailwind.config.js`
   - Ajustar umbrales de alerta en `MacetaCard.jsx`
   - Agregar tu logo/nombre

4. **Explorar Supabase:**
   - Ver datos en Table Editor
   - Probar SQL queries personalizadas
   - Configurar backups automáticos

---

## 📞 ¿Qué Prefieres Hacer Primero?

A) **Hardware:** Comprar componentes y empezar con ESP32
B) **Software:** Agregar riego automático antes del hardware
C) **Deploy:** Subir a producción para acceder desde internet
D) **Features:** Notificaciones, multi-usuario, etc.
E) **Otro:** Dime qué funcionalidad específica necesitas

---

**ESTADO ACTUAL:** 🟢 MVP Software funcionando al 100%
**PRÓXIMO HITO:** 🔧 Integración con hardware ESP32
**TIEMPO ESTIMADO:** 1-2 semanas hasta sistema completo

¿Con cuál fase quieres continuar?
