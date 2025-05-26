// Declaración de variables
const paginaAlta = document.getElementById('alta');
const paginaCarrito = document.getElementById('carrito');
const divCarrito = document.getElementById('tabla-botones-carrito');
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
        const mismoId = dataCompleta.find(elemento => elemento._id == parametro);
        if (mismoId) {
            resultados.push(mismoId);
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

// Función para agregar un producto al carrito
const agregarAlCarrito = async (id, cantidad) => {
    const producto = await buscarProducto('id', id);
    let objeto = producto[0];
    if (objeto.stock < cantidad) {
        alert('La cantidad agregada al carrito no puede ser mayor al stock disponible');
        return;
    }
    objeto.cantidad = cantidad;
    const productoAgregado = JSON.stringify(objeto);
    localStorage.setItem(id, productoAgregado);
    return;
}

// Función para recuperar datos del localStorage
const datosLocalStorage = () => {
    let objetos = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        objetos[i] = value;
    }
    return objetos;
}

// Función para vaciar carrito
const vaciarCarrito = () => {
    localStorage.clear();
    location.reload();
};

// Función para simular el pago de la compra
const pagarCompra = async () => {
    const confirmacion = confirm('¿Desea realizar la compra?');
    if (!confirmacion) return;

    const objetos = datosLocalStorage();
    try {
        objetos.forEach(async (producto) => {
            const objetoProducto = JSON.parse(producto);
            const stockActualizado = objetoProducto.stock - objetoProducto.cantidad;
            const datos = {
                stock: stockActualizado
            };
            const res = await fetch(`/api/productos/${objetoProducto._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(datos)
            });
        });
    } catch (err) {
        alert(`Error al modificar el stock: ${err.message}`);
    };
    localStorage.clear();
    window.location.replace('/');
};

// Función para mostrar carrito con productos agregados
const mostrarCarrito = () => {
    const localStorageLength = localStorage.length;
    const fragmento = document.createDocumentFragment();
    const divGenerado = document.createElement('div');

    if (localStorageLength === 0) {
        divGenerado.innerHTML += '<h1 class="text-center text-white">No hay ítems para mostrar</h1>';
    } else {
        const objetos = datosLocalStorage();

        let total = 0;

        const tabla = document.createElement('table');
        tabla.classList.add("table", "table-bordered", "table-striped", "table-hover", "text-center", "table-secondary")
        tabla.innerHTML = `
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
            </tr> `;
        
        objetos.forEach(producto => {
            const objetoProducto = JSON.parse(producto);
            total += (objetoProducto.cantidad * objetoProducto.precio);
            const fila = document.createElement('tr')
            fila.innerHTML += `
                    <td>${objetoProducto.tipo} ${objetoProducto.banda} #${objetoProducto.modelo}</td>
                    <td>${objetoProducto.cantidad}</td>
                    <td>$${objetoProducto.cantidad * objetoProducto.precio}</td>`;
            tabla.appendChild(fila)
        });
        const ultimaFila = document.createElement('tr');
        ultimaFila.innerHTML = `
                    <th class="text-end pe-4" colspan="2">Total</th>
                    <th>$${total}</th>`
        tabla.appendChild(ultimaFila);
        divGenerado.appendChild(tabla);

        divGenerado.innerHTML += `
            <div class="text-end pe-2 mb-5">
                <button class="vaciar btn btn-dark" onclick="vaciarCarrito()">Vaciar carrito <i class="fa-solid fa-xmark"></i></button>
                <button class="pagar btn btn-dark" onclick="pagarCompra()">Ir a pagar <i class="fa-solid fa-handshake-simple"></i></button>
            </div>`
    }
    fragmento.appendChild(divGenerado);
    divCarrito.appendChild(fragmento);
}

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

if (paginaCarrito) {
    mostrarCarrito();
};