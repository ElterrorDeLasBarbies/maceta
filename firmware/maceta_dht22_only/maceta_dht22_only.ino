/*
 * Sistema de Riego Inteligente - Solo DHT22
 * Lee temperatura y humedad ambiente
 */

#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ======================================
// CONFIGURACIÓN WiFi
// ======================================
const char* WIFI_SSID = "CATHERINE";        // ← Cambia esto
const char* WIFI_PASSWORD = "4533865a"; // ← Cambia esto

// ======================================
// CONFIGURACIÓN Backend
// ======================================
// 🚀 PRODUCCIÓN - Render Cloud
const char* API_URL = "https://maceta-pro.onrender.com/api/sensor-data";

// 🏠 LOCAL (descomenta para desarrollo local)
// const char* API_URL = "http://192.168.5.12:3000/api/sensor-data";

const char* MACETA_ID = "e74bd846-59e4-4f7b-aa4d-5478dd8c31fd"; // Maceta 1 - Sala

// ======================================
// CONFIGURACIÓN DHT22
// ======================================
#define DHT_PIN 26
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// ======================================
// CONFIGURACIÓN Tiempos
// ======================================
const unsigned long INTERVALO_LECTURA = 30000; // 30 segundos
unsigned long ultimaLectura = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=====================================");
  Serial.println("🌱 Sistema de Riego Inteligente");
  Serial.println("   Solo DHT22 - Temperatura y Humedad");
  Serial.println("=====================================\n");
  
  // Inicializar DHT22
  dht.begin();
  Serial.println("✓ DHT22 inicializado en GPIO 26\n");
  
  // Conectar WiFi
  conectarWiFi();
}

void loop() {
  // Verificar conexión WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi desconectado. Reconectando...");
    conectarWiFi();
  }
  
  // Leer sensores cada intervalo
  if (millis() - ultimaLectura >= INTERVALO_LECTURA) {
    ultimaLectura = millis();
    leerYEnviarDatos();
  }
  
  delay(100);
}

// ======================================
// FUNCIÓN: Conectar WiFi
// ======================================
void conectarWiFi() {
  Serial.print("🔌 Conectando a WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi conectado!");
    Serial.print("📡 IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("📶 Señal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm\n");
  } else {
    Serial.println("\n❌ No se pudo conectar a WiFi");
    Serial.println("⚠️  Continuando sin conexión...\n");
  }
}

// ======================================
// FUNCIÓN: Leer DHT22 y enviar datos
// ======================================
void leerYEnviarDatos() {
  Serial.println("═════════════════════════════════════");
  Serial.println("📊 Leyendo sensores...");
  
  // Leer DHT22
  float temperatura = dht.readTemperature();
  float humedad_ambiente = dht.readHumidity();
  
  // Verificar si las lecturas son válidas
  if (isnan(temperatura) || isnan(humedad_ambiente)) {
    Serial.println("❌ Error leyendo DHT22");
    Serial.println("   Verifica las conexiones");
    Serial.println("═════════════════════════════════════\n");
    return;
  }
  
  // Mostrar datos
  Serial.println("\n📈 DATOS LEÍDOS:");
  Serial.print("   🌡️  Temperatura: ");
  Serial.print(temperatura, 1);
  Serial.println(" °C");
  
  Serial.print("   💨 Humedad Ambiente: ");
  Serial.print(humedad_ambiente, 1);
  Serial.println(" %");
  
  // Interpretación
  if (temperatura < 15) {
    Serial.println("   → ❄️  Ambiente frío");
  } else if (temperatura < 25) {
    Serial.println("   → ✅ Temperatura agradable");
  } else if (temperatura < 30) {
    Serial.println("   → 🔥 Ambiente caluroso");
  } else {
    Serial.println("   → 🔥🔥 Ambiente muy caluroso");
  }
  
  if (humedad_ambiente < 30) {
    Serial.println("   → 🏜️  Ambiente seco");
  } else if (humedad_ambiente < 60) {
    Serial.println("   → ✅ Humedad normal");
  } else {
    Serial.println("   → 💦 Ambiente húmedo");
  }
  
  // Enviar al backend si hay WiFi
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n📤 Enviando datos al servidor...");
    enviarDatosBackend(temperatura, humedad_ambiente);
  } else {
    Serial.println("\n⚠️  Sin WiFi - Datos no enviados");
  }
  
  Serial.println("═════════════════════════════════════\n");
}

// ======================================
// FUNCIÓN: Enviar datos al backend
// ======================================
void enviarDatosBackend(float temperatura, float humedad_ambiente) {
  HTTPClient http;
  
  // Crear JSON
  StaticJsonDocument<200> doc;
  doc["maceta_id"] = MACETA_ID;
  doc["temperatura"] = temperatura;
  doc["humedad_ambiente"] = humedad_ambiente;
  doc["humedad_suelo"] = 50; // Valor fijo temporal (sin sensor)
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Enviar POST
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(jsonString);
  
  if (httpCode > 0) {
    if (httpCode == 200 || httpCode == 201) {
      Serial.println("✅ Datos enviados correctamente");
      Serial.print("   Código: ");
      Serial.println(httpCode);
    } else {
      Serial.print("⚠️  Respuesta inesperada: ");
      Serial.println(httpCode);
    }
  } else {
    Serial.print("❌ Error en el envío: ");
    Serial.println(http.errorToString(httpCode));
  }
  
  http.end();
}
