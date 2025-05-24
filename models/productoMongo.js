const mongoose = require('mongoose');

// Creación de esquema de contacto
const productoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        require: true
    },
    banda: {
        type: String,
        require: true
    },
    modelo: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    precio: {
        type: Number,
        require: true
    },
    imagen: {
        type: String,
        require: true
    }
});

// Exportación del modelo "Producto"
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;