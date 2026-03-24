import { createClient } from '@supabase/supabase-js';

// Inicialización del cliente (fuera del handler para reutilizar la conexión)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Configuración de Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;

  // Solo permitimos el método GET
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${method} no permitido` });
  }

  try {
    // Escenario A: Obtener un registro específico por ID
    if (query.id) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', query.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Registro no encontrado', details: error?.message });
      }

      return res.status(200).json(data);
    }

    // Escenario B: Obtener todos los registros
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) throw error; // Lanza el error para que lo atrape el bloque catch

    return res.status(200).json(data || []);

  } catch (error) {
    // Manejo centralizado de errores inesperados
    console.error('Error en la API:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: error.message 
    });
  }
}