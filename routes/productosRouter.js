const {
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    comprarProductos,
    actualizarProducto
} = require('../controller/productosController');

// Helpers y middlewares de validación
const { reglasValidacionAlta } = require('../helpers/altaValidatorHelper');
const { reglasValidacionActualizacion } = require('../helpers/actualizacionValidatorHelper');
const { reglasValidacionCompra } = require('../helpers/compraValidatorHelper'); 
const { validar } = require('../middlewares/validators');

// Configuración del enrutador
const router = require('express').Router();

// Para subir imagen
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Ingresar productos
router.post('/', upload.single('image'), reglasValidacionAlta, validar, ingresarProducto);

// Obtener productos
router.get('/', obtenerProductos);

// Eliminar producto
router.delete('/:id', eliminarProducto);

// Comprar producto (se modifica stock y se registra la venta)
router.post('/comprar/', reglasValidacionCompra, validar, comprarProductos);

// Actualizar producto (agregar stock y/o modificar precio)
router.put('/actualizar/:id', reglasValidacionActualizacion, validar, actualizarProducto);

// Exportar el enrutador
module.exports = router;
