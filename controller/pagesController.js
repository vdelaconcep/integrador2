const Producto = require('../models/productoMongo');
const Mensaje = require('../models/mensajeMongo')

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

// Mostrar página contacto
const renderContactoApp = (req, res) => {
    res.render('contacto', { title: '- Contacto' });
}

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

// Mostrar página de mensajes
const renderMensajesApp = async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        mensajes.forEach(elemento => {
            elemento.fecha = elemento.fecha.slice(4, 24);
        });
        return res.status(200).render('mensajes', {
            title: '- Mensajes',
            mensajes: mensajes
        });
    } catch (err) {
        return res.status(500).json({ error: `Error al obtener mensajes: ${err.message}` });
    };
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
            const bandaBuscada = req.body.banda;
            const regex = new RegExp(bandaBuscada.trim().replace(/\s+/g, '.*'), 'i');
            productos = await Producto.find({ banda: regex });
            tipoDeProducto = `Resultados para "${bandaBuscada}"`;

        } else {
            productos = await Producto.find({ tipo: `${paginaConMayuscula.slice(0, -1)}` });
            tipoDeProducto = paginaConMayuscula;
        }

        return res.status(200).render('productos', {
            title: `- ${paginaConMayuscula}`,
            tipoProducto: tipoDeProducto,
            productos: productos
        });
    } catch (err) {
        return res.status(500).json({ error: `Error al obtener productos: ${err.message}` });
    }
};

// Mostrar panel de administrador
const renderAdminApp = async (req, res) => {
    try {
        const productos = await Producto.find();

        return res.status(200).render('admin', {
            title: 'Panel de administrador',
            productos: productos
        })
    } catch (err) {
        return res.status(500).json({ error: `Error al obtener productos: ${err.message}` });
    }
}


module.exports = {
    renderIndexApp,
    renderContactoApp,
    renderApp,
    renderAltaApp,
    renderMensajesApp,
    renderProductosApp,
    renderAdminApp
}