import express from 'express';
import { supabase } from '../config/database.js';

const router = express.Router();

// GET /api/macetas - Obtener todas las macetas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('macetas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      count: data.length 
    });
  } catch (error) {
    console.error('Error obteniendo macetas:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/macetas/:id - Obtener una maceta específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DEBUG] Buscando maceta con ID: ${id}`);

    const { data, error } = await supabase
      .from('macetas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[ERROR] Error de Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    if (!data) {
      console.log(`[DEBUG] No se encontró maceta con ID: ${id}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Maceta no encontrada' 
      });
    }

    console.log(`[DEBUG] Maceta encontrada:`, data);
    res.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('[ERROR] Error obteniendo maceta:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(error.code === 'PGRST116' ? 404 : 500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// POST /api/macetas - Crear nueva maceta
router.post('/', async (req, res) => {
  try {
    const { nombre, ubicacion, umbral_humedad } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ 
        success: false, 
        error: 'El nombre es requerido' 
      });
    }

    const { data, error } = await supabase
      .from('macetas')
      .insert([{ 
        nombre, 
        ubicacion: ubicacion || 'Sin ubicación',
        umbral_humedad: umbral_humedad || 30 
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      data,
      message: 'Maceta creada exitosamente' 
    });
  } catch (error) {
    console.error('Error creando maceta:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT /api/macetas/:id - Actualizar maceta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, umbral_humedad } = req.body;

    const { data, error } = await supabase
      .from('macetas')
      .update({ nombre, ubicacion, umbral_humedad })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      message: 'Maceta actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error actualizando maceta:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE /api/macetas/:id - Eliminar maceta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('macetas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Maceta eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error eliminando maceta:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/macetas/:id/datos - Obtener datos históricos
router.get('/:id/datos', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100, hours = 24 } = req.query;

    console.log(`[DEBUG] Obteniendo datos históricos para maceta: ${id}, últimas ${hours} horas`);

    // Calcular timestamp para filtrar
    const timeAgo = new Date();
    timeAgo.setHours(timeAgo.getHours() - parseInt(hours));

    const { data, error } = await supabase
      .from('lecturas')
      .select('*')
      .eq('maceta_id', id)
      .gte('timestamp', timeAgo.toISOString())
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      console.error('[ERROR] Error obteniendo datos históricos:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }

    console.log(`[DEBUG] Datos históricos obtenidos: ${data.length} registros`);
    res.json({ 
      success: true, 
      data,
      count: data.length,
      period_hours: hours
    });
  } catch (error) {
    console.error('[ERROR] Error obteniendo datos históricos:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// GET /api/macetas/:id/estado - Obtener estado actual
router.get('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DEBUG] Obteniendo estado para maceta: ${id}`);

    // Obtener última lectura
    const { data: lectura, error: lecturaError } = await supabase
      .from('lecturas')
      .select('*')
      .eq('maceta_id', id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (lecturaError && lecturaError.code !== 'PGRST116') {
      console.error('[ERROR] Error obteniendo lectura:', {
        message: lecturaError.message,
        code: lecturaError.code,
        details: lecturaError.details
      });
      throw lecturaError;
    }

    // Obtener último riego
    const { data: riego, error: riegoError } = await supabase
      .from('riegos')
      .select('*')
      .eq('maceta_id', id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (riegoError && riegoError.code !== 'PGRST116') {
      console.error('[ERROR] Error obteniendo riego:', {
        message: riegoError.message,
        code: riegoError.code,
        details: riegoError.details
      });
      throw riegoError;
    }

    console.log(`[DEBUG] Estado obtenido - Lectura: ${lectura ? 'Sí' : 'No'}, Riego: ${riego ? 'Sí' : 'No'}`);
    res.json({ 
      success: true, 
      data: {
        ultima_lectura: lectura || null,
        ultimo_riego: riego || null
      }
    });
  } catch (error) {
    console.error('[ERROR] Error obteniendo estado:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

export default router;
