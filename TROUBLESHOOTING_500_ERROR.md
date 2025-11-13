# Solución al Error 500 en API de Macetas

## Problema Identificado

La aplicación frontend está mostrando errores 500 cuando intenta acceder a:
```
GET https://maceta-pro.onrender.com/api/macetas/e74bd846-59e4-4f7b-aa4d-5478dd8c31fd
```

## Causas Potenciales

1. **Variables de entorno no configuradas en Render**
   - `SUPABASE_URL` no está definida
   - `SUPABASE_ANON_KEY` no está definida

2. **Errores en queries de Supabase**
   - La tabla `macetas` no existe
   - Permisos RLS (Row Level Security) bloqueando el acceso
   - Maceta con ese ID no existe

## Cambios Realizados

### 1. Mejorado el logging en `/backend/routes/macetas.js`

Se agregaron logs detallados en todos los endpoints:
- `GET /api/macetas/:id` - Ahora logea el ID buscado y errores detallados
- `GET /api/macetas/:id/estado` - Logs de lectura y riego
- `GET /api/macetas/:id/datos` - Logs de datos históricos

### 2. Mejorado el manejo de errores en `/backend/config/database.js`

- Mejor detección de variables de entorno faltantes
- Logs más claros sobre qué credencial falta
- Validación de conexión mejorada

### 3. Test de conexión al iniciar servidor

El servidor ahora prueba la conexión a Supabase al iniciar y muestra el resultado.

## Cómo Verificar en Render

### 1. Verificar Variables de Entorno

Ve a tu dashboard de Render → Tu servicio → Environment

**Variables requeridas:**
```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-key-de-supabase
NODE_ENV=production  # Ya configurado en render.yaml
PORT=10000  # Ya configurado en render.yaml
```

⚠️ **IMPORTANTE**: El archivo `render.yaml` tiene estas variables definidas con `sync: false`, lo que significa que **DEBES configurarlas manualmente** en el dashboard de Render. No son opcionales.

### 2. Revisar los Logs en Render

Después de desplegar, ve a: `Logs` en tu dashboard de Render

**Busca estas líneas:**
```
✓ Conexión a base de datos verificada
```

**Si ves errores como:**
```
✗ Error de conexión a base de datos
❌ ERROR CRÍTICO: Credenciales de Supabase no configuradas
```

→ Significa que faltan las variables de entorno.

### 3. Verificar la Base de Datos en Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Ve a: `Table Editor`
3. Verifica que existe la tabla `macetas`
4. Verifica que el ID `e74bd846-59e4-4f7b-aa4d-5478dd8c31fd` existe
5. Ve a: `Authentication` → `Policies` 
6. Asegúrate de que hay políticas RLS que permitan SELECT público

**Ejemplo de política RLS:**
```sql
-- Permitir lectura pública en macetas
CREATE POLICY "Enable read access for all users" ON "public"."macetas"
FOR SELECT
USING (true);
```

## Pasos para Resolver

### Paso 1: Configurar Variables de Entorno en Render

1. Ve a tu servicio en Render
2. Click en "Environment" en el menú lateral
3. Agrega estas variables:
   - `SUPABASE_URL` → Tu URL de Supabase
   - `SUPABASE_ANON_KEY` → Tu clave anon de Supabase
4. Guarda los cambios

### Paso 2: Redeploy

Render debería hacer auto-deploy. Si no, haz un deploy manual.

### Paso 3: Verificar los Logs

Mira los logs en Render para ver si ahora muestra:
```
✓ Conexión a base de datos verificada
```

### Paso 4: Probar el Endpoint

Prueba el endpoint directamente en tu navegador:
```
https://maceta-pro.onrender.com/api/macetas
```

Debería devolver:
```json
{
  "success": true,
  "data": [...],
  "count": 1
}
```

### Paso 5: Verificar el Frontend

Abre tu aplicación frontend y verifica que ya no haya errores 500.

## Logs Mejorados - Qué Buscar

### Logs Normales (Todo OK)
```
[DEBUG] Buscando maceta con ID: e74bd846-59e4-4f7b-aa4d-5478dd8c31fd
[DEBUG] Maceta encontrada: { id: '...', nombre: '...' }
```

### Logs de Error (Problema)
```
[ERROR] Error de Supabase: {
  message: "relation \"public.macetas\" does not exist",
  code: "42P01"
}
```

Este error significa que la tabla no existe o hay un problema de permisos.

## Comandos Útiles

### Probar localmente antes de deploy:
```bash
cd backend
npm install
# Crear archivo .env con tus credenciales
cp .env.example .env
# Editar .env con tus credenciales reales
npm run dev
```

### Ver logs en tiempo real en Render:
```bash
# En la página de Render, ve a "Logs" y activa "Live"
```

## Checklist Final

- [ ] Variables de entorno configuradas en Render
- [ ] Deploy exitoso sin errores
- [ ] Logs muestran "✓ Conexión a base de datos verificada"
- [ ] Endpoint `/api/macetas` devuelve datos
- [ ] Endpoint `/api/macetas/:id` devuelve una maceta específica
- [ ] Frontend carga sin errores 500

## Contacto con Soporte

Si después de estos pasos aún hay problemas:

1. Copia los logs completos de Render
2. Copia el error específico del frontend
3. Verifica que Supabase esté funcionando (visita dashboard de Supabase)
4. Revisa la configuración RLS en Supabase
