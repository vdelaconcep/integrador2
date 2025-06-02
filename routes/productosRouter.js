const {
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    comprarProducto,
    actualizarProducto
} = require('../controller/productosController');

// Helpers y middlewares de validación
const { reglasValidacionAlta } = require('../helpers/altaValidatorHelper');
const { reglasValidacionCompra } = require('../helpers/compraValidatorHelper');
const { reglasValidacionActualizacion } = require('../helpers/actualizacionValidatorHelper');
const { validar } = require('../middlewares/validators');

// Configuración del enrutador
const productosRouter = require('express').Router();

// Para subir imagen
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Ingresar productos
productosRouter.post('/', upload.single('image'), reglasValidacionAlta, validar, ingresarProducto);

// Obtener productos
productosRouter.get('/', obtenerProductos);

// Eliminar producto
productosRouter.delete('/:id', eliminarProducto);

// Comprar producto (se modifica solamente stock)
productosRouter.put('/comprar/:id', reglasValidacionCompra, validar, comprarProducto);

// Actualizar producto (agregar stock y/o modificar precio)
productosRouter.put('/actualizar/:id', reglasValidacionActualizacion, validar, actualizarProducto);

// Exportar el enrutador
module.exports = productosRouter;
