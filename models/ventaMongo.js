const mongoose = require('mongoose');

// Creación de esquema de venta
const ventaSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    carrito: {
        type: String,
        required: true
    }
});

// Exportación del modelo "Venta"
const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;