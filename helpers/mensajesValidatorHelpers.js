const {check} = require('express-validator')

const reglasValidacionMensajes = [
    check("nombre")
        .escape()
        .notEmpty()
        .withMessage("El nombre no puede quedar vacío")
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage("El nombre debe tener entre 3 y 30 caracteres"),
    check("email")
        .escape()
        .notEmpty()
        .withMessage("Debe ingresar una dirección de e-mail")
        .bail()
        .isEmail()
        .withMessage("Debe ingresar una dirección de e-mail válida"),
    check("asunto")
        .escape()
        .notEmpty()
        .withMessage("El asunto no puede quedar vacío")
        .bail()
        .isLength({ max: 40 })
        .withMessage("El asunto puede tener 40 caracteres como máximo"),
    check("mensaje")
        .escape()
        .notEmpty()
        .withMessage("El mensaje no puede quedar vacío")
        .bail()
        .isLength({ max: 240 })
        .withMessage("El mensaje puede tener hasta 240 caracteres")
];

module.exports = { reglasValidacionMensajes };