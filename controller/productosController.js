const Producto = require('../models/productoMongo');
const axios = require('axios');
const sharp = require('sharp');

// Configuración de imagen
const CONFIG_IMAGEN = {
    minWidth: 300,
    minHeight: 280,
    tolerancia: 0.3
};

// Importar configuración de dotenv
const dotenv = require('dotenv');
dotenv.config();

// Función para verificar imagen
const verificarImagen = (imagen) => {
    const originalWidth = imagen.width;
    const originalHeight = imagen.height;

    const originalRatio = originalWidth / originalHeight;
    const targetRatio = CONFIG_IMAGEN.minWidth / CONFIG_IMAGEN.minHeight;

    const diferenciaRelativa = Math.abs(originalRatio - targetRatio) / targetRatio;

    if (originalWidth < CONFIG_IMAGEN.minWidth || originalHeight < CONFIG_IMAGEN.minHeight || diferenciaRelativa > CONFIG_IMAGEN.tolerancia) return false;

    return true;
}

// Subir imagen a Imgur
const subirImagen = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ninguna imagen' });
        }

        const metadata = await sharp(req.file.buffer).metadata();

        // Verificar formato de imagen
        if (!['jpeg', 'png'].includes(metadata.format)) return res.status(400).json({ error: 'Formato de imagen no permitido. Solo se aceptan JPG o PNG.' });

        // Verificar tamaño y proporción de la imagen
        const imagenOk = verificarImagen(metadata);

        if (!imagenOk) {
            return res.status(400).json({
                error: `La imagen debe tener un tamaño mínimo de ${CONFIG_IMAGEN.minWidth}x${CONFIG_IMAGEN.minHeight} y la proporción debe ser cercana a 1:1`
            });
        }

        // Redimensionar y enviar a Imgur
        const imagenRedimensionada = await sharp(req.file.buffer)
            .resize(300, 280)
            .jpeg({ quality: 80 })
            .toBuffer();

        const imagenBase64 = imagenRedimensionada.toString('base64');

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
        res.status(500).json({ error: `Error al recibir/ procesar la imagen: ${err.message}` });
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

        if (!productoNuevo.imagen) return res.status(400).json({ error: `No se ha recibido imagen` });

        // Si la imagen es externa (no Imgur), verificar
        if (!productoNuevo.imagen.includes('imgur')) {
            const response = await axios.get(productoNuevo.imagen, {
                responseType: 'arraybuffer'
            });
            console.log('pasé por acá')

            const buffer = Buffer.from(response.data, 'binary');
            const metadata = await sharp(buffer).metadata();

            // Verificar formato de imagen
            if (!['jpeg', 'png'].includes(metadata.format)) return res.status(400).json({ error: 'Formato de imagen no permitido. Solo se aceptan JPG o PNG.' });

            // Verificar tamaño y proporción de la imagen
            const imagenOk = verificarImagen(metadata);

            if (!imagenOk) {
                return res.status(400).json({
                    error: `La imagen debe tener al menos ${CONFIG_IMAGEN.minWidth}x${CONFIG_IMAGEN.minHeight} y una proporción cercana a 1:1`
                });
            }
        }

        // Guardar producto en base de datos
        const producto = new Producto(productoNuevo);
        const productoGuardado = await producto.save();
        res.status(200).send(productoGuardado);

    } catch (err) {
        res.status(500).json({error: `El producto no pudo ingresarse: ${err.message}`});
    }
};

// Obtener productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await (Producto.find());
        res.status(200).json(productos);
    } catch (err) {
        res.status(500).json({ error: `Error al obtener productos de la base de datos: ${err.message}`});
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
        return res.status(500).json({ error: `Error al eliminar el producto: ${err.message}` });
    }
};

// Modificar stock del producto (compra)
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
        return res.status(500).json({error: `Error al modificar stock del producto en la base de datos: ${err.message}`});
    };
};

module.exports = {
    subirImagen,
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    modificarStockProducto
}