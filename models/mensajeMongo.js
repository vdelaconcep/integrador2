const mongoose = require('mongoose');

// Creación de esquema de contacto
const mensajeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    asunto: {
        type: String,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    mensaje: {
        type: String,
        require: true
    }
});

// Exportación del modelo "Mensaje"
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;