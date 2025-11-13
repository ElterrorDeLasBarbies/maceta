import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR CRÍTICO: Credenciales de Supabase no configuradas');
  console.error('Variables faltantes:');
  console.error(`  - SUPABASE_URL: ${supabaseUrl ? '✓' : '✗ Falta'}`);
  console.error(`  - SUPABASE_ANON_KEY: ${supabaseKey ? '✓' : '✗ Falta'}`);
  console.error('Por favor configura estas variables de entorno');
  
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️  La aplicación no funcionará correctamente sin estas credenciales');
  }
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseKey || '',
  {
    auth: {
      persistSession: false
    }
  }
);

// Helper para validar conexión
export const testConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return { 
        success: false, 
        message: 'Credenciales de Supabase no configuradas' 
      };
    }

    const { data, error } = await supabase.from('macetas').select('count');
    if (error) throw error;
    return { success: true, message: 'Conexión exitosa a Supabase' };
  } catch (error) {
    console.error('[ERROR] Fallo al conectar con Supabase:', error.message);
    return { success: false, message: error.message };
  }
};
