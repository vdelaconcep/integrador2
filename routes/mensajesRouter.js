const {
    obtenerMensajes,
    enviarMensaje
} = require('../controller/mensajesController');

const mensajesRouter = require('express').Router();

// Enviar mensaje
mensajesRouter.post('/', enviarMensaje);

// Obtener mensajes recibidos
mensajesRouter.get('/', obtenerMensajes);

// Exportar el enrutador
module.exports = mensajesRouter;