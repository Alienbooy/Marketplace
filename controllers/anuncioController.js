const anuncioRepository = require('../repositories/anuncioRepository');
const imagenRepository = require('../repositories/imagenRepository');

exports.crearAnuncio = async (req, res) => {
  try {
    const { titulo, descripcion, precio, estado, categoria } = req.body;
    const idVendedor = req.user.id_usuario;

    const id = await anuncioRepository.crearAnuncio({
      titulo,
      descripcion,
      precio,
      estado,
      categoria_id: categoria,
      idVendedor
    });


    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(file =>
          imagenRepository.guardarImagen('/uploads/' + file.filename, id)
        )
      );
    }

    res.status(201).json({ id, message: 'Anuncio creado correctamente' });
  } catch (err) {
    console.error('Error al crear anuncio:', err);
    res.status(500).json({ message: 'Error al crear el anuncio' });
  }
};

exports.editarAnuncio = async (req, res) => {
  try {
    const id = req.params.id_usuario;
    const { titulo, descripcion, precio, estado, categoria } = req.body;

    const actualizado = await anuncioRepository.actualizarAnuncio(id, {
      titulo,
      descripcion,
      precio,
      estado,
      categoria_id: categoria
    });

    if (!actualizado) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(file =>
          imagenRepository.guardarImagen('/uploads/' + file.filename, id)
        )
      );
    }

    res.json({ message: 'Anuncio actualizado correctamente', anuncio: actualizado });
  } catch (error) {
    console.error('Error al actualizar anuncio:', error);
    res.status(500).json({ message: 'Error al actualizar el anuncio' });
  }
};


exports.obtenerAnuncios = async (req, res) => {
  try {
    const anuncios = await anuncioRepository.obtenerPublicados(req.query.categoria);
    const lista = await Promise.all(
      anuncios.map(async (a) => ({
        ...a,
        imagenes: await imagenRepository.obtenerImagenesPorAnuncio(a.id)
      }))
    );
    res.json(lista);
  } catch (e) {
    console.error('Error al obtener anuncios:', e);
    res.status(500).json({ message: 'Error al obtener anuncios.' });
  }
};

exports.obtenerPorCategoria = async (req, res) => {
  try {
    const nombreCategoria = req.params.nombre;
    const anuncios = await anuncioRepository.obtenerPorCategoria(nombreCategoria);
    res.json(anuncios);
  } catch (error) {
    console.error('Error al filtrar por categoría:', error);
    res.status(500).json({ message: 'Error al obtener anuncios por categoría.' });
  }
};

exports.obtenerMisAnuncios = async (req, res) => {
  try {
    const anuncios = await anuncioRepository.obtenerPorVendedor(req.user.id_usuario);
    const listaConImagenes = await Promise.all(
      anuncios.map(async (anuncio) => {
        const imagenes = await imagenRepository.obtenerImagenesPorAnuncio(anuncio.id);
        return { ...anuncio, imagenes };
      })
    );
    res.json(listaConImagenes);
  } catch (e) {
    console.error('Error al obtener mis anuncios:', e);
    res.status(500).json({ message: 'Error al obtener mis anuncios.' });
  }
};


exports.obtenerAnuncioPorId = async (req, res) => {
  try {
    const anuncio = await anuncioRepository.obtenerPorId(req.params.id_usuario);
    if (!anuncio) return res.status(404).json({ message: 'Anuncio no encontrado.' });

    anuncio.imagenes = await imagenRepository.obtenerImagenesPorAnuncio(req.params.id);
    res.json(anuncio);
  } catch (e) {
    console.error('Error al obtener anuncio por ID:', e);
    res.status(500).json({ message: 'Error al obtener el anuncio.' });
  }
};


exports.cambiarPublicado = async (req, res) => {
  try {
    const resultado = await anuncioRepository.cambiarPublicado(
      req.body.publicado,
      req.params.id,
      req.user.id_usuario
    );
    if (!resultado) return res.status(403).json({ message: 'No autorizado.' });

    res.json({ message: `Anuncio ${resultado.publicado ? 'habilitado' : 'deshabilitado'}.` });
  } catch (e) {
    console.error('Error al cambiar estado publicado:', e);
    res.status(500).json({ message: 'Error al cambiar estado.' });
  }
};


exports.eliminarAnuncio = async (req, res) => {
  const id = req.params.id;
  const vendedor = req.user.id_usuario;

  try {
    const anuncio = await anuncioRepository.obtenerParaEliminar(id, vendedor);
    if (!anuncio) return res.status(403).json({ message: 'No tienes permiso para eliminar este anuncio' });

    const tieneChat = await anuncioRepository.tieneConversaciones(id);

    if (tieneChat) {
      await anuncioRepository.despublicar(id);
      return res.json({ message: 'El anuncio tenía conversaciones y fue despublicado' });
    }

    await anuncioRepository.eliminar(id);
    res.json({ message: 'Anuncio eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
