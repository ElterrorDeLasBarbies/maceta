-- ============================================
-- SCHEMA SUPABASE - Sistema de Riego Inteligente
-- ============================================

-- Tabla: macetas
CREATE TABLE IF NOT EXISTS macetas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(200),
  umbral_humedad INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: lecturas (datos de sensores)
CREATE TABLE IF NOT EXISTS lecturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  maceta_id UUID REFERENCES macetas(id) ON DELETE CASCADE,
  humedad_suelo FLOAT NOT NULL,
  temperatura FLOAT NOT NULL,
  humedad_ambiente FLOAT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: riegos (historial de activaciones)
CREATE TABLE IF NOT EXISTS riegos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  maceta_id UUID REFERENCES macetas(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('manual', 'automatico')),
  duracion INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_lecturas_maceta_timestamp ON lecturas(maceta_id, timestamp DESC);
CREATE INDEX idx_riegos_maceta_timestamp ON riegos(maceta_id, timestamp DESC);

-- Datos de ejemplo (opcional)
INSERT INTO macetas (nombre, ubicacion, umbral_humedad) VALUES
  ('Maceta 1', 'Sala', 30),
  ('Maceta 2', 'Balcón', 35),
  ('Maceta 3', 'Cocina', 25);

-- Habilitar Row Level Security (RLS) - Opcional para producción
-- ALTER TABLE macetas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lecturas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE riegos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para MVP sin autenticación)
-- CREATE POLICY "Permitir acceso público a macetas" ON macetas FOR ALL USING (true);
-- CREATE POLICY "Permitir acceso público a lecturas" ON lecturas FOR ALL USING (true);
-- CREATE POLICY "Permitir acceso público a riegos" ON riegos FOR ALL USING (true);
