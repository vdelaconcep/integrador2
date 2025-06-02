const { validationResult } = require('express-validator');

const validar = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const mensajes = errores.array().map(err => err.msg);
        return res.status(400).json({ error: mensajes });
    }
    next();
};

module.exports = { validar };