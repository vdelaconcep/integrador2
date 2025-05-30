

const {
    renderIndexApp,
    renderContactoApp,
    renderApp,
    renderAltaApp,
    renderMensajesApp,
    obtenerMensajes,
    obtenerBandaBuscada,
    renderProductosApp,
    subirImagen,
    ingresarProducto,
    obtenerProductos,
    modificarStockProducto,
    eliminarProducto,
    enviarMensaje
} = require('../controller/controlRouter');


const router = require('express').Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Mostrar páginas
router.get('/', renderIndexApp);
router.get('/contacto', renderContactoApp);
router.get('/nosotros', renderApp);
router.get('/alta', renderAltaApp);
router.get('/mensajes', renderMensajesApp);
router.get('/carrito', renderApp);
router.get('/productos', renderProductosApp);
router.get('/remeras', renderProductosApp);
router.get('/buzos', renderProductosApp);
router.get('/mochilas', renderProductosApp);
router.post('/busqueda', obtenerBandaBuscada, renderProductosApp);

// Subir imagen
router.post('/api/upload', upload.single('image'), subirImagen);

// Ingresar productos
router.post('/api/productos', ingresarProducto);

// Obtener productos
router.get('/api/productos', obtenerProductos);

// Eliminar producto
router.delete('/api/productos/:id', eliminarProducto)

// Modificar producto
router.put('/api/productos/:id', modificarStockProducto);

// Enviar mensaje
router.post('/api/mensajes', enviarMensaje);

router.get('/api/mensajes', obtenerMensajes);



// Exportar el enrutador
module.exports = router;