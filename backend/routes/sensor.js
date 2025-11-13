import express from 'express';
import { supabase } from '../config/database.js';

const router = express.Router();

// POST /api/sensor-data - Recibir datos de sensores desde ESP32
router.post('/', async (req, res) => {
  try {
    const { 
      maceta_id, 
      humedad_suelo, 
      temperatura, 
      humedad_ambiente 
    } = req.body;

    // Validación de datos requeridos
    if (!maceta_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'maceta_id es requerido' 
      });
    }

    if (humedad_suelo === undefined || temperatura === undefined || humedad_ambiente === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los datos del sensor son requeridos' 
      });
    }

    // Validación de rangos
    if (humedad_suelo < 0 || humedad_suelo > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'humedad_suelo debe estar entre 0 y 100' 
      });
    }

    if (temperatura < -40 || temperatura > 80) {
      return res.status(400).json({ 
        success: false, 
        error: 'temperatura fuera de rango válido (-40 a 80°C)' 
      });
    }

    // Verificar que la maceta existe
    const { data: macetaExists, error: macetaError } = await supabase
      .from('macetas')
      .select('id, umbral_humedad')
      .eq('id', maceta_id)
      .single();

    if (macetaError) {
      return res.status(404).json({ 
        success: false, 
        error: 'Maceta no encontrada' 
      });
    }

    // Insertar lectura
    const { data, error } = await supabase
      .from('lecturas')
      .insert([{ 
        maceta_id,
        humedad_suelo,
        temperatura,
        humedad_ambiente,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Verificar si necesita riego automático
    let necesitaRiego = false;
    if (humedad_suelo < macetaExists.umbral_humedad) {
      necesitaRiego = true;
    }

    res.status(201).json({ 
      success: true, 
      data,
      message: 'Datos guardados exitosamente',
      alerta: necesitaRiego ? {
        tipo: 'riego_necesario',
        mensaje: `Humedad baja (${humedad_suelo}% < ${macetaExists.umbral_humedad}%)`
      } : null
    });

  } catch (error) {
    console.error('Error guardando datos del sensor:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/sensor-data/latest - Obtener últimas lecturas de todas las macetas
router.get('/latest', async (req, res) => {
  try {
    // Obtener todas las macetas
    const { data: macetas, error: macetasError } = await supabase
      .from('macetas')
      .select('id, nombre');

    if (macetasError) throw macetasError;

    // Para cada maceta, obtener su última lectura
    const lecturas = await Promise.all(
      macetas.map(async (maceta) => {
        const { data, error } = await supabase
          .from('lecturas')
          .select('*')
          .eq('maceta_id', maceta.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        return {
          maceta_nombre: maceta.nombre,
          maceta_id: maceta.id,
          lectura: error ? null : data
        };
      })
    );

    res.json({ 
      success: true, 
      data: lecturas 
    });
  } catch (error) {
    console.error('Error obteniendo últimas lecturas:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
