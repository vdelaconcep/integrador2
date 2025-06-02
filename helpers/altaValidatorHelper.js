const { check } = require('express-validator');

const reglasValidacionAlta = [
    check("tipo")
        .escape()
        .notEmpty().withMessage("Debe indicar el tipo de producto")
        .bail()
        .isIn(["Remera", "Buzo", "Mochila"]).withMessage("El tipo de producto debe ser 'Remera', 'Buzo' o 'Mochila'"),
    
    check("banda")
        .escape()
        .notEmpty().withMessage("Debe indicar el nombre del artista/ banda")
        .bail()
        .isLength({ max: 40 }).withMessage("El nombre del artista/ banda no debe superar los 40 caracteres"),
    
    check("stock")
        .escape()
        .notEmpty().withMessage("Debe ingresar el stock disponible")
        .bail()
        .isInt({ min: 1, max: 10000 }).withMessage("El stock debe ser un número entre 1 y 10.000"),
    
    check("precio")
        .escape()
        .notEmpty().withMessage("Debe ingresar un precio")
        .bail()
        .isInt({ min: 1 }).withMessage("El precio ingresado debe ser mayor que 0"),
    
    check("imagen")
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Imagen requerida");
            };
            
            if (req.file.mimetype !== ("image/jpeg") && req.file.mimetype !== ("image/png")) {
                throw new Error("Debe subir una imagen en formato .jpg, .jpeg o .png");
            };

            if (req.file.size > 2 * 1024 * 1024) {
                throw new Error("La imagen no debe superar 2 Mb");
            };

            return true;
        })
];

module.exports = { reglasValidacionAlta };