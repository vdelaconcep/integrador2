const {
    productosApp
} = require('../controller/controlRouter');


const router = require('express').Router();

// Página principal
router.get('/', productosApp);


// Exportar el enrutador
module.exports = router;