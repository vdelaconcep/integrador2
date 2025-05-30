// Función para traer todos los productos de la base de datos
const obtenerProductos = async () => {
    try {
        const res = await fetch('/api/productos', {
            method: 'GET'
        });
        return res.json();
    } catch (err) {
        return alert(`Error al obtener datos: ${err.message}`);
    }
};

// Función para buscar un producto en la base de datos (por banda o por ID)
const buscarProducto = async (buscarPor, parametro = null) => {
    const dataCompleta = await obtenerProductos();

    let resultados = [];

    dataCompleta.forEach(elemento => {
        if (buscarPor === 'banda') {
            const bandaGuardada = elemento.banda.trim().toLowerCase();
            const mismaBanda = bandaGuardada.includes(parametro.trim().toLowerCase());
            if (mismaBanda) {
                resultados.push(elemento);
            } else return null;
        }
    });

    if (buscarPor === 'id') {
        const mismoId = dataCompleta.find(elemento => elemento._id == parametro);
        if (mismoId) {
            return mismoId;
        } else return null;
    }

    return resultados;
};

// Función para obtener todos los mensajes de la base de datos
const obtenerMensajes = async () => {
    try {
        const res = await fetch('/api/mensajes', {
            method: 'GET'
        });
        return res.json();
    } catch (err) {
        return alert(`Error al obtener datos: ${err.message}`);
    }
}

export {
    buscarProducto,
    obtenerMensajes
    };