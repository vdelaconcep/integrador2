const Producto = require('../models/productoMongo');
const axios = require('axios');
const sharp = require('sharp');

// Importar configuración de dotenv
const dotenv = require('dotenv');
dotenv.config();

// Ingresar nuevo producto en la base de datos (administrador)
const ingresarProducto = async (req, res) => {

    // Verificar proporción de imagen
    let imagen = req.file

    const metadata = await sharp(req.file.buffer).metadata();
    const ratio = metadata.width / metadata.height;
    const diferenciaRelativa = Math.abs(ratio - 1);
    
    if (diferenciaRelativa > 0.2) {
        return res.status(400).json({error: "La relación de aspecto de la imagen debe ser cercana a 1:1 para evitar distorsiones"})
    }

    // Redimensionar imagen y enviar a Imgur
    const imagenRedimensionada = await sharp(req.file.buffer)
        .resize(310, 300)
        .jpeg({ quality: 80 })
        .toBuffer();

    const imagenBase64 = imagenRedimensionada.toString('base64');

    try {

        const response = await axios.post('https://api.imgur.com/3/image', {
            image: imagenBase64,
            type: 'base64'
        }, {
            headers: {
                Authorization: process.env.IMGUR_ID
            }
        });

        imagen = response.data.data.link;

    } catch (err) {
        return res.status(500).json({ error: `Error al enviar la imagen a Imgur: ${err.message}`});
    }
    
    // Asignar modelo de producto
    const banda = req.body.banda;
    const tipo = req.body.tipo;
    let modelo;

    try {
        const productos = await Producto.find();
        let resultado = [];
        productos.forEach(elemento => {
            const buscaPorBanda = elemento.banda.trim().toLowerCase();
            const buscaPorTipo = elemento.tipo.trim().toLocaleLowerCase();
            const coincide = (buscaPorBanda.includes(banda.trim().toLowerCase()) && buscaPorTipo.includes(tipo.trim().toLowerCase()));
            if (coincide) {
                resultado.push(elemento);
            };
        });
        modelo = resultado.length + 1;
    } catch (err) {
        return res.status(500).json({ error: `Error al recuperar productos de la base de datos: ${err.message}` });
    };

    // Guardar producto en la base de datos
    const productoNuevo = {
        tipo: tipo,
        banda: banda,
        modelo: modelo,
        stock: req.body.stock,
        precio: req.body.precio,
        imagen: imagen
    };

    try {
        const producto = new Producto(productoNuevo);
        const productoGuardado = await producto.save();
        res.status(200).send(productoGuardado);
    } catch (err) {
        res.status(500).json({error: `El producto no pudo ingresarse en la base de datos: ${err.message}`});
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

// Eliminar producto (administrador)
const eliminarProducto = async (req, res) => {
    try {
        const baja = await Producto.findByIdAndDelete(req.params.id);
        if (!baja) {
            return res.status(404).send(`Producto no encontrado`);
        }
        return res.status(200).send(`Producto eliminado: ${baja}`);
    } catch (err) {
        return res.status(500).json({ error: `Error al eliminar el producto: ${err.message}` });
    }
};

// Modificar stock del producto (compra)
const comprarProducto = async (req, res) => {
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

        return res.status(200).json(`Compra realizada con éxito: ${JSON.stringify(actualizacion)}`);

    } catch (err) {
        return res.status(500).json({error: `Error al modificar stock del producto en la base de datos: ${err.message}`});
    };
};

// Actualizar stock y precio de un producto (administrador)
const actualizarProducto = async (req, res) => {
    try {
        const buscaPorID = { _id: req.params.id };

        const productoAActualizar = await Producto.findById(buscaPorID);

        if (!productoAActualizar) return res.status(404).send('Producto no encontrado');

        const stockActual = Number(productoAActualizar.stock);
        const stockAgregado = Number(req.body.agregado) || 0;
        let stockActualizado = stockActual + stockAgregado;

        const precioActualizado = req.body.precio || productoAActualizar.precio;

        const productoActualizado = {
            stock: stockActualizado,
            precio: precioActualizado
        };

        const actualizacion = await Producto.updateOne(buscaPorID, productoActualizado);

        if (!actualizacion) return res.status(404).send(`Producto no encontrado`);

        return res.status(200).json(`El producto ha sido actualizado: ${JSON.stringify(actualizacion)}`);

    } catch (err) {
        return res.status(500).json({ error: `Error al actualizar datos del producto: ${err.message}` });
    };
};

module.exports = {
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    comprarProducto,
    actualizarProducto
}