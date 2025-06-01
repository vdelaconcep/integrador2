const { validationResult } = require('express-validator');

const validarMensajes = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }
    next();
};

module.exports = {
    validarMensajes
};
