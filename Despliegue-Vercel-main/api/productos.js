const productos = [
  { id: 101, nombre: 'Micrófono Shure SM7B', precio: 8500, categoria: 'Audio' },
  { id: 102, nombre: 'Cámara Sony ZV-E10', precio: 15000, categoria: 'Video' },
  { id: 103, nombre: 'Luces Elgato Key Light', precio: 4200, categoria: 'Iluminación' },
  { id: 104, nombre: 'Interfaz Focusrite', precio: 3100, categoria: 'Audio' }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;

  // Validación de seguridad para solo permitir GET
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${method} no permitido` });
  }

  try {
    // 1. Buscar por ID (Ej: ?id=102)
    if (query.id) {
      const producto = productos.find(p => p.id === parseInt(query.id));
      return producto 
        ? res.status(200).json(producto) 
        : res.status(404).json({ error: 'Producto no encontrado' });
    }

    // 2. Filtrar por Categoría (Ej: ?categoria=audio)
    if (query.categoria) {
      const busqueda = query.categoria.toLowerCase();
      const filtrados = productos.filter(p => 
        p.categoria.toLowerCase() === busqueda
      );
      return res.status(200).json(filtrados);
    }

    // 3. Retornar todos los productos si no hay filtros
    return res.status(200).json(productos);

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}