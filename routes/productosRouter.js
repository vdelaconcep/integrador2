const {
    subirImagen,
    ingresarProducto,
    obtenerProductos,
    eliminarProducto,
    modificarStockProducto
} = require('../controller/productosController');

const productosRouter = require('express').Router();

// Subir imagen
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

productosRouter.post('/upload', upload.single('image'), subirImagen);

// Ingresar productos
productosRouter.post('/', ingresarProducto);

// Obtener productos
productosRouter.get('/', obtenerProductos);

// Eliminar producto
productosRouter.delete('/:id', eliminarProducto);

// Modificar producto
productosRouter.put('/:id', modificarStockProducto);

// Exportar el enrutador
module.exports = productosRouter;
