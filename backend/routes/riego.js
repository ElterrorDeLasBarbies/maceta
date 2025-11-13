import express from 'express';
import { supabase } from '../config/database.js';

const router = express.Router();

// POST /api/riego/:maceta_id/activar - Activar riego manual
router.post('/:maceta_id/activar', async (req, res) => {
  try {
    const { maceta_id } = req.params;
    const { duracion = 5 } = req.body; // Duración en segundos, default 5

    // Verificar que la maceta existe
    const { data: maceta, error: macetaError } = await supabase
      .from('macetas')
      .select('id, nombre')
      .eq('id', maceta_id)
      .single();

    if (macetaError) {
      return res.status(404).json({ 
        success: false, 
        error: 'Maceta no encontrada' 
      });
    }

    // Registrar el riego
    const { data, error } = await supabase
      .from('riegos')
      .insert([{ 
        maceta_id,
        tipo: 'manual',
        duracion: parseInt(duracion),
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      data,
      message: `Riego activado para ${maceta.nombre} por ${duracion} segundos`,
      comando_esp32: {
        action: 'activar_riego',
        duracion: parseInt(duracion)
      }
    });

  } catch (error) {
    console.error('Error activando riego:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/riego/:maceta_id/historial - Obtener historial de riegos
router.get('/:maceta_id/historial', async (req, res) => {
  try {
    const { maceta_id } = req.params;
    const { limit = 50 } = req.query;

    const { data, error } = await supabase
      .from('riegos')
      .select('*')
      .eq('maceta_id', maceta_id)
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      count: data.length 
    });
  } catch (error) {
    console.error('Error obteniendo historial de riegos:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/riego/estadisticas - Estadísticas generales de riego
router.get('/estadisticas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('riegos')
      .select('maceta_id, tipo, duracion');

    if (error) throw error;

    // Calcular estadísticas
    const totalRiegos = data.length;
    const riegosManuales = data.filter(r => r.tipo === 'manual').length;
    const riegosAutomaticos = data.filter(r => r.tipo === 'automatico').length;
    const duracionTotal = data.reduce((sum, r) => sum + r.duracion, 0);

    res.json({ 
      success: true, 
      data: {
        total_riegos: totalRiegos,
        riegos_manuales: riegosManuales,
        riegos_automaticos: riegosAutomaticos,
        duracion_total_segundos: duracionTotal,
        promedio_duracion: totalRiegos > 0 ? (duracionTotal / totalRiegos).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
