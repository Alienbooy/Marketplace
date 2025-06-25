const repo = require('../repositories/conversacionRepository');

exports.crearConversacion = async (req, res) => {
  try {
    const interesado_id = req.user.id_usuario; 
    const { anuncio_id } = req.body;

    const existente = await repo.existeConversacion(anuncio_id, interesado_id);
    if (existente) return res.json(existente); 

    console.log("interesado_id recibido:", interesado_id);
    console.log("anuncio_id recibido:", anuncio_id);

    const conversacion = await repo.crearConversacion(anuncio_id, interesado_id);
    res.status(201).json(conversacion);
  } catch (error) {
    console.error('Error al crear conversación:', error);
    res.status(500).json({ message: 'Error interno al crear conversación' });
  }
};

exports.obtenerConversacionesVendiendo = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const conversaciones = await repo.obtenerConversacionesDeMisAnuncios(usuario_id);
    res.json(conversaciones);
  } catch (error) {
    console.error('Error al obtener conversaciones vendiendo:', error);
    res.status(500).json({ message: 'Error interno al obtener conversaciones' });
  }
};

exports.obtenerConversacionesComprando = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const conversaciones = await repo.obtenerConversacionesPorUsuario(usuario_id);
    res.json(conversaciones);
  } catch (error) {
    console.error('Error al obtener conversaciones comprando:', error);
    res.status(500).json({ message: 'Error interno al obtener conversaciones' });
  }
};

