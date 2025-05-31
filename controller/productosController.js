const Producto = require('../models/productoMongo');
const axios = require('axios');

// Importar configuración de dotenv
const dotenv = require('dotenv');
dotenv.config();

// Subir imagen a Imgur
const subirImagen = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ninguna imagen' });
        }

        const imagenBase64 = req.file.buffer.toString('base64');

        const response = await axios.post('https://api.imgur.com/3/image', {
            image: imagenBase64,
            type: 'base64'
        }, {
            headers: {
                Authorization: process.env.IMGUR_ID
            }
        });

        res.json({ link: response.data.data.link });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
};

// Ingresar nuevo producto en la base de datos
const ingresarProducto = async (req, res) => {
    try {
        const productoNuevo = {
            tipo: req.body.tipo,
            banda: req.body.banda,
            modelo: req.body.modelo,
            stock: req.body.stock,
            precio: req.body.precio,
            imagen: req.body.imagen
        };

        // Guardar producto en base de datos
        const producto = new Producto(productoNuevo);
        const productoGuardado = await producto.save();
        res.status(200).send(productoGuardado);

    } catch (err) {
        console.log(err.message);
    }
};

// Obtener productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await (Producto.find());
        res.status(200).json(productos);
    } catch (err) {
        res.status(500).send(`Error al obtener productos de la base de datos: ${err.message}`);
    }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
    try {
        const baja = await Producto.findByIdAndDelete(req.params.id);
        if (!baja) {
            return res.status(404).send(`Producto no encontrado`);
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send(`Error al eliminar el producto: ${err.message}`);
    }
};

// Modificar producto
const modificarStockProducto = async (req, res) => {
    try {
        const buscaPorID = { _id: req.params.id };

        const productoAModificar = await Producto.findById(buscaPorID);

        if (!productoAModificar) return res.status(404).send('Producto no encontrado');

        const stockActual = productoAModificar.stock;
        const cantidadRequerida = req.body.cantidad;
        const nuevoStock = stockActual - cantidadRequerida;

        if (nuevoStock < 0) return res.status(400).send('La cantidad requerida supera el stock');

        const productoModificado = {
            stock: nuevoStock
        };
        const actualizacion = await Producto.updateOne(buscaPorID, productoModificado);

        if (!actualizacion) return res.status(404).send(`Producto no encontrado`);

        return res.status(200).json(actualizacion);

    } catch (err) {
        return res.status(500).send(`Error al modificar el producto en la base de datos: ${err.message}`);
    };
};

module.exports = {
    subirImagen,
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    modificarStockProducto
}