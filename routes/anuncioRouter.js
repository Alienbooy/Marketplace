const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const upload = require('../middlewares/upload');
const verificarToken = require('../middlewares/verificaToken');

// Obtener anuncios
router.get('/mis', verificarToken, anuncioController.obtenerMisAnuncios);
router.get('/:id', anuncioController.obtenerAnuncioPorId);
router.get('/', anuncioController.obtenerAnuncios);

// Crear y editar anuncio con imágenes
router.post('/', verificarToken, upload.uploadCrear, anuncioController.crearAnuncio);
router.put('/:id', verificarToken, upload.uploadEditar, anuncioController.editarAnuncio);

// Cambiar estado o eliminar
router.delete('/:id', verificarToken, anuncioController.eliminarAnuncio);
router.patch('/:id/publicado', verificarToken, anuncioController.cambiarPublicado);

module.exports = router;

