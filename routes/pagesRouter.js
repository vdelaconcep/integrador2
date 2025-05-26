

const {
    renderIndexApp,
    renderApp,
    renderAltaApp,
    renderProductosApp,
    subirImagen,
    ingresarProducto,
    obtenerProductos
} = require('../controller/controlRouter');


const router = require('express').Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Mostrar páginas
router.get('/', renderIndexApp);
router.get('/contacto', renderApp);
router.get('/nosotros', renderApp);
router.get('/alta', renderAltaApp);
router.get('/carrito', renderApp);
router.get('/productos', renderProductosApp);
router.get('/remeras', renderProductosApp);
router.get('/buzos', renderProductosApp);
router.get('/mochilas', renderProductosApp);
router.get('/busqueda', renderProductosApp);

// Subir imagen
router.post('/api/upload', upload.single('image'), subirImagen);

// Ingresar productos
router.post('/api/productos', ingresarProducto);

// Obtener productos
router.get('/api/productos', obtenerProductos)



// Exportar el enrutador
module.exports = router;