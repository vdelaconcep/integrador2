const { validationResult } = require('express-validator');

const validarAlta = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: "Error en la validación de los datos"
        });
    }
    next();
};

const validarMensajes = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: "Error en la validación de los datos"
        });
    }
    next();
};

module.exports = {
    validarAlta,
    validarMensajes
};