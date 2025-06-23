const express = require('express');
const router = express.Router();
const controller = require('../controllers/mensajeController');
const verificarToken = require('../middlewares/verificaToken');

router.post('/', verificarToken, controller.enviarMensaje);
router.get('/:id', verificarToken, controller.obtenerMensajes);

module.exports = router;
