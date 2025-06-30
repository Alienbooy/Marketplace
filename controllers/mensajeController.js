const mensajesRepo = require('../repositories/mensajeRepository');
const conversacionesRepo = require('../repositories/conversacionRepository');
const anuncioRepo = require('../repositories/anuncioRepository');

exports.enviarMensaje = async (req, res) => {
  const { anuncio_id, conversacion_id, contenido } = req.body;
  const remitente_id = req.user.id || req.user.id_usuario;


  if ((!anuncio_id && !conversacion_id) || !contenido) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
  }

  try {
    let conv_id = conversacion_id;

    if (!conv_id && anuncio_id) {
      const anuncio = await anuncioRepo.obtenerPorId(anuncio_id);
      if (!anuncio) {
        return res.status(404).json({ mensaje: "Anuncio no encontrado." });
      }

      if (anuncio.vendedor_id === remitente_id) {
        return res.status(403).json({ mensaje: "No puedes enviarte un mensaje a ti mismo." });
      }

      let conversacion = await conversacionesRepo.existeConversacion(anuncio_id, remitente_id);
      if (!conversacion) {
        conversacion = await conversacionesRepo.crearConversacion(anuncio_id, remitente_id);
      }
      conv_id = conversacion.id;
    }

    await mensajesRepo.crearMensaje(contenido, remitente_id, conv_id);
    res.status(201).json({ mensaje: "Mensaje enviado correctamente." });

  } catch (error) {
    console.error("Error al enviar mensaje:", error.message);
    res.status(500).json({ mensaje: "Error al enviar mensaje." });
  }
};

exports.obtenerMensajes = async (req, res) => {
  try {
    const conversacion_id = req.params.id;
    const mensajes = await mensajesRepo.obtenerMensajesPorConversacion(conversacion_id);
    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener mensajes.' });
  }
};

