
// Función para dar de baja un producto de la base de datos
const bajaProducto = async (id) => {
    const fila = document.getElementById(`F${id}`);
    const confirmacion = confirm('¿Desea dar de baja el producto?');
    if (confirmacion) {
        try {
            const res = await fetch(`/api/productos/${id}`, {
                method: 'DELETE'
            });

            const mensajeError = await res.text();

            if (!res.ok) {
                alert(`No se ha podido dar de baja el producto: ${mensajeError}`);
                return;
            };
            alert('El producto se ha eliminado de la base de datos');
            fila.style.display = 'none';

        } catch (err) {
            alert(`No se ha podido dar de  baja el producto: ${err.message}`);
        };
    }
};

// Función para modificar el precio de un producto
const modificarPrecio = async (id) => {
    let precioString = ""
    const esFloatPositivo = (string) => {
        return /^\d+(\.\d{1,2})?$/.test(string.trim());
    };

    const ingresarPrecio = () => {
        while (true) {
            precioString = prompt('Ingresá el nuevo precio');
            if (precioString === null) return null;

            if (esFloatPositivo(precioString)) {
                return precioString;
            } else {
                alert('Debe ingresar un número positivo de hasta dos decimales')
            };
        }
    }

    const precioValido = ingresarPrecio();

    if (!precioValido) return

    const precioNuevo = parseInt(precioValido);
    const datos = { precio: precioNuevo };

    try {
        const res = await fetch(`/api/productos/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(datos)
        });

        if (!res.ok) {
            const mensajeError = await res.text();
            alert(`Error al actualizar precio: ${mensajeError}`);
        } else {
            alert('Se actualizó el precio del producto');
            window.location.replace('/admin');
        }
    } catch (err) {
        alert(`Error al actualizar el precio: ${err.message}`);
    };
};

// Función para agregar stock de producto
const agregarStock = async (id) => {
    let cantidadString = "";
    const esEntero = (string) => {
        return /^-?\d+$/.test(string);
    };

    const ingresarStockAgregado = () => {
        while (true) {
            cantidadString = prompt('Ingresá la cantidad de ítems a agregar');
            if (cantidadString === null) return null;

            if (esEntero(cantidadString)) {
                return cantidadString;
            } else {
                alert('Se debe ingresar un número entero positivo');
            };
        }
    };

    const cantidadValida = ingresarStockAgregado();

    if (!cantidadValida) return

    const cantidad = parseInt(cantidadValida);
    const datos = { agregado: cantidad };

    try {
        const res = await fetch(`/api/productos/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(datos)
        });

        if (!res.ok) {
            const mensajeError = await res.text();
            alert(`Error al actualizar stock: ${mensajeError}`);
        } else {
            alert('Se actualizó el stock del producto');
            window.location.replace('/admin');
        }
    } catch (err) {
        alert(`Error al actualizar el stock: ${err.message}`);
    };
}

export {
    bajaProducto,
    agregarStock,
    modificarPrecio
};