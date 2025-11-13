/*
 * PRUEBA - DHT22 + Sensor Humedad Suelo
 * Lee temperatura, humedad ambiente y humedad del suelo
 */

#include <DHT.h>

// Pines de los sensores
#define DHT_PIN 26        // DHT22 conectado a GPIO 26
#define SOIL_PIN 34       // Sensor de humedad del suelo en GPIO 34
#define DHT_TYPE DHT22

// Crear objeto DHT
DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  // Iniciar comunicación serial
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("=====================================");
  Serial.println("🌱 Sistema de Riego Inteligente");
  Serial.println("=====================================\n");
  
  // Inicializar DHT22
  dht.begin();
  
  Serial.println("✓ DHT22 inicializado (GPIO 26)");
  Serial.println("✓ Sensor suelo configurado (GPIO 34)\n");
  
  Serial.println("Conexiones:");
  Serial.println("DHT22:");
  Serial.println("  + → 3.3V");
  Serial.println("  OUT → GPIO 26");
  Serial.println("  - → GND");
  Serial.println("\nSensor Suelo:");
  Serial.println("  VCC → 3.3V");
  Serial.println("  AOUT → GPIO 34");
  Serial.println("  GND → GND\n");
  
  Serial.println("Leyendo sensores cada 3 segundos...\n");
}

void loop() {
  // Leer DHT22
  float temperatura = dht.readTemperature();
  float humedad_ambiente = dht.readHumidity();
  
  // Leer sensor de humedad del suelo
  int valor_suelo_raw = analogRead(SOIL_PIN);
  
  // Mostrar separador
  Serial.println("═════════════════════════════════════");
  
  // Temperatura y humedad ambiente
  if (isnan(temperatura) || isnan(humedad_ambiente)) {
    Serial.println("❌ Error leyendo DHT22");
  } else {
    Serial.print("🌡️  Temperatura: ");
    Serial.print(temperatura, 1);
    Serial.println(" °C");
    
    Serial.print("💨 Humedad Ambiente: ");
    Serial.print(humedad_ambiente, 1);
    Serial.println(" %");
    
    // Indicador temperatura
    if (temperatura < 15) {
      Serial.println("    → ❄️  Frío");
    } else if (temperatura < 25) {
      Serial.println("    → ✅ Temperatura agradable");
    } else if (temperatura < 30) {
      Serial.println("    → 🔥 Caluroso");
    } else {
      Serial.println("    → 🔥🔥 Muy caluroso");
    }
  }
  
  Serial.println("─────────────────────────────────────");
  
  // Humedad del suelo
  Serial.print("🌱 Humedad Suelo (RAW): ");
  Serial.println(valor_suelo_raw);
  
  // Interpretación (valores aproximados, hay que calibrar)
  if (valor_suelo_raw > 3000) {
    Serial.println("    → 🟤 MUY SECO (en aire o sin sensor)");
  } else if (valor_suelo_raw > 2500) {
    Serial.println("    → 🟡 SECO (necesita riego)");
  } else if (valor_suelo_raw > 1500) {
    Serial.println("    → 🟢 HÚMEDO (bien)");
  } else if (valor_suelo_raw > 500) {
    Serial.println("    → 💧 MUY HÚMEDO");
  } else {
    Serial.println("    → 💦 EN AGUA o sensor desconectado");
  }
  
  Serial.println("═════════════════════════════════════\n");
  
  // Esperar 3 segundos
  delay(3000);
}
