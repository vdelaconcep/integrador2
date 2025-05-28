// Declaración de variables
const paginaIndex = document.getElementById('index');
const paginaProductos = document.getElementById('pagina-productos');
const paginaAlta = document.getElementById('alta');
const paginaCarrito = document.getElementById('carrito');
const divCarrito = document.getElementById('tabla-botones-carrito');
const notificacionCarrito = document.getElementById('notificacion-carrito');
const dropdownItem = document.querySelectorAll('.dropdown-item');
const divsBusqueda = document.querySelectorAll('.search-container');
let total = 0;

// Función para traer productos de la base de datos
const obtenerDatos = async () => {
    try {
        const res = await fetch('/api/productos', {
            method: 'GET'
        });
        return res.json()
    } catch (err) {
        alert(`Error al obtener los datos: ${err.message}`)
    }
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
            return mismoId;
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
    if (producto.stock < cantidad) {
        alert('La cantidad agregada al carrito no puede ser mayor al stock disponible');
        return;
    }
    producto.cantidad = cantidad;
    const productoAgregado = JSON.stringify(producto);
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
    const confirmacion = confirm('¿Desea eliminar todos los productos del carrito de compras?')
    if (confirmacion) {
        localStorage.clear();
        location.reload();
    }
    return
};

// Función para setear las notificaciones del carrito
const setCarrito = () => {
    if (localStorage.length === 0) {
        notificacionCarrito.style.display = 'none';
    } else {
        let contador = 0;
        const objetos = datosLocalStorage();
        objetos.forEach(elemento => {
            elementoObjeto = JSON.parse(elemento);
            contador += elementoObjeto.cantidad;
        });
        notificacionCarrito.innerText = contador;
    }
    return;
}

// Función para simular el pago de la compra
const pagarCompra = async () => {
    const confirmacion = confirm('¿Desea realizar la compra?');
    if (!confirmacion) return;

    const objetos = datosLocalStorage();
    try {
        objetos.forEach(async (producto) => {
            const objetoProducto = JSON.parse(producto);
            const cantidadProducto = objetoProducto.cantidad;
            const datos = {
                cantidad: cantidadProducto
            };
            const res = await fetch(`/api/productos/${objetoProducto._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(datos)
            });
            if (!res.ok) {
                const mensaje = await res.text();
                alert(`Error al comprar ${objetoProducto.tipo} ${objetoProducto.banda} #${objetoProducto.modelo}: ${mensaje}`)
            }
        });
        localStorage.clear();
        window.location.replace('/');
        alert('Su compra se ha realizado con éxito')
    } catch (err) {
        alert(`Error al pagar la compra: ${err.message}`);
    };
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

        const tabla = document.createElement('table');
        tabla.classList.add("table", "table-bordered", "table-striped", "table-hover", "text-center", "table-secondary");
        tabla.innerHTML = `
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th></th>
            </tr> `;
        
        objetos.forEach(producto => {
            const objetoProducto = JSON.parse(producto);
            total += (objetoProducto.cantidad * objetoProducto.precio);
            const fila = document.createElement('tr');
            fila.id = `F${objetoProducto._id}`
            fila.innerHTML += `
                    <td style="text-decoration: underline;" id="D${objetoProducto._id}" class="abrir-detalle-producto pointer">${objetoProducto.tipo} ${objetoProducto.banda} #${objetoProducto.modelo}</td>
                    <td><span class="menos pointer pe-3" id="L${objetoProducto._id}"> - </span><span id="C${objetoProducto._id}">${objetoProducto.cantidad}</span><span class="mas pointer ps-3" id="U${objetoProducto._id}"> + </span></td>
                    <td id="P${objetoProducto._id}">$${objetoProducto.cantidad * objetoProducto.precio}</td>
                    <td class="pointer"> X </td>`;
            tabla.appendChild(fila)
        });
        const ultimaFila = document.createElement('tr');
        ultimaFila.innerHTML = `
                    <th class="text-end pe-4" colspan="2">Total</th>
                    <th id="celda-total">$${total}</th>
                    <th></th>`
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

// Función para mostrar detalle del producto
const mostarDetalle = async (id) => {
    const divOverlay = document.querySelector('.overlay');
    const botonCerrar = document.getElementById('btn-cerrar-detalle');
    const imagenDetalle = document.getElementById('imagen-detalle');
    const tituloDetalle = document.getElementById('titulo-detalle');

    try {
        const productoDetalle = await buscarProducto('id', id);
        imagenDetalle.src = productoDetalle.imagen;
        tituloDetalle.innerText = `${productoDetalle.tipo} ${productoDetalle.banda} #${productoDetalle.modelo}`;
        divOverlay.style.display = 'block';
        botonCerrar.addEventListener('click', () => {
            divOverlay.style.display = 'none';
        });
    } catch (err) {
        alert(`No se puede mostrar el detalle del producto: ${err.message}`);
    };
    botonCerrar.addEventListener('click', () => {
        divOverlay.style.display = 'none';
    });
}

// Acción necesaria para el menú hamburguesa
dropdownItem.forEach(element => {
    element.addEventListener('click', (event) =>
        event.stopPropagation());
});

// Acciones desde la página "alta"
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

// Acciones en páginas donde se muestran productos
if (paginaIndex || paginaProductos) {

    const divTarjetas = document.getElementById('div-tarjetas');
    divTarjetas.addEventListener('click', async (evento) => {

        // Agregar ítem al carrito
        if (evento.target.classList.contains("agregar")) {
            const id = evento.target.id;
            const inputCantidad = document.getElementById(`cantidad-${id}`);
            const cantidad = parseInt(inputCantidad.value);

            try {
                await agregarAlCarrito(id, cantidad);
                alert('Se agregó el producto al carrito');
                location.reload();
            } catch (err) {
                alert(`No se pudo agregar el producto al carrito: ${err.message}`);
            };
        };

        // Mostrar detalle de producto al hacer click en el título o la imagen
        const abrirDetalle = evento.target.closest('.abrir-detalle');
        if (abrirDetalle) {
            const id = abrirDetalle.id.slice(1);
            mostarDetalle(id);
        };

    });
};

// Acciones sobre página "carrito"
if (paginaCarrito) {
    mostrarCarrito();

    // Modificar cantidad o eliminar producto del carrito
    const detalleProductoCarrito = document.querySelector('.abrir-detalle-producto'); 
    detalleProductoCarrito.addEventListener('click', async (evento) => {
        const idProducto = evento.target.id.slice(1);

        if (!idProducto) return;

        mostarDetalle(idProducto);
    });

    divCarrito.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('menos')) {
            const idProducto = evento.target.id.slice(1);
            const objetos = datosLocalStorage();

            const productoCarrito = objetos.find(elemento => JSON.parse(elemento)._id === idProducto);
            const productoCarritoJson = JSON.parse(productoCarrito);
            const cantidadActual = productoCarritoJson.cantidad;
            const precio = productoCarritoJson.precio;

            if (cantidadActual === 1) {
                const confirmacion = confirm('¿Desea eliminar el producto del carrito?');
                if (confirmacion) {
                    const filaProducto = document.getElementById(`F${idProducto}`);
                    filaProducto.style.display = 'none';
                    localStorage.removeItem(`${idProducto}`);
                    total = total - precio;
                    document.getElementById('celda-total').innerHTML = `$${total}`;
                } else return
            } else {
                const cantidadNueva = cantidadActual - 1;
                productoCarritoJson.cantidad = cantidadNueva;
                const productoCarritoString = JSON.stringify(productoCarritoJson);
                localStorage.setItem(idProducto, productoCarritoString);
                document.getElementById(`C${idProducto}`).innerHTML = cantidadNueva;
                document.getElementById(`P${idProducto}`).innerHTML = cantidadNueva * precio;
                total = total - precio;
                document.getElementById('celda-total').innerHTML = `$${total}`;
            }
        }
    })

} else setCarrito();






