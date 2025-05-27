const Producto = require('../models/productoMongo');
const FormData = require('form-data');
const axios = require('axios')

// Mostrar página principal
const renderIndexApp = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('index', {
            title: '',
            productos: productos
        });
    } catch (err) {
        res.status(500).send(`Error al obtener productos: ${err.message}`)
    }
    
};

// Mostrar páginas secundarias
const renderApp = (req, res) => {
    const pagina = `${req.url.slice(1)}`;
    const paginaConMayuscula = pagina[0].toUpperCase() + pagina.slice(1)
    res.render(pagina, { title: `- ${paginaConMayuscula}` });
};

// Mostrar página alta de producto
const renderAltaApp = (req, res) => {
    res.render('alta', { title: '- Alta' });
}

// Obtener banda buscada
const obtenerBandaBuscada = (req, res, next) => {
    req.bandaBuscada = req.body.banda;
    next();
};

// Mostrar página productos
const renderProductosApp = async (req, res) => {
    try {
        const pagina = `${req.url.slice(1)}`;
        const paginaConMayuscula = pagina[0].toUpperCase() + pagina.slice(1);
        let tipoDeProducto;
        let productos;
        if (pagina === 'productos') {
            productos = await Producto.find();
            tipoDeProducto = 'Todos los productos';

        } else if (pagina === 'busqueda') {
            const bandaBuscada = req.bandaBuscada;
            const regex = new RegExp(bandaBuscada.trim().replace(/\s+/g, '.*'), 'i');
            productos = await Producto.find({ banda: regex });
            tipoDeProducto = `Resultados para "${bandaBuscada}"`;

        } else {
            productos = await Producto.find({ tipo: `${paginaConMayuscula.slice(0, -1)}` });
            tipoDeProducto = paginaConMayuscula
        }

        return res.status(200).render('productos', {
            title: `- ${paginaConMayuscula}`,
            tipoProducto: tipoDeProducto,
            productos: productos
        });
    } catch (err) {
        return res.status(500).send(`Error al obtener productos: ${err.message}`)
    }
};

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
                Authorization: 'Client-ID 1efa57656d99a9b'
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

        // Guardar registro en base de datos
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
}

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
    let nuevoStock;
    const buscaPorID = { _id: req.params.id };

    try {
        const productoAModificar = await Producto.findById(buscaPorID);

        if (!productoAModificar) return res.status(404).send('Producto no encontrado');
        
        const stockActual = productoAModificar.stock;
        const cantidadComprada = req.body.cantidad;
        nuevoStock = stockActual - cantidadComprada;

        if (nuevoStock < 0) return res.status(400).send('La cantidad pedida supera el stock')
        
    } catch (err) {
        return res.status(500).send(`Error al buscar producto: ${err.message}`)
    }

    if (nuevoStock === 0) {
        try {
            await eliminarProducto(req, res);
            return;
        } catch (err) {
            return res.status(500).send(`Error al eliminar producto de la base de datos: ${err.message}`);
        }
    } else {
        try {
            const productoModificado = {
                stock: nuevoStock
            };
            const actualizacion = await Producto.updateOne(buscaPorID, productoModificado);

            if (!actualizacion) return res.status(404).send(`Producto no encontrado`);

            return res.status(200).json(actualizacion);
        } catch (err) {
            return res.status(500).send(`Error al modificar el producto en la base de datos: ${err.message}`);
        }
    }
};


module.exports = {
    renderIndexApp,
    renderApp,
    renderAltaApp,
    obtenerBandaBuscada,
    renderProductosApp,
    subirImagen,
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    modificarStockProducto
}