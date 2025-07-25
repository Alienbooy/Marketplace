const likeRepo = require('../repositories/likeRepository');
const imagenRepo = require('../repositories/imagenRepository');
const anuncioRepo = require('../repositories/anuncioRepository');

exports.obtenerLikes = async (req, res) => {
  try {
    const usuarioId = req.user.id_usuario; 
    const anuncios = await likeRepo.obtenerAnunciosGuardados(usuarioId);

    const listaConImagenes = await Promise.all(
      anuncios.map(async (anuncio) => {
        const imagenes = await imagenRepo.obtenerImagenesPorAnuncio(anuncio.id);
        return { ...anuncio, imagenes };
      })
    );

    res.json(listaConImagenes);
  } catch (error) {
    console.error("Error al obtener likes:", error);
    res.status(500).json({ message: "Error al obtener likes" });
  }
};

exports.agregarLike = async (req, res) => {
  const usuarioId = req.user.id_usuario;
  const anuncioId = req.params.id;

  try {
    const anuncio = await anuncioRepo.obtenerPorId(anuncioId);
    if (!anuncio) {
      return res.status(404).json({ message: 'Anuncio no encontrado.' });
    }

    if (anuncio.vendedor_id === usuarioId) {
      return res.status(403).json({ message: 'No puedes guardar tu propio anuncio.' });
    }

    await likeRepo.guardarLike(usuarioId, anuncioId);
    res.json({ message: 'Anuncio guardado correctamente.' });

  } catch (error) {
    console.error('Error al guardar anuncio:', error);
    res.status(500).json({ message: 'Error al guardar anuncio.' });
  }
};

exports.quitarLike = async (req, res) => {
  const usuarioId = req.user.id_usuario;
  const anuncioId = req.params.id;
  try {
    await likeRepo.eliminarLike(usuarioId, anuncioId);
    res.json({ message: 'Anuncio eliminado de tus likes.' });
  } catch (error) {
    console.error('Error al quitar anuncio guardado:', error);
    res.status(500).json({ message: 'Error al quitar anuncio guardado.' });
  }
};
