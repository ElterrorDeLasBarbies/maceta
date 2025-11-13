# 🚨 Fix Rápido - Error 500 en Render

## El Problema
```
GET https://maceta-pro.onrender.com/api/macetas/ID 500 (Internal Server Error)
```

## ✅ La Solución MÁS PROBABLE

**Las variables de entorno NO están configuradas en Render.**

### Paso a Paso:

1. **Ve a Render Dashboard**
   ```
   https://dashboard.render.com/
   ```

2. **Selecciona tu servicio** `maceta-iot` o `maceta-pro`

3. **Click en "Environment"** (menú lateral izquierdo)

4. **Agrega estas 2 variables** (si no existen):

   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | `https://tuproyecto.supabase.co` |
   | `SUPABASE_ANON_KEY` | `tu-clave-anon-key` |

   **¿Dónde encuentro estos valores?**
   - Ve a [supabase.com](https://supabase.com)
   - Abre tu proyecto
   - Settings → API
   - Copia "Project URL" → `SUPABASE_URL`
   - Copia "anon public" key → `SUPABASE_ANON_KEY`

5. **Guarda los cambios** 
   - Render hará un auto-deploy

6. **Espera 2-3 minutos** para que termine el deploy

7. **Verifica en los Logs** (Render → Logs)
   - Deberías ver: `✓ Conexión a base de datos verificada`
   - Si ves: `✗ Error de conexión` → Revisa los valores

8. **Prueba tu app**
   - Abre: `https://maceta-pro.onrender.com`
   - No debería haber más errores 500

## 🔍 Verificación Rápida

### Test 1: Health Check
```bash
curl https://maceta-pro.onrender.com/api/health
```
Debería retornar: `{ "status": "OK" }`

### Test 2: Macetas Endpoint
```bash
curl https://maceta-pro.onrender.com/api/macetas
```
Debería retornar lista de macetas (no error 500)

## ⚠️ Si Aún No Funciona

### Problema: "Tabla no existe"
**Error en logs:** `relation "public.macetas" does not exist`

**Solución:**
1. Ve a Supabase Dashboard
2. Table Editor
3. Ejecuta el schema SQL del archivo `backend/database/schema.sql`

### Problema: "Permiso denegado"
**Error en logs:** `permission denied for table macetas`

**Solución:**
1. Ve a Supabase Dashboard
2. Authentication → Policies
3. Agrega esta política:

```sql
-- Permitir lectura pública
CREATE POLICY "Enable read for all users" 
ON "public"."macetas"
FOR SELECT 
USING (true);

CREATE POLICY "Enable read for all users on lecturas" 
ON "public"."lecturas"
FOR SELECT 
USING (true);

CREATE POLICY "Enable read for all users on riegos" 
ON "public"."riegos"
FOR SELECT 
USING (true);
```

## 📊 Cambios Realizados en el Código

Se mejoraron los logs para debugging:
- ✅ `/backend/routes/macetas.js` - Logs detallados en todos los endpoints
- ✅ `/backend/config/database.js` - Mejor detección de credenciales faltantes  
- ✅ `/backend/server.js` - Test de conexión al iniciar

Estos cambios te ayudarán a ver exactamente qué está fallando en los logs de Render.

## 🎯 Checklist Final

- [ ] Variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` configuradas en Render
- [ ] Deploy completado sin errores
- [ ] Logs muestran "✓ Conexión a base de datos verificada"
- [ ] `curl https://maceta-pro.onrender.com/api/health` retorna OK
- [ ] `curl https://maceta-pro.onrender.com/api/macetas` retorna datos
- [ ] Frontend abre sin errores 500 en consola

---

**Tiempo estimado de fix:** 5-10 minutos

**Documentación completa:** Ver `TROUBLESHOOTING_500_ERROR.md`
