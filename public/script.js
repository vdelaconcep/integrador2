// Acción necesaria para el menú hamburguesa
const item = document.querySelectorAll('.dropdown-item');

item.forEach(element => {
    element.addEventListener('click', (event) =>
        event.stopPropagation());
});

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

// Función para cargar tarjetas
const cargarTarjetas = async (cargarPor, parametro) => {
    const data = await buscarProducto(cargarPor, parametro);
    const fragmento = document.createDocumentFragment();
    const divTarjetas = document.getElementById('div-tarjetas');

    data.forEach(elemento => {
        const tipo = elemento.tipo[0].toUpperCase() + elemento.tipo.slice(1);

        const tarjeta = document.createElement('div');
        tarjeta.innerHTML +=
            `<div title="Ver" style="cursor: pointer;">
                <img class="card-img rounded p-2 pb-0 w-100" src="${elemento.imagen}">
                <div class="text-center">
                <h2>${tipo} ${elemento.banda} #${elemento.modelo}</h2>
                <h3 class="text-info">$${elemento.precio}</h3>
                </div>
            </div>
            <div class="hstack mb-3" style="justify-content: center;">
                <div class="hstack pe-2">
                    <label for="cantidad" class="form-label pe-2 pt-1">Cantidad:</label>
                    <select name="cantidad"id="cantidad"class="form-select me-2"style="width: 60px;">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <button class="agregar btn btn-dark" title="Agregar al carrito">Agregar <i class="fa-solid fa-cart-plus"></i></button>
            </div>`;
        tarjeta.classList.add("tarjeta", "bg-white", "sombra", "rounded", "m-2");
        fragmento.appendChild(tarjeta);
    });
    divTarjetas.appendChild(fragmento);
}

// Desde la página "alta"
const alta = document.getElementById('alta');
if (alta) {

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
            alert(`Error en la petición - ${err.message}`);
        }
    });
};

// Función para definir título en las páginas "productos"
const titulo = (tipoProducto) => {
    const titulo = document.getElementById('titulo-productos');
    const tipo = tipoProducto[0].toUpperCase() + tipoProducto.slice(1) + "s";
    titulo.innerHTML += tipo;
    return;
}

// Para cargar tarjetas en las diferentes páginas
const paginaIndex = document.getElementById('index');
const paginaProductos = document.getElementsByClassName('productos')[0];

if (paginaIndex) cargarTarjetas('todos');

if (paginaProductos) {
    const tipoDeProducto = paginaProductos.id.slice(0,-1);
    if (tipoDeProducto === 'producto') {
        titulo('todos los producto');
        cargarTarjetas('todos')
    } else {
        titulo(tipoDeProducto);
        cargarTarjetas('tipo', tipoDeProducto);
    }
};

