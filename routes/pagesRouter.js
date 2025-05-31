const {
    renderIndexApp,
    renderContactoApp,
    renderApp,
    renderAltaApp,
    renderMensajesApp,
    renderProductosApp
} = require('../controller/pagesController');

const pagesRouter = require('express').Router();

// Mostrar páginas
pagesRouter.get('/', renderIndexApp);
pagesRouter.get('/contacto', renderContactoApp);
pagesRouter.get('/nosotros', renderApp);
pagesRouter.get('/alta', renderAltaApp);
pagesRouter.get('/mensajes', renderApp);
pagesRouter.get('/carrito', renderApp);
pagesRouter.get('/productos', renderProductosApp);
pagesRouter.get('/remeras', renderProductosApp);
pagesRouter.get('/buzos', renderProductosApp);
pagesRouter.get('/mochilas', renderProductosApp);
pagesRouter.post('/busqueda', renderProductosApp);

// Exportar el enrutador
module.exports = pagesRouter;