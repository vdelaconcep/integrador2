const {
    obtenerMensajes,
    eliminarMensaje,
    enviarMensaje
} = require('../controller/mensajesController');

const { reglasValidacionMensajes } = require('../helpers/mensajesValidatorHelpers');

const {validar} = require('../middlewares/validators')

const router = require('express').Router();

// Enviar mensaje
router.post('/', reglasValidacionMensajes, validar, enviarMensaje);

// Eliminar mensaje
router.delete('/:id', eliminarMensaje);

// Obtener mensajes recibidos
router.get('/', obtenerMensajes);

// Exportar el enrutador
module.exports = router;