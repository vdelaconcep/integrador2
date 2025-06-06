const mongoose = require('mongoose');

// Creación de esquema de contacto
const productoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    banda: {
        type: String,
        required: true
    },
    modelo: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
});

// Exportación del modelo "Producto"
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;