# 🔌 Guía de Conexión Hardware - ESP32

## Componentes Necesarios

### Por cada maceta:
- 1x ESP32 (38 pines, con WiFi)
- 1x Sensor DHT22 (temperatura y humedad ambiente)
- 1x Sensor de humedad de suelo capacitivo
- 1x Módulo relé 5V (1 canal)
- 1x Mini bomba de agua sumergible 5V
- 1x Protoboard
- Cables jumper macho-macho y macho-hembra
- 1x Fuente USB 5V (2A recomendado) o power bank

## Diagrama de Conexión

```
┌─────────────────────────────────────────────────────┐
│                     ESP32                           │
│  (Vista superior - pines hacia arriba)              │
└─────────────────────────────────────────────────────┘
     │         │         │         │         │
     │         │         │         │         │
  GPIO4     GPIO34    GPIO5     3.3V       GND
     │         │         │         │         │
     ↓         ↓         ↓         ↓         ↓
  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
  │DHT22 │  │Sensor│  │ Relé │  │ VCC  │  │ GND  │
  │ DATA │  │  OUT │  │  IN  │  │      │  │      │
  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘
```

## Conexiones Detalladas

### 1. Sensor DHT22 (Temperatura y Humedad Ambiente)

| DHT22 Pin | → | ESP32 Pin | Cable Sugerido |
|-----------|---|-----------|----------------|
| VCC (+)   | → | 3.3V      | Rojo           |
| DATA      | → | GPIO 4    | Amarillo       |
| GND (-)   | → | GND       | Negro          |

**Notas:**
- El DHT22 puede funcionar con 3.3V o 5V
- Usa 3.3V para mayor compatibilidad con ESP32
- Opcional: Resistencia pull-up de 10kΩ entre DATA y VCC

### 2. Sensor de Humedad de Suelo Capacitivo

| Sensor Pin | → | ESP32 Pin | Cable Sugerido |
|------------|---|-----------|----------------|
| VCC (+)    | → | 3.3V      | Rojo           |
| GND (-)    | → | GND       | Negro          |
| AOUT       | → | GPIO 34   | Verde          |

**Notas:**
- GPIO 34 es un pin ADC (analógico)
- Rango de lectura: 0-4095 (12 bits)
- El sensor debe estar insertado en la tierra de la maceta
- **¡No sumergir en agua!** Solo para tierra/sustrato

### 3. Módulo Relé 5V

| Relé Pin   | → | Conexión    | Cable Sugerido |
|------------|---|-------------|----------------|
| VCC (+)    | → | 5V (VIN)    | Rojo           |
| GND (-)    | → | GND         | Negro          |
| IN (señal) | → | GPIO 5      | Naranja        |

**Notas:**
- Usa 5V del pin VIN del ESP32
- GPIO 5 controla el relé (HIGH = encendido)
- El relé aísla eléctricamente el ESP32 de la bomba

### 4. Bomba de Agua 5V

```
┌──────────────────┐
│  Módulo Relé     │
│                  │
│  COM ─────────┐  │
│  NO ──────────┼──┼─→ Bomba (+) Cable Rojo
│  NC (vacío)   │  │
└───────────────┼──┘
                │
                └────→ 5V Power Supply

Bomba (-) Cable Negro ──→ GND Power Supply
```

**Notas:**
- La bomba NO se conecta directamente al ESP32
- Usa fuente de alimentación externa (5V 2A)
- COM = Común (conecta a 5V de la fuente)
- NO = Normalmente Abierto (conecta a bomba +)
- NC = Normalmente Cerrado (no usar)

## Esquema Visual Completo

```
┌─────────────────────────────────────────────────────┐
│                   ESP32 (38 pines)                  │
│                                                     │
│  3.3V ──┬─→ DHT22 VCC                              │
│         └─→ Sensor Humedad VCC                      │
│                                                     │
│  GND ───┬─→ DHT22 GND                               │
│         ├─→ Sensor Humedad GND                      │
│         └─→ Relé GND                                │
│                                                     │
│  GPIO 4  ───→ DHT22 DATA                            │
│  GPIO 34 ───→ Sensor Humedad AOUT                   │
│  GPIO 5  ───→ Relé IN                               │
│                                                     │
│  VIN (5V) ──→ Relé VCC                              │
└─────────────────────────────────────────────────────┘
                  │
                  ↓
       ┌──────────────────┐
       │  Módulo Relé 5V  │
       │                  │
       │  COM ←─── 5V Fuente Externa
       │  NO  ───→ Bomba (+)
       │  NC  (vacío)
       └──────────────────┘
                  │
                  ↓
       ┌──────────────────┐
       │  Bomba 5V        │
       │  (+) ←─── Relé NO
       │  (-) ───→ GND Fuente
       └──────────────────┘
```

## Alimentación

### Opción 1: Power Bank USB (Desarrollo)
- Conecta ESP32 al power bank vía cable USB-C
- Conecta bomba + relé a segunda salida USB con adaptador

### Opción 2: Fuente 5V 2A (Producción)
- Terminal (+) → VIN del ESP32 y COM del relé
- Terminal (-) → GND del ESP32 y bomba (-)

### Opción 3: Dos Fuentes Separadas (Más Seguro)
- Fuente 1 (5V 1A): Solo para ESP32 vía USB
- Fuente 2 (5V 2A): Para relé + bomba
- **¡Conectar GND común entre ambas!**

## Precauciones Importantes

### ⚠️ Seguridad Eléctrica
1. **NUNCA conectar la bomba directamente al ESP32** - Siempre usar relé
2. Verificar todas las conexiones antes de dar energía
3. El relé debe ser de 5V (no usar relés de 12V o más)
4. Aislar conexiones de agua/humedad

### 💧 Seguridad con Agua
1. Mantener ESP32, relé y conexiones **alejados del agua**
2. Solo el sensor de humedad y la bomba deben estar cerca del agua
3. Usar contenedor impermeable para ESP32 si está en exterior
4. Verificar que el recipiente de agua tiene suficiente nivel

### 🔋 Consumo de Corriente
- ESP32: ~200mA (WiFi activo)
- DHT22: ~2.5mA
- Sensor humedad: ~5mA
- Relé: ~70mA (bobina)
- **Bomba: 200-400mA** ← Mayor consumidor

**Total estimado: ~700mA** → Usar fuente de al menos 1.5A

## Calibración de Sensores

### Sensor de Humedad del Suelo

1. **Lectura en aire (seco):**
   ```cpp
   int valor_seco = analogRead(34);
   // Típicamente: ~3000-4095
   ```

2. **Lectura en agua (mojado):**
   ```cpp
   int valor_mojado = analogRead(34);
   // Típicamente: ~1000-1500
   ```

3. **Mapear a porcentaje:**
   ```cpp
   int humedad = map(lectura, valor_mojado, valor_seco, 100, 0);
   humedad = constrain(humedad, 0, 100);
   ```

### Sensor DHT22

- **Rango temperatura:** -40°C a 80°C (±0.5°C precisión)
- **Rango humedad:** 0% a 100% (±2% precisión)
- Leer cada 2 segundos mínimo (limitación del sensor)

## Testing de Hardware

### Test 1: Verificar Sensor DHT22

```cpp
#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  Serial.print("Temp: ");
  Serial.print(temp);
  Serial.print("°C | Humedad: ");
  Serial.print(hum);
  Serial.println("%");
  
  delay(2000);
}
```

### Test 2: Verificar Sensor de Humedad

```cpp
void setup() {
  Serial.begin(115200);
}

void loop() {
  int valor = analogRead(34);
  Serial.print("Valor analógico: ");
  Serial.println(valor);
  delay(500);
}
```

### Test 3: Verificar Relé y Bomba

```cpp
#define RELAY_PIN 5

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Relé apagado
}

void loop() {
  Serial.println("Bomba ON");
  digitalWrite(RELAY_PIN, HIGH);
  delay(3000);
  
  Serial.println("Bomba OFF");
  digitalWrite(RELAY_PIN, LOW);
  delay(7000);
}
```

## Troubleshooting Hardware

### Problema: DHT22 devuelve NaN
- ✓ Verificar conexiones (VCC, GND, DATA)
- ✓ Agregar delay de 2s entre lecturas
- ✓ Agregar resistencia pull-up de 10kΩ
- ✓ Verificar que el sensor no está dañado

### Problema: Sensor de humedad siempre 0% o 100%
- ✓ Calibrar valores seco/mojado
- ✓ Verificar que está en GPIO 34 (ADC1)
- ✓ No usar GPIO 25-27 (ocupados por WiFi)
- ✓ Insertar sensor al menos 5cm en tierra

### Problema: Relé no activa
- ✓ Verificar que VCC del relé está en 5V (no 3.3V)
- ✓ Verificar GPIO 5 con LED de prueba
- ✓ Algunos relés son activados con LOW en vez de HIGH

### Problema: Bomba no funciona
- ✓ Verificar alimentación (5V con suficiente corriente)
- ✓ Probar bomba directamente con 5V
- ✓ Verificar conexión COM-NO del relé
- ✓ Escuchar "click" del relé al activar

## Fotos de Referencia (Descripción)

### Montaje en Protoboard
1. ESP32 en el centro de la protoboard
2. Sensores a la izquierda
3. Relé a la derecha
4. Fuente de alimentación externa para bomba
5. Cables organizados por colores

### Instalación en Maceta
1. Sensor de humedad insertado en tierra (no tocar maceta)
2. DHT22 cerca de la planta pero no cubierto
3. Bomba sumergida en recipiente de agua
4. Manguera desde bomba hasta base de la planta
5. ESP32 y relé en caja impermeable fuera de la maceta

## Lista de Compras

| Componente | Cantidad | Precio Aprox (USD) |
|------------|----------|-------------------|
| ESP32 38 pines | 1 | $8-12 |
| DHT22 | 1 | $3-5 |
| Sensor humedad capacitivo | 1 | $2-4 |
| Módulo relé 5V | 1 | $1-3 |
| Bomba sumergible 5V | 1 | $3-6 |
| Protoboard | 1 | $2-4 |
| Cables jumper (pack) | 1 | $3-5 |
| Fuente 5V 2A | 1 | $5-8 |
| **Total por maceta** | | **~$30-50** |

## Próximos Pasos

1. ✓ Armar el circuito siguiendo este diagrama
2. ✓ Probar cada componente individualmente
3. ✓ Cargar el firmware completo (próximamente en `/firmware`)
4. ✓ Conectar a WiFi y probar envío de datos al backend
5. ✓ Calibrar sensores para tu tipo de tierra
6. ✓ Ajustar tiempos de riego según tu planta

---

¿Dudas sobre las conexiones? Abre un issue en el repositorio.
