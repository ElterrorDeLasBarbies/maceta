# Firmware ESP32 - Sistema de Riego Inteligente

Código Arduino para ESP32 que lee sensores y se comunica con el backend.

## 🔧 Librerías Requeridas

Instala desde el Library Manager de Arduino IDE:

1. **DHT sensor library** by Adafruit
2. **Adafruit Unified Sensor**
3. **ArduinoJson** by Benoit Blanchon

## ⚙️ Configuración

Edita el archivo `maceta_iot.ino` y modifica:

```cpp
// WiFi
const char* WIFI_SSID = "TU_WIFI_AQUI";
const char* WIFI_PASSWORD = "TU_PASSWORD_AQUI";

// API Backend
const char* API_URL = "http://192.168.1.100:3000/api"; // Cambia la IP
const char* MACETA_ID = "uuid-de-tu-maceta"; // Desde Supabase
```

## 📤 Subir el Código

1. Abre Arduino IDE
2. Instala soporte para ESP32:
   - File → Preferences
   - Additional Boards Manager URLs: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Tools → Board → Boards Manager → Buscar "ESP32" → Install
3. Selecciona tu placa: Tools → Board → ESP32 Arduino → ESP32 Dev Module
4. Conecta el ESP32 vía USB
5. Selecciona el puerto: Tools → Port
6. Click en Upload (→)

## 🔍 Debugging

Abre el Serial Monitor (Tools → Serial Monitor) a 115200 baud para ver los logs.

## 📋 Próximos Pasos

1. Conectar el hardware según `docs/HARDWARE.md`
2. Calibrar sensores
3. Probar riego manual
4. Implementar riego automático por umbral

## ⚠️ Estado

**NOTA:** Este es código de plantilla. Requiere testing con hardware real.

Funcionalidades implementadas:
- ✅ Conexión WiFi
- ✅ Lectura de sensores
- ✅ Envío de datos al backend
- ⏳ Riego automático (pendiente)
- ⏳ Comandos desde servidor (pendiente)
