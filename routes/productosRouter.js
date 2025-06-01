const {
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    modificarStockProducto
} = require('../controller/productosController');

const { reglasValidacionAlta } = require('../helpers/altaValidatorHelper');

const {validarAlta} = require('../middlewares/validators')

const productosRouter = require('express').Router();

// Para subir imagen
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Ingresar productos
productosRouter.post('/', upload.single('image'), reglasValidacionAlta, validarAlta, ingresarProducto);

// Obtener productos
productosRouter.get('/', obtenerProductos);

// Eliminar producto
productosRouter.delete('/:id', eliminarProducto);

// Modificar producto
productosRouter.put('/:id', modificarStockProducto);

// Exportar el enrutador
module.exports = productosRouter;
