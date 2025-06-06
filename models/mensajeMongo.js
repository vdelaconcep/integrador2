const mongoose = require('mongoose');

// Creación de esquema de contacto
const mensajeSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    asunto: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    }
});

// Exportación del modelo "Mensaje"
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;