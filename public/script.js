// Declaración de variables
const paginaAlta = document.getElementById('alta');
const dropdownItem = document.querySelectorAll('.dropdown-item');

// Función para traer productos de la base de datos
const obtenerDatos = async () => {
    const res = await fetch('/api/productos', {
        method: 'GET'
    });
    return res.json()
};

// Función para buscar productos
const buscarProducto = async (buscarPor, parametro = null) => {
    const dataCompleta = await obtenerDatos();
    let resultados = [];

    dataCompleta.forEach(elemento => {
        if (buscarPor === 'banda') {
            const bandaGuardada = elemento.banda.trim().toLowerCase();
            const mismaBanda = bandaGuardada.includes(parametro.trim().toLowerCase());
            if (mismaBanda) {
                resultados.push(elemento);
            } else return null;

        } else if (buscarPor === 'tipo') {
            const mismoTipo = (elemento.tipo == parametro);
            if (mismoTipo) {
                resultados.push(elemento);
            } else return null;

        }
    });

    if (buscarPor === 'id') {
        const mismoId = dataCompleta.find(element => element._id == parametro);
        if (mismoId) {
            resultados.push(elemento);
        } else return null;
    }

    if (buscarPor === 'todos') resultados = dataCompleta;

    return resultados;
}

// Función para definir modelo
const modelo = async (banda, tipoDeProducto) => {
    const modelosAnteriores = await buscarProducto('banda', banda);
    let a = 0;
    let modeloActual = 0;
    if (modelosAnteriores) {
        modelosAnteriores.forEach(elemento => {
            if (elemento.tipo === tipoDeProducto) a++;
        });
        modeloActual = a + 1;
    }
    return modeloActual;
};

// Acción necesaria para el menú hamburguesa
dropdownItem.forEach(element => {
    element.addEventListener('click', (event) =>
        event.stopPropagation());
});

// Cargar un producto nuevo en la base de datos desde la página "alta"
if (paginaAlta) {

    // Evento al presionar el botón "enviar" desde alta
    document.getElementById('btn-enviar-alta').addEventListener('click', async (e) => {
        e.preventDefault();

        const productoTipo = document.getElementById('producto-tipo');
        const productoBanda = document.getElementById('producto-banda');
        const productoStock = document.getElementById('producto-stock');
        const productoPrecio = document.getElementById('producto-precio');

        let productoModelo;
        try {
            productoModelo = await modelo(productoBanda.value, productoTipo.value);
        } catch (err) {
            alert(`Error al obtener datos: ${err.message}`);
        };

        // Subir imagen a Imgur
        const fileInput = document.getElementById('imagen-producto');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("image", file);

        let productoImagen = '';

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const json = await res.json();

            if (!res.ok) {
                alert(`Imgur rechazó la imagen: ${json.data?.error || 'Error desconocido'}`);
                return;
            }

            productoImagen = json.link;
            console.log(productoImagen);

        } catch (err) {
            alert(`No se ha podido enviar la imagen: ${err.message}`);
        }

        // Enviar datos a la base de datos
        const datos = {
            tipo: productoTipo.value,
            banda: productoBanda.value,
            modelo: productoModelo,
            stock: productoStock.value,
            precio: productoPrecio.value,
            imagen: productoImagen
        };

        try {
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(datos)
            });
            if (res.status === 200) {
                alert('Se guardó el nuevo producto');
                window.location.replace('/alta');
            } else {
                alert('No se han podido guardar los datos');
            }
        } catch (err) {
            alert(`Error en la petición: ${err.message}`);
        }
    });
};