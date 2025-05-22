const {
    renderIndexApp,
    renderApp
} = require('../controller/controlRouter');


const router = require('express').Router();

// Páginas (get)
router.get('/', renderIndexApp);
router.get('/contacto', renderApp);
router.get('/nosotros', renderApp);
router.get('/alta', renderApp);
router.get('/carrito', renderApp);



// Exportar el enrutador
module.exports = router;