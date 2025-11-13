import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Advertencia: Credenciales de Supabase no configuradas');
  console.warn('Por favor configura SUPABASE_URL y SUPABASE_ANON_KEY en el archivo .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Helper para validar conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('macetas').select('count');
    if (error) throw error;
    return { success: true, message: 'Conexión exitosa a Supabase' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
