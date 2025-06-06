const { check } = require('express-validator');

const reglasValidacionCompra = [
    check("carrito")
        .custom((value, { req }) => {
            let carrito = req.body.carrito

            if (!carrito || carrito.length === 0) {
                throw new Error("Enviar carrito de compras");
            }

            try {
                carrito = JSON.parse(carrito);
            } catch (error) {
                throw new Error("El carrito no es un JSON válido");
            }

            for (const producto of carrito) {
                if (!producto._id || producto._id === "")
                    throw new Error("Cada producto debe tener un ID");

                if (
                    producto.cantidad === undefined ||
                    producto.cantidad === "" ||
                    isNaN(producto.cantidad)
                ) {
                    throw new Error("Cada producto debe tener una cantidad válida");
                }

                if (typeof producto.cantidad !== "number") {
                    throw new Error("Las cantidades deben ser números");
                }
            }

            return true;
        })
];

module.exports = { reglasValidacionCompra };