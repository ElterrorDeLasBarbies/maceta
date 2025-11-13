/*
 * Sistema de Riego Inteligente IoT - Firmware ESP32
 * 
 * Hardware:
 * - ESP32 (38 pines)
 * - DHT22 (GPIO 4)
 * - Sensor Humedad Capacitivo (GPIO 34)
 * - Relé (GPIO 5)
 * 
 * Autor: Tomás Subiabre
 * Versión: 1.0.0
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ==================== CONFIGURACIÓN ====================

// WiFi - CONFIGURA TU RED AQUÍ
const char* WIFI_SSID = "TU_WIFI_AQUI";        // ← CAMBIAR por tu WiFi
const char* WIFI_PASSWORD = "TU_PASSWORD_AQUI"; // ← CAMBIAR por tu contraseña

// API Backend - YA CONFIGURADO
const char* API_URL = "http://192.168.5.12:3000/api";
const char* MACETA_ID = "e74bd846-59e4-4f7b-aa4d-5478dd8c31fd"; // Maceta 1 (Sala)

// Pines
#define DHT_PIN 4           // GPIO 4 - DHT22
#define SOIL_SENSOR_PIN 34  // GPIO 34 - Sensor humedad (ADC)
#define RELAY_PIN 5         // GPIO 5 - Relé (bomba)

// Configuración sensores
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// Calibración sensor de humedad (ajustar según tu sensor)
#define SOIL_DRY 3000      // Valor en aire (seco)
#define SOIL_WET 1300      // Valor en agua (mojado)

// Tiempos
#define READING_INTERVAL 300000  // 5 minutos en ms
#define WATERING_DURATION 5000   // 5 segundos
#define WIFI_TIMEOUT 10000       // 10 segundos

// ==================== VARIABLES GLOBALES ====================

unsigned long lastReadingTime = 0;
bool isWatering = false;

// ==================== SETUP ====================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("🌱 Sistema de Riego Inteligente");
  Serial.println("=================================\n");
  
  // Configurar pines
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Bomba apagada
  
  // Inicializar DHT22
  dht.begin();
  Serial.println("✓ DHT22 inicializado");
  
  // Conectar WiFi
  connectWiFi();
  
  Serial.println("\n✓ Sistema listo\n");
}

// ==================== LOOP PRINCIPAL ====================

void loop() {
  // Verificar conexión WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi desconectado, reconectando...");
    connectWiFi();
  }
  
  // Leer sensores cada READING_INTERVAL
  if (millis() - lastReadingTime >= READING_INTERVAL) {
    readAndSendData();
    lastReadingTime = millis();
  }
  
  // TODO: Escuchar comandos del servidor para riego manual
  // checkForCommands();
  
  delay(1000); // Pequeño delay para no saturar
}

// ==================== FUNCIONES WiFi ====================

void connectWiFi() {
  Serial.print("Conectando a WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startTime > WIFI_TIMEOUT) {
      Serial.println("\n✗ Timeout de conexión WiFi");
      return;
    }
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\n✓ WiFi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

// ==================== FUNCIONES DE SENSORES ====================

float readSoilMoisture() {
  int rawValue = analogRead(SOIL_SENSOR_PIN);
  
  // Mapear valor a porcentaje (0-100%)
  float moisture = map(rawValue, SOIL_WET, SOIL_DRY, 100, 0);
  moisture = constrain(moisture, 0, 100);
  
  Serial.print("  Humedad suelo: ");
  Serial.print(moisture);
  Serial.print("% (raw: ");
  Serial.print(rawValue);
  Serial.println(")");
  
  return moisture;
}

float readTemperature() {
  float temp = dht.readTemperature();
  
  if (isnan(temp)) {
    Serial.println("  ✗ Error leyendo temperatura");
    return -999.0;
  }
  
  Serial.print("  Temperatura: ");
  Serial.print(temp);
  Serial.println("°C");
  
  return temp;
}

float readHumidity() {
  float hum = dht.readHumidity();
  
  if (isnan(hum)) {
    Serial.println("  ✗ Error leyendo humedad");
    return -999.0;
  }
  
  Serial.print("  Humedad ambiente: ");
  Serial.print(hum);
  Serial.println("%");
  
  return hum;
}

// ==================== ENVÍO DE DATOS ====================

void readAndSendData() {
  Serial.println("\n--- Leyendo sensores ---");
  
  float soilMoisture = readSoilMoisture();
  float temperature = readTemperature();
  float humidity = readHumidity();
  
  // Validar lecturas
  if (temperature == -999.0 || humidity == -999.0) {
    Serial.println("✗ Lecturas inválidas, reintentando en el próximo ciclo");
    return;
  }
  
  // Crear JSON
  StaticJsonDocument<200> doc;
  doc["maceta_id"] = MACETA_ID;
  doc["humedad_suelo"] = soilMoisture;
  doc["temperatura"] = temperature;
  doc["humedad_ambiente"] = humidity;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Enviar al backend
  if (sendToAPI("/sensor-data", jsonString)) {
    Serial.println("✓ Datos enviados exitosamente");
  } else {
    Serial.println("✗ Error enviando datos");
  }
  
  Serial.println("------------------------\n");
}

bool sendToAPI(const char* endpoint, String jsonData) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("✗ WiFi no conectado");
    return false;
  }
  
  HTTPClient http;
  
  String url = String(API_URL) + endpoint;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  Serial.print("POST ");
  Serial.println(url);
  Serial.print("Body: ");
  Serial.println(jsonData);
  
  int httpCode = http.POST(jsonData);
  
  if (httpCode > 0) {
    Serial.print("HTTP Response: ");
    Serial.println(httpCode);
    
    if (httpCode == 200 || httpCode == 201) {
      String response = http.getString();
      Serial.print("Response: ");
      Serial.println(response);
      http.end();
      return true;
    }
  } else {
    Serial.print("✗ Error en POST: ");
    Serial.println(http.errorToString(httpCode));
  }
  
  http.end();
  return false;
}

// ==================== CONTROL DE RIEGO ====================

void activateWatering(int duration) {
  if (isWatering) {
    Serial.println("⚠️  Riego ya en progreso");
    return;
  }
  
  Serial.println("💧 Activando riego...");
  isWatering = true;
  
  digitalWrite(RELAY_PIN, HIGH); // Encender bomba
  delay(duration);
  digitalWrite(RELAY_PIN, LOW);  // Apagar bomba
  
  isWatering = false;
  Serial.println("✓ Riego completado");
  
  // Registrar riego en el servidor
  StaticJsonDocument<100> doc;
  doc["duracion"] = duration / 1000; // segundos
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  String endpoint = "/riego/" + String(MACETA_ID) + "/activar";
  sendToAPI(endpoint.c_str(), jsonString);
}

// ==================== COMANDOS DEL SERVIDOR ====================

void checkForCommands() {
  // TODO: Implementar polling o WebSocket para recibir comandos
  // Por ahora, el riego manual se hace desde la webapp directamente
  // El ESP32 solo necesita reportar el estado
}

// ==================== FUNCIONES DE UTILIDAD ====================

void printSystemInfo() {
  Serial.println("\n=== Info del Sistema ===");
  Serial.print("WiFi SSID: ");
  Serial.println(WIFI_SSID);
  Serial.print("WiFi IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("API URL: ");
  Serial.println(API_URL);
  Serial.print("Maceta ID: ");
  Serial.println(MACETA_ID);
  Serial.print("Free Heap: ");
  Serial.println(ESP.getFreeHeap());
  Serial.println("========================\n");
}
