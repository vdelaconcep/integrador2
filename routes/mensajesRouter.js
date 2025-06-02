const {
    obtenerMensajes,
    eliminarMensaje,
    enviarMensaje
} = require('../controller/mensajesController');

const { reglasValidacionMensajes } = require('../helpers/mensajesValidatorHelpers');

const {validar} = require('../middlewares/validators')

const mensajesRouter = require('express').Router();

// Enviar mensaje
mensajesRouter.post('/', reglasValidacionMensajes, validar, enviarMensaje);

// Eliminar mensaje
mensajesRouter.delete('/:id', eliminarMensaje);

// Obtener mensajes recibidos
mensajesRouter.get('/', obtenerMensajes);

// Exportar el enrutador
module.exports = mensajesRouter;