

const {
    renderIndexApp,
    renderApp,
    renderAltaApp,
    subirImagen,
    ingresarProducto
} = require('../controller/controlRouter');


const router = require('express').Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Páginas (get)
router.get('/', renderIndexApp);
router.get('/contacto', renderApp);
router.get('/nosotros', renderApp);
router.get('/alta', renderAltaApp);
router.get('/carrito', renderApp);

router.post('/api/upload', upload.single('image'), subirImagen);

router.post('/api/productos', ingresarProducto);



// Exportar el enrutador
module.exports = router;