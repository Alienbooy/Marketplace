const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const verificarToken = require('../middlewares/verificaToken');

router.get('/', verificarToken, likeController.obtenerLikes);

router.post('/:id', verificarToken, likeController.agregarLike);

router.delete('/:id', verificarToken, likeController.quitarLike);

module.exports = router;

