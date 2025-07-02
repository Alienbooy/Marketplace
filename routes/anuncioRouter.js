const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const upload = require('../middlewares/upload');
const verificarToken = require('../middlewares/verificaToken');

router.get('/buscar', anuncioController.buscarAnuncios);
router.get('/destacados', anuncioController.destacados);


router.get('/mis', verificarToken, anuncioController.obtenerMisAnuncios);
router.get('/:id', anuncioController.obtenerAnuncioPorId);

router.get('/', anuncioController.obtenerAnuncios);
router.get('/categoria/:nombre', anuncioController.obtenerPorCategoria);


router.post('/', verificarToken, upload.uploadCrear, anuncioController.crearAnuncio);
router.put('/:id', verificarToken, upload.uploadEditar, anuncioController.editarAnuncio);

router.delete('/:id', verificarToken, anuncioController.eliminarAnuncio);
router.patch('/:id/publicado', verificarToken, anuncioController.cambiarPublicado);



module.exports = router;

