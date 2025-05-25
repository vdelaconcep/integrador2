const Producto = require('../models/productoMongo');
const FormData = require('form-data');
const axios = require('axios')

// Mostrar página principal
const renderIndexApp = (req, res) => {
    res.render(`index`, {title:''});
};

// Mostrar páginas secundarias
const renderApp = (req, res) => {
    const pagina = `${req.url.slice(1)}`;
    const paginaConMayuscula = pagina[0].toUpperCase() + pagina.slice(1)
    res.render(pagina, { title: `- ${paginaConMayuscula}` });
};

const renderAltaApp = (req, res) => {
    res.render('alta', { title: '- Alta' });
}

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
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los prodcutos' });
    }
}


module.exports = {
    renderIndexApp,
    renderApp,
    renderAltaApp,
    subirImagen,
    ingresarProducto,
    obtenerProductos
}