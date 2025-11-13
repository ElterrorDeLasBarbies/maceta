# 🔑 Solución: Invalid API Key

## ✅ El Problema Está IDENTIFICADO

Los logs muestran claramente:
```
[ERROR] Fallo al conectar con Supabase: Invalid API key
[ERROR] Error de Supabase: {
  message: 'Invalid API key',
  hint: 'Double check your Supabase `anon` or `service_role` API key.'
}
```

**Diagnóstico:** La variable `SUPABASE_ANON_KEY` en Render está configurada pero tiene un valor INCORRECTO.

---

## 🔧 Solución Paso a Paso

### 1. Obtener la Clave Correcta de Supabase

#### Opción A: Desde el Dashboard de Supabase
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, click en **"Settings"** ⚙️
4. Click en **"API"**
5. En la sección **"Project API keys"**, encontrarás:
   - ✅ **`anon` `public`** ← Esta es la que necesitas
   - ⚠️ NO uses la `service_role` (es peligrosa en producción)

6. **Copia EXACTAMENTE** el valor de la clave `anon public`

#### Opción B: Verificar si tienes un archivo .env local

Si tienes un archivo `.env` en `/backend/.env` (local), verifica que tenga:
```bash
SUPABASE_ANON_KEY=eyJhbGc...tu-clave-completa...
```

**⚠️ La clave debe:**
- Empezar con `eyJ`
- Ser muy larga (generalmente 200+ caracteres)
- NO tener espacios al principio o final
- Ser la clave `anon` NO la `service_role`

### 2. Actualizar en Render

1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Selecciona tu servicio `maceta-pro` o `maceta-iot`
3. Click en **"Environment"** en el menú lateral
4. Busca la variable `SUPABASE_ANON_KEY`
5. Click en **"Edit"** o el ícono de lápiz
6. **Pega el nuevo valor** (asegúrate de NO dejar espacios)
7. Click en **"Save"**

### 3. Verificar SUPABASE_URL También

Mientras estás ahí, verifica que `SUPABASE_URL` también sea correcta:

**Formato correcto:**
```
https://tuproyecto.supabase.co
```

**Encontrar en Supabase:**
- Settings → API → Project URL

### 4. Esperar el Auto-Deploy

Render automáticamente hará un nuevo deploy (2-3 minutos)

### 5. Verificar en los Logs

Deberías ver:
```
✓ Conexión a base de datos verificada
```

En lugar de:
```
✗ Error de conexión a base de datos: Invalid API key
```

---

## 🚨 Errores Comunes

### Error 1: Espacios en la clave
```bash
# ❌ INCORRECTO (espacio al final)
SUPABASE_ANON_KEY=eyJhbGciOi... 

# ✅ CORRECTO (sin espacios)
SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Error 2: Usar la clave incorrecta
```bash
# ❌ INCORRECTO (service_role - peligrosa)
SUPABASE_ANON_KEY=eyJhbGciOi...service_role...

# ✅ CORRECTO (anon public)
SUPABASE_ANON_KEY=eyJhbGciOi...anon...
```

### Error 3: URL incorrecta
```bash
# ❌ INCORRECTO
SUPABASE_URL=https://supabase.co

# ✅ CORRECTO
SUPABASE_URL=https://tuproyecto.supabase.co
```

---

## 🧪 Test Rápido

Una vez actualizado, prueba en tu navegador:

```
https://maceta-pro.onrender.com/api/health
```

Debería responder:
```json
{
  "status": "OK",
  "timestamp": "2025-11-13T...",
  "uptime": 123
}
```

Luego prueba:
```
https://maceta-pro.onrender.com/api/macetas
```

Debería responder:
```json
{
  "success": true,
  "data": [...],
  "count": 1
}
```

---

## 📋 Checklist Final

- [ ] Copié la clave `anon public` correcta de Supabase
- [ ] Actualicé `SUPABASE_ANON_KEY` en Render (sin espacios)
- [ ] Verifiqué que `SUPABASE_URL` también sea correcta
- [ ] Guardé los cambios en Render
- [ ] Esperé el auto-deploy (2-3 min)
- [ ] Los logs muestran "✓ Conexión a base de datos verificada"
- [ ] `/api/health` responde OK
- [ ] `/api/macetas` devuelve datos
- [ ] El frontend carga sin errores 500

---

## 💡 Tip Pro

Para probar localmente antes de deploy:

1. Crea un archivo `/backend/.env`:
```bash
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon-correcta
NODE_ENV=development
PORT=3000
```

2. Ejecuta localmente:
```bash
cd backend
npm run dev
```

3. Deberías ver:
```
✓ Conexión a base de datos verificada
```

Si funciona localmente, entonces las credenciales son correctas y solo necesitas actualizarlas en Render.

---

## 🎉 Éxito

Cuando todo funcione, los logs mostrarán:

```
╔═══════════════════════════════════════════╗
║  🌱 Servidor Backend Iniciado             ║
║  Puerto: 10000                           ║
║  Entorno: production                      ║
║  Supabase: ✓ Conectado                    ║
╚═══════════════════════════════════════════╝

✓ Conexión a base de datos verificada

[DEBUG] Buscando maceta con ID: e74bd846-59e4-4f7b-aa4d-5478dd8c31fd
[DEBUG] Maceta encontrada: { id: '...', nombre: '...' }
```

¡Y el frontend funcionará sin errores! 🚀
