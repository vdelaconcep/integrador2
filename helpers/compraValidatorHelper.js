const { check } = require('express-validator');

const reglasValidacionCompra = [
    check("cantidad")
        .escape()
        .notEmpty().withMessage("Debe indicar cantidad de producto requerida")
        .bail()
        .isInt({min: 1}).withMessage("La cantidad requerida debe ser mayor que cero")
];

module.exports = { reglasValidacionCompra };