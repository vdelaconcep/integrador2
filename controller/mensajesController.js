const Mensaje = require('../models/mensajeMongo');

// Obtener mensajes recibidos
const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        res.status(200).json(mensajes);
    } catch (err) {
        res.status(500).json({error: `Error al obtener mensajes de la base de datos: ${err.message}`});
    }
};

// Eliminar mensaje
const eliminarMensaje = async (req, res) => {
    console.log(req.params.id);
    try {
        const mensajeAEliminar = await Mensaje.findByIdAndDelete(req.params.id);
        if (!mensajeAEliminar) {
            return res.status(404).json({ error: `Mensaje no encontrado`});
        }
        return res.status(200).send(`Mensaje eliminado: ${mensajeAEliminar}`);
    } catch (err) {
        return res.status(500).json({ error: `Error al eliminar el mensaje: ${err.message}` });
    }
};

// Enviar mensaje nuevo
const enviarMensaje = async (req, res) => {
    try {
        const hoy = new Date();
        const mensajeNuevo = {
            fecha: hoy,
            nombre: req.body.nombre,
            email: req.body.email,
            asunto: req.body.asunto,
            mensaje: req.body.mensaje
        };

        // Guardar mensaje en base de datos
        const mensajeAGuardar = new Mensaje(mensajeNuevo);
        const mensajeGuardado = await mensajeAGuardar.save();
        return res.status(200).send(mensajeGuardado);

    } catch (err) {
        return res.status(500).json({error: `Error al enviar el mensaje: ${err.message}`});
    };
};


module.exports = {
    obtenerMensajes,
    eliminarMensaje,
    enviarMensaje
}