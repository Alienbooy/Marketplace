const express = require('express');
const router = express.Router();
const controller = require('../controllers/conversacionController');
const verificarToken = require('../middlewares/verificaToken');

router.post('/', verificarToken, controller.crearConversacion);
router.get('/comprando', verificarToken, controller.obtenerConversacionesComprando);
router.get('/vendiendo', verificarToken, controller.obtenerConversacionesVendiendo);

module.exports = router;
