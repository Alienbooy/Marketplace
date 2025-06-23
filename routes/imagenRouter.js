const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificaToken');
const upload = require('../middlewares/upload');
const imagenController = require('../controllers/imagenController');

router.post('/:id', verificarToken, upload.uploadCrear, imagenController.subirImagen);
router.get('/:id', imagenController.obtenerImagenes);

module.exports = router;
