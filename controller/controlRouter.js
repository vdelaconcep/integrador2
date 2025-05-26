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

// Mostrar página productos
const renderProductosApp = async (req, res) => {
    const pagina = `${req.url.slice(1)}`;
    const paginaConMayuscula = pagina[0].toUpperCase() + pagina.slice(1);
    try {
        let productos;
        if (pagina === 'productos') {
            productos = await Producto.find();
        } else {
            productos = await Producto.find({ tipo: `${paginaConMayuscula.slice(0,-1)}` });
        }
        res.render('productos', {
            title: `- ${paginaConMayuscula}`,
            tipoProducto: `${paginaConMayuscula}`,
            productos: productos
        });
    } catch (err) {
        res.status(500).send(`Error al obtener productos: ${err.message}`)
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
            res.status(404).send(`Producto no encontrado`);
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(`Error al eliminar el producto: ${err.message}`);
    }
};

// Modificar producto
const modificarProducto = async (req, res) => {

    if (req.body.stock === 0) {
        try {
            await eliminarProducto(req, res);
            return;
        } catch (err) {
            res.status(500).send(`Error al modificar el producto en la base de datos: ${err.message}`);
        }
    }

    const buscaPorID = { _id: req.params.id };

    const productoModificado = {
        stock: req.body.stock
    };
    
    try {
        const actualizacion = await Producto.updateOne(buscaPorID, productoModificado);

        if (!actualizacion) {
            return res.status(404).send(`Producto no encontrado`);
        }
        res.status(200).json(actualizacion);
        } catch (err) {
        res.status(500).send(`Error al modificar el producto en la base de datos: ${err.message}`);
    }
};


module.exports = {
    renderIndexApp,
    renderApp,
    renderAltaApp,
    renderProductosApp,
    subirImagen,
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    modificarProducto
}