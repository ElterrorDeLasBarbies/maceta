# 🚀 Guía de Deploy en Render

## Pasos para deployar tu sistema IoT en Render (GRATIS)

### 1️⃣ Preparar el código

Ya está todo listo! Solo necesitas:

```bash
cd /Users/tomassubiabre/Desktop/maceta
git init
git add .
git commit -m "Initial commit - Sistema de Riego IoT"
```

### 2️⃣ Subir a GitHub

1. Ve a https://github.com/new
2. Crea un repositorio llamado `maceta-iot`
3. NO inicialices con README (ya tienes código)
4. Ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/maceta-iot.git
git branch -M main
git push -u origin main
```

### 3️⃣ Configurar Render

1. **Crea cuenta en Render**: https://render.com/
   - Puedes usar tu cuenta de GitHub

2. **Crear nuevo Web Service**:
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio GitHub `maceta-iot`
   - Render detectará automáticamente `render.yaml`

3. **Configurar Variables de Entorno**:
   En el dashboard de Render, agrega:
   
   ```
   SUPABASE_URL=https://byiaxfnuxriealexklsu.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5aWF4Zm51eHJpZWFsZXhrbHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMjI0OTEsImV4cCI6MjA0NjY5ODQ5MX0.1MVQvFd6vPPfxCq0GlFq8y3sKlxo8cpnSXM_B1O6Fes
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**: Click "Create Web Service"

### 4️⃣ Esperar el deploy

- Tarda ~5 minutos la primera vez
- Te dará una URL como: `https://maceta-iot.onrender.com`

### 5️⃣ Actualizar el ESP32

Una vez desplegado, actualiza el firmware del ESP32:

```cpp
// En maceta_dht22_only.ino, línea 20:
const char* API_URL = "https://maceta-iot.onrender.com/api/sensor-data";
```

Sube el código actualizado al ESP32 desde Arduino IDE.

### 6️⃣ ¡Listo! 🎉

Ahora puedes acceder desde:
- **Tu celular**: https://maceta-iot.onrender.com
- **Cualquier dispositivo**: https://maceta-iot.onrender.com
- **ESP32 enviando datos** cada 30 segundos

---

## ⚠️ Importante sobre el plan gratuito de Render:

- **El servicio se "duerme" después de 15 minutos de inactividad**
- **La primera solicitud después de dormir tarda ~30 segundos en despertar**
- **Solución**: El ESP32 enviando datos cada 30s lo mantiene activo

### Alternativa si quieres que esté siempre activo:

Puedes hacer un "ping" cada 10 minutos con:

```bash
# Desde tu Mac (déjalo corriendo en una terminal)
while true; do curl https://maceta-iot.onrender.com/health; sleep 600; done
```

---

## 📊 Monitoreo

- **Logs**: En Render dashboard → "Logs"
- **Métricas**: En Render dashboard → "Metrics"
- **Health Check**: https://maceta-iot.onrender.com/health

---

## 🔄 Actualizar el código

Simplemente haz push a GitHub:

```bash
git add .
git commit -m "Actualización"
git push
```

Render detectará los cambios y hará redeploy automáticamente.

---

## 💡 Tips

1. **Primera vez**: El ESP32 puede fallar los primeros intentos hasta que Render despierte
2. **Logs del ESP32**: Verifica con Serial Monitor que esté enviando correctamente
3. **CORS**: Ya está configurado para permitir peticiones desde el ESP32
4. **Rate Limit**: Configurado para 100 requests/15min (suficiente)

---

## 🆓 Costos

**TODO ES GRATIS** con estos límites:
- ✅ 750 horas/mes (suficiente para uso 24/7)
- ✅ Ancho de banda: 100GB/mes
- ✅ 1 servicio web gratis
- ✅ Base de datos PostgreSQL incluida (no la usamos, usamos Supabase)

---

¿Listo para hacer deploy? Sigue los pasos y en 10 minutos tendrás tu sistema en la nube! 🚀
