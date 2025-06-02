const { check } = require('express-validator');

const reglasValidacionActualizacion = [
    check("agregado")
        .escape()
        .optional({ checkFalsy: true })
        .isFloat({ gt: 0 }).withMessage('El stock agregado debe ser un número mayor que cero'),

    check("precio")
        .escape()
        .optional({ checkFalsy: true })
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que cero'),

    check().custom((value, {req}) => {
        if (!req.body.agregado && !req.body.precio) {
            throw new Error('Debe completarse al menos uno de los dos campos: stock o precio');
        }
        return true;
    })
];

module.exports = { reglasValidacionActualizacion };