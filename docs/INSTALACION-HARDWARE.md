# 🔧 PLAN DE ACCIÓN - Integración Hardware ESP32

## ✅ TIENES LOS COMPONENTES - Vamos a conectarlos!

---

## 📋 FASE 1: PREPARACIÓN (15 minutos)

### Paso 1.1: Verificar Componentes
Coloca sobre tu mesa y verifica que tienes:

- [ ] ESP32 (38 pines)
- [ ] Sensor DHT22
- [ ] Sensor de humedad de suelo capacitivo
- [ ] Módulo relé 5V
- [ ] Mini bomba sumergible 5V
- [ ] Protoboard
- [ ] Cables jumper (varios colores)
- [ ] Cable USB (para ESP32)
- [ ] Fuente 5V o power bank
- [ ] Recipiente con agua para la bomba
- [ ] Maceta con tierra

### Paso 1.2: Instalar Arduino IDE
```bash
# Si no lo tienes instalado:
# 1. Descargar de: https://www.arduino.cc/en/software
# 2. Instalar la aplicación

# O con Homebrew:
brew install --cask arduino
```

### Paso 1.3: Configurar Arduino IDE para ESP32

**Abrir Arduino IDE y seguir estos pasos:**

1. **Arduino → Preferences** (Cmd + ,)
2. En "Additional Boards Manager URLs" pegar:
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Click "OK"
4. **Tools → Board → Boards Manager**
5. Buscar "ESP32"
6. Instalar "esp32 by Espressif Systems"
7. Esperar a que termine (puede tardar 2-3 minutos)

### Paso 1.4: Instalar Librerías Necesarias

**Tools → Manage Libraries** (Ctrl/Cmd + Shift + I)

Buscar e instalar:
- [ ] **DHT sensor library** by Adafruit (versión más reciente)
- [ ] **Adafruit Unified Sensor** (se instala automáticamente con DHT)
- [ ] **ArduinoJson** by Benoit Blanchon (versión 6.x)

---

## 🔌 FASE 2: MONTAJE DEL CIRCUITO (30 minutos)

### Diagrama de Conexiones

```
ESP32                          Componente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pin 3.3V  ───────────────────→ DHT22 VCC
Pin 3.3V  ───────────────────→ Sensor Humedad VCC

Pin GPIO 4  ─────────────────→ DHT22 DATA

Pin GPIO 34 ─────────────────→ Sensor Humedad OUT (analógico)

Pin GPIO 5  ─────────────────→ Relé IN

Pin VIN (5V) ────────────────→ Relé VCC

Pin GND  ────┬───────────────→ DHT22 GND
             ├───────────────→ Sensor Humedad GND
             └───────────────→ Relé GND
```

### Paso 2.1: Conectar DHT22

**Orientación:** DHT22 con la rejilla de frente hacia ti

```
┌─────────────┐
│  ▓▓▓▓▓▓▓▓▓  │  <- Rejilla
│             │
│  1  2  3  4 │  <- Pines
└─────────────┘
```

- Pin 1 (izquierdo) → **3.3V** del ESP32 (cable ROJO)
- Pin 2 → **GPIO 4** del ESP32 (cable AMARILLO)
- Pin 3 → No conectar
- Pin 4 (derecho) → **GND** del ESP32 (cable NEGRO)

### Paso 2.2: Conectar Sensor de Humedad

El sensor tiene 3 pines marcados:
- **VCC** → **3.3V** del ESP32 (cable ROJO)
- **GND** → **GND** del ESP32 (cable NEGRO)
- **AOUT** → **GPIO 34** del ESP32 (cable VERDE)

⚠️ **IMPORTANTE:** Insertar la parte larga del sensor en la tierra, NO sumergir completamente

### Paso 2.3: Conectar Relé

El módulo relé tiene 3 pines en un lado:
- **VCC** → **VIN (5V)** del ESP32 (cable ROJO)
- **GND** → **GND** del ESP32 (cable NEGRO)
- **IN** → **GPIO 5** del ESP32 (cable NARANJA)

### Paso 2.4: Conectar Bomba al Relé

El relé tiene 3 terminales en el otro lado:
```
COM  ─────→  5V de fuente externa (o power bank)
NO   ─────→  Cable ROJO (+) de la bomba
NC   ─────→  (dejar vacío)
```

Cable NEGRO (-) de la bomba → **GND de la fuente externa**

⚠️ **IMPORTANTE:** La bomba NO se conecta al ESP32, solo al relé

### Paso 2.5: Verificación Visual

Antes de dar energía, verifica:
- [ ] No hay cables cruzados
- [ ] 3.3V no toca GND
- [ ] Bomba está en recipiente con agua
- [ ] Sensor de humedad está en tierra (no en agua)
- [ ] Relé tiene alimentación de 5V

---

## 💻 FASE 3: CONFIGURAR Y SUBIR FIRMWARE (20 minutos)

### Paso 3.1: Obtener ID de Maceta

Abre una terminal:

```bash
# Listar tus macetas
curl http://localhost:3000/api/macetas | jq
```

Copia el **"id"** de la maceta que vas a monitorear (es un UUID largo)

### Paso 3.2: Obtener IP de tu Mac

```bash
# En macOS:
ipconfig getifaddr en0

# O si estás en WiFi:
ipconfig getifaddr en1
```

Anota la IP (ejemplo: 192.168.1.100)

### Paso 3.3: Editar el Firmware

Abre en Arduino IDE:
```
/Users/tomassubiabre/Desktop/maceta/firmware/maceta_iot/maceta_iot.ino
```

Editar estas líneas (cerca del inicio):

```cpp
// WiFi - CAMBIAR ESTOS VALORES
const char* WIFI_SSID = "TU_WIFI_AQUI";        // ← Tu red WiFi
const char* WIFI_PASSWORD = "TU_PASSWORD_AQUI"; // ← Tu contraseña

// API Backend - CAMBIAR IP
const char* API_URL = "http://192.168.1.100:3000/api"; // ← IP de tu Mac

// CAMBIAR UUID
const char* MACETA_ID = "uuid-de-tu-maceta"; // ← UUID copiado en Paso 3.1
```

### Paso 3.4: Conectar ESP32 a tu Mac

1. Conectar ESP32 con cable USB-C
2. En Arduino IDE:
   - **Tools → Board → ESP32 Arduino → ESP32 Dev Module**
   - **Tools → Port → /dev/cu.usbserial-XXXX** (el que aparezca)
   - **Tools → Upload Speed → 115200**

### Paso 3.5: Compilar y Subir

1. Click en **Verify** (✓) - debe compilar sin errores
2. Click en **Upload** (→)
3. Esperar barra de progreso (30-60 segundos)
4. Mensaje: "Hard resetting via RTS pin..."

✅ ¡Código subido!

---

## 🧪 FASE 4: TESTING Y CALIBRACIÓN (30 minutos)

### Paso 4.1: Abrir Serial Monitor

**Tools → Serial Monitor** (o Ctrl/Cmd + Shift + M)

Configurar baudios: **115200** (abajo a la derecha)

Deberías ver:

```
=================================
🌱 Sistema de Riego Inteligente
=================================

✓ DHT22 inicializado
Conectando a WiFi: TU_WIFI
....
✓ WiFi conectado
IP: 192.168.0.123

✓ Sistema listo
```

### Paso 4.2: Verificar Lecturas

Cada 5 minutos (o presiona el botón RESET del ESP32) verás:

```
--- Leyendo sensores ---
  Humedad suelo: 45.5% (raw: 2345)
  Temperatura: 23.2°C
  Humedad ambiente: 65.8%
POST http://192.168.1.100:3000/api/sensor-data
HTTP Response: 201
✓ Datos enviados exitosamente
```

### Paso 4.3: Verificar en Frontend

1. Abre navegador: **http://localhost:5173**
2. Busca tu maceta
3. Deberías ver los datos actualizados
4. ¡Los números cambian en tiempo real!

### Paso 4.4: Calibrar Sensor de Humedad

**Test en AIRE (seco):**
1. Sacar sensor de la tierra
2. Ver valor en Serial Monitor: `(raw: XXXX)`
3. Anotar ese número (ej: 3200)

**Test en AGUA (mojado):**
1. Sumergir sensor en agua
2. Ver valor: `(raw: XXXX)`
3. Anotar ese número (ej: 1400)

**Actualizar firmware:**
```cpp
// Ajustar estos valores con los tuyos:
#define SOIL_DRY 3200  // ← Tu valor en aire
#define SOIL_WET 1400  // ← Tu valor en agua
```

Volver a subir el código (Upload)

### Paso 4.5: Probar Riego Manual

**Desde la Webapp:**
1. Click en "Regar Ahora" en tu maceta
2. Deberías escuchar el **CLICK del relé**
3. La **bomba se activa** por 5 segundos
4. Se detiene automáticamente
5. En Serial Monitor verás:
   ```
   💧 Activando riego...
   ✓ Riego completado
   ```

⚠️ **Si la bomba NO activa:**
- Verificar que la bomba está sumergida
- Verificar conexión COM-NO del relé
- Probar conectar bomba directamente a 5V para verificar que funciona

---

## 🎉 FASE 5: SISTEMA FUNCIONANDO (5 minutos)

### ✅ Checklist Final

- [ ] ESP32 conectado y con luz LED encendida
- [ ] WiFi conectado (ver IP en Serial Monitor)
- [ ] Sensores enviando datos cada 5 minutos
- [ ] Frontend mostrando datos en tiempo real
- [ ] Botón "Regar Ahora" activa la bomba
- [ ] Bomba riega correctamente

### 🎊 ¡FELICITACIONES!

Ahora tienes un **sistema IoT completo funcionando**:
- Sensores físicos leyendo datos reales
- Backend procesando y almacenando
- Frontend mostrando en tiempo real
- Control remoto desde webapp

---

## 🐛 TROUBLESHOOTING

### Problema: ESP32 no conecta a WiFi
```
✗ Timeout de conexión WiFi
```
**Solución:**
- Verificar SSID y contraseña (mayúsculas/minúsculas)
- Verificar que tu Mac y ESP32 están en la misma red
- Algunos ESP32 solo funcionan en WiFi 2.4GHz (no 5GHz)

### Problema: Error al compilar
```
error: 'DHT' does not name a type
```
**Solución:**
- Instalar librería DHT sensor library
- Reiniciar Arduino IDE

### Problema: No encuentra puerto
**Solución:**
- Instalar driver CH340/CP2102 para ESP32
- Descargar de: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

### Problema: Sensor de humedad siempre 0% o 100%
**Solución:**
- Calibrar valores SOIL_DRY y SOIL_WET
- Verificar que está conectado a GPIO 34 (ADC)
- Insertar al menos 5cm en tierra

### Problema: Relé no activa
**Solución:**
- Verificar que VCC del relé está en 5V (no 3.3V)
- Algunos relés se activan con LOW en vez de HIGH
- Cambiar en código: `digitalWrite(RELAY_PIN, LOW);`

### Problema: Backend no recibe datos
```
✗ Error en POST: Connection refused
```
**Solución:**
- Verificar que backend está corriendo: `./start.sh`
- Verificar IP de tu Mac en el código
- Hacer ping desde otra terminal: `ping 192.168.1.100`

---

## 📊 SIGUIENTE PASO: RIEGO AUTOMÁTICO

Una vez que todo funcione, podemos agregar:

1. **Riego automático por umbral**
   - Si humedad < 30% → regar automáticamente
   - Cooldown de 6 horas entre riegos

2. **Notificaciones**
   - Email cuando humedad crítica
   - Email al completar riego

3. **Optimizaciones**
   - Deep sleep del ESP32 (ahorro de batería)
   - Buffer local si pierde WiFi

¿Listo para empezar? **¡Manos a la obra!** 🚀

Cuéntame cuando termines cada fase y te ayudo con lo que necesites.
