const repo = require('../repositories/imagenRepository');

exports.subirImagen = async (req, res) => {
  const anuncioId = req.params.id;
  const archivos = req.files;

  if (!archivos || archivos.length === 0) {
    return res.status(400).json({ message: 'No se subió ninguna imagen.' });
  }

  try {
    for (let archivo of archivos) {
      const url = '/uploads/' + archivo.filename;
      await repo.guardarImagen(url, anuncioId);
    }

    res.status(200).json({ message: 'Imágenes subidas correctamente.' });
  } catch (err) {
    console.error('Error al subir imágenes:', err);
    res.status(500).json({ message: 'Error al guardar imágenes.' });
  }
};

exports.obtenerImagenes = async (req, res) => {
  const anuncioId = req.params.id;
  try {
    const imagenes = await repo.obtenerImagenesPorAnuncio(anuncioId);
    res.json({ imagenes });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ message: 'Error al obtener imágenes.' });
  }
};
