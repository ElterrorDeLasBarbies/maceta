/*
 * PRUEBA SIMPLE - Sensor DHT22
 * Lee temperatura y humedad ambiente
 */

#include <DHT.h>

// Pin donde está conectado el DHT22
#define DHT_PIN 26  // GPIO 26 (como en el tutorial)
#define DHT_TYPE DHT22

// Crear objeto DHT
DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  // Iniciar comunicación serial
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("=================================");
  Serial.println("🌡️  Prueba Sensor DHT22");
  Serial.println("=================================\n");
  
  // Configurar pin DATA como entrada con pull-up
  pinMode(DHT_PIN, INPUT_PULLUP);
  
  Serial.println("✓ Pin configurado: GPIO 26");
  Serial.println("✓ Debe estar conectado a pin OUT del DHT22\n");
  
  // Inicializar DHT22
  dht.begin();
  
  Serial.println("✓ Sistema iniciado");
  Serial.println("Leyendo sensor cada 3 segundos...\n");
  
  Serial.println("IMPORTANTE:");
  Serial.println("- Pin + DHT22 (izquierda)  → 3.3V ESP32");
  Serial.println("- Pin OUT DHT22 (medio)    → GPIO 26 ESP32");
  Serial.println("- Pin - DHT22 (derecha)    → GND ESP32\n");
}

void loop() {
  // Leer temperatura y humedad
  float temperatura = dht.readTemperature();
  float humedad = dht.readHumidity();
  
  // Verificar si las lecturas son válidas
  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("❌ Error leyendo DHT22");
    Serial.println("   - Verifica que está conectado a GPIO 26");
    Serial.println("   - Verifica VCC (3.3V) y GND");
    Serial.println("");
  } else {
    // Mostrar resultados
    Serial.println("─────────────────────────────");
    
    Serial.print("🌡️  Temperatura: ");
    Serial.print(temperatura, 1);
    Serial.println(" °C");
    
    Serial.print("💧 Humedad Ambiente: ");
    Serial.print(humedad, 1);
    Serial.println(" %");
    
    // Indicadores
    if (temperatura < 15) {
      Serial.println("   ❄️  Frío");
    } else if (temperatura < 25) {
      Serial.println("   ✅ Temperatura agradable");
    } else if (temperatura < 30) {
      Serial.println("   🔥 Caluroso");
    } else {
      Serial.println("   🔥🔥 Muy caluroso");
    }
    
    if (humedad < 30) {
      Serial.println("   🏜️  Ambiente seco");
    } else if (humedad < 60) {
      Serial.println("   ✅ Humedad normal");
    } else {
      Serial.println("   💦 Ambiente húmedo");
    }
    
    Serial.println("─────────────────────────────\n");
  }
  
  // Esperar 3 segundos (DHT22 necesita al menos 2 segundos entre lecturas)
  delay(3000);
}
