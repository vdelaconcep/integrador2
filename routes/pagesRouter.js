const {
    renderIndexApp,
    renderContactoApp,
    renderApp,
    renderAltaApp,
    renderMensajesApp,
    renderProductosApp,
    renderAdminApp
} = require('../controller/pagesController');

const router = require('express').Router();

// Mostrar páginas
router.get('/', renderIndexApp);
router.get('/admin', renderAdminApp)
router.get('/contacto', renderContactoApp);
router.get('/nosotros', renderApp);
router.get('/alta', renderAltaApp);
router.get('/mensajes', renderMensajesApp);
router.get('/carrito', renderApp);
router.get('/productos', renderProductosApp);
router.get('/remeras', renderProductosApp);
router.get('/buzos', renderProductosApp);
router.get('/mochilas', renderProductosApp);
router.post('/busqueda', renderProductosApp);


// Exportar el enrutador
module.exports = router;