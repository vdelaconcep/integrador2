// Declaración de variables
const paginaIndex = document.getElementById('index');
const paginaProductos = document.getElementById('pagina-productos');
const paginaAlta = document.getElementById('alta');
const paginaCarrito = document.getElementById('carrito');
const divCarrito = document.getElementById('tabla-botones-carrito');
const notificacionCarrito = document.getElementById('notificacion-carrito');
const dropdownItem = document.querySelectorAll('.dropdown-item');
const divsBusqueda = document.querySelectorAll('.search-container');

// Función para traer productos de la base de datos
const obtenerDatos = async () => {
    try {
        const res = await fetch('/api/productos', {
            method: 'GET'
        });
        return res.json()
    } catch (err) {
        return alert(`Error al obtener datos: ${err.message}`)
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
const agregarAlCarrito = async (id, cantidadRequerida) => {
    const producto = await buscarProducto('id', id);
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let totalAPagar = parseInt(localStorage.getItem('total')) || 0;

    // Si la cantidad requerida supera al stock, no se puede agregar
    if (producto.stock < cantidadRequerida) return alert('La cantidad agregada al carrito no puede ser mayor al stock disponible');

    // Se chequea si ese producto se encuentra ya en el carrito
    const index = carrito.findIndex(elemento => elemento._id === id);

    if (index !== -1) {
        const nuevaCantidad = carrito[index].cantidad + cantidadRequerida;
        if (producto.stock < nuevaCantidad) return alert('La cantidad agregada al carrito no puede ser mayor al stock disponible');
        carrito[index].cantidad = nuevaCantidad;
    } else {
        producto.cantidad = cantidadRequerida;
        carrito.push(producto);
    }

    // Una vez agregado el producto, se actualiza el total a pagar y se guarda el carrito en localStorage
    totalAPagar = 0;
    carrito.forEach(elemento => {
        totalAPagar += (elemento.precio * elemento.cantidad);
    });
    localStorage.setItem('total', totalAPagar.toString());
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.tipo} ${producto.banda} #${producto.modelo} agregado al carrito`)
    return;
}

// Función para vaciar carrito
const vaciarCarrito = () => {
    const confirmacion = confirm('¿Desea eliminar todos los productos del carrito de compras?')
    if (confirmacion) {
        localStorage.removeItem('carrito');
        localStorage.removeItem('total');
        location.reload();
    }
    return
};

// Función para determinar cantidad de productos en el carrito
const productosCarrito = () => {
    let cantidadProductos = 0;
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(elemento => {
        cantidadProductos += elemento.cantidad;
    });
    return cantidadProductos;
}

// Función para setear las notificaciones del carrito
const setCarrito = () => {
    const cantidadProductos = productosCarrito();
    if (cantidadProductos === 0) {
        notificacionCarrito.style.display = 'none';
    } else notificacionCarrito.innerText = cantidadProductos;
    return;
}

// Función para simular el pago de la compra
const pagarCompra = async () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalAPagar = localStorage.getItem('total') || '0';

    const confirmacion = confirm(`
        Total a abonar: $${totalAPagar}

        ¿Desea realizar el pago de la compra?

        `);
    if (!confirmacion) return;

    try {
        carrito.forEach(async (producto) => {
            const cantidadProducto = producto.cantidad;

            const res = await fetch(`/api/productos/${producto._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ cantidad: cantidadProducto })
            });
            if (!res.ok) {
                const mensaje = await res.text();
                alert(`No se pudo realizar la compra de ${producto.tipo} ${producto.banda} #${producto.modelo}: ${mensaje}`);
            }
        });

        alert('Su compra se ha realizado con éxito');
        localStorage.removeItem('carrito');
        localStorage.removeItem('total');
        window.location.replace('/');
        
    } catch (err) {
        alert(`Error al realizar la compra: ${err.message}`);
    };
};

// Función para actualizar carrito
const actualizarCarrito = async () => {
    let modificacion = false;
    const cantidadProductos = productosCarrito();
    if (cantidadProductos === 0) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    for (const productoCarrito of carrito.slice()) {
        const producto = await buscarPor('id', productoCarrito._id);
        const index = carrito.findIndex(elemento => elemento._id === productoCarrito._id);

        if (index !== -1) {
            if (!producto || producto.stock === 0) {
                carrito.splice(index, 1);
                modificacion = true;
                continue;
            }
            if (productoCarrito.cantidad > producto.stock) {
                carrito[index].cantidad = producto.stock;
                modificacion = true;
            }
            if (carrito[index].precio !== producto.precio) {
                carrito[index].precio = producto.precio;
                modificacion = true;
            }
        }
    }

    if (modificacion) {
        let totalAPagar = 0;
        carrito.forEach(elemento => {
            totalAPagar += elemento.cantidad * elemento.precio;
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('total', totalAPagar.toString());
        alert('Se ha modificado el carrito por cambios en precio y/o stock');
    }
};

// Función para mostrar carrito con productos agregados
const mostrarCarrito = () => {
    const cantidadProductos = productosCarrito();
    const fragmento = document.createDocumentFragment();
    const divGenerado = document.createElement('div');

    if (cantidadProductos === 0) {
        divGenerado.innerHTML += '<h1 class="text-center text-white">No hay ítems para mostrar</h1>';
    } else {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalAPagar = parseInt(localStorage.getItem('total')) || '0';

        const tabla = document.createElement('table');
        tabla.classList.add("table", "table-bordered", "table-striped", "table-hover", "text-center", "table-secondary");
        tabla.innerHTML = `
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th></th>
            </tr> `;
        
        carrito.forEach(producto => {
            const fila = document.createElement('tr');
            fila.id = `F${producto._id}`
            fila.innerHTML += `
                    <td style="text-decoration: underline;" id="D${producto._id}" class="abrir-detalle-producto pointer">${producto.tipo} ${producto.banda} #${producto.modelo}</td>
                    <td><span class="menos pointer pe-3" id="L${producto._id}"> - </span><span id="C${producto._id}">${producto.cantidad}</span><span class="mas pointer ps-3" id="U${producto._id}"> + </span></td>
                    <td id="P${producto._id}">$${producto.cantidad * producto.precio}</td>
                    <td id="E${producto._id}" class="pointer"> X </td>`;
            tabla.appendChild(fila)
        });
        const ultimaFila = document.createElement('tr');
        ultimaFila.innerHTML = `
                    <th class="text-end pe-4" colspan="2">Total</th>
                    <th id="celda-total">$${totalAPagar}</th>
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
const mostrarDetalle = async (id) => {
    const divOverlay = document.querySelector('.overlay');
    const botonCerrar = document.getElementById('btn-cerrar-detalle');
    const imagenDetalle = document.getElementById('imagen-detalle');
    const tituloDetalle = document.getElementById('titulo-detalle');

    try {
        const producto = await buscarProducto('id', id);
        imagenDetalle.src = producto.imagen;
        tituloDetalle.innerText = `${producto.tipo} ${producto.banda} #${producto.modelo}`;
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
        const productoModelo = await modelo(productoBanda.value, productoTipo.value);

        if (!productoModelo) return alert('No se ha podido agregar el producto')

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
                const mensaje = await res.text();
                alert(`Imgur rechazó la imagen: ${mensaje}`);
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
            alert(`Error al guardar producto: ${err.message}`);
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
                location.reload();
            } catch (err) {
                return alert(`No se pudo agregar el producto al carrito: ${err.message}`);
            };
        };

        // Mostrar detalle de producto al hacer click en el título o la imagen
        const abrirDetalle = evento.target.closest('.abrir-detalle');
        if (abrirDetalle) {
            const id = abrirDetalle.id.slice(1);
            mostrarDetalle(id);
        };

    });
};

// Acciones sobre página "carrito"
if (paginaCarrito) {
    actualizarCarrito();
    mostrarCarrito();

    //Al hacer click en un producto del carrito
    divCarrito.addEventListener('click', (evento) => {
        let cantidadProductos = productosCarrito();
        if (cantidadProductos === 0) return;

        const target = evento.target;
        const clases = target.classList;

        if (!target.id) return;
        const idProducto = target.id.slice(1);

        // Variables
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const index = carrito.findIndex(elemento => elemento._id === idProducto);
        if (index === -1) return;

        const producto = carrito[index];
        const cantidadActual = producto.cantidad;
        let totalAPagar = parseInt(localStorage.getItem('total')) || 0;
        let nuevaCantidad = cantidadActual;

        // Mostrar detalle del producto
        if (clases.contains('abrir-detalle-producto')) {
            mostrarDetalle(idProducto);
            return;
        }

        // Modificar cantidad del producto
        if (clases.contains('menos')) {
            if (cantidadActual === 1) {
                const confirmacion = confirm('¿Desea eliminar el producto del carrito?');
                if (confirmacion) {
                    // Eliminar producto del carrito y del DOM
                    carrito.splice(index, 1);
                    totalAPagar -= producto.precio;
                    document.getElementById(`F${idProducto}`).style.display = 'none';

                    // Si ya no quedan productos
                    if (carrito.length === 0) {
                        localStorage.removeItem('total');
                        localStorage.removeItem('carrito');
                        divCarrito.innerHTML = '<h1 class="text-center text-white">No hay ítems para mostrar</h1>';
                        return;
                    }

                    // Actualizar localStorage
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    localStorage.setItem('total', totalAPagar.toString());

                    // Actualizar DOM
                    document.getElementById('celda-total').innerHTML = `$${totalAPagar}`;
                    return;
                } else {
                    return;
                }
            } else {
                nuevaCantidad = cantidadActual - 1;
                totalAPagar -= producto.precio;
            }
        }

        if (clases.contains('mas')) {
            nuevaCantidad = cantidadActual + 1;
            if (nuevaCantidad > producto.stock) {
                alert('No hay stock suficiente en este momento');
                return;
            }
            totalAPagar += producto.precio;
        }

        producto.cantidad = nuevaCantidad;
        carrito[index] = producto;

        // Actualización del DOM
        document.getElementById(`C${idProducto}`).innerHTML = nuevaCantidad;
        document.getElementById(`P${idProducto}`).innerHTML = `$${nuevaCantidad * producto.precio}`;
        document.getElementById('celda-total').innerHTML = `$${totalAPagar}`;

        // Actualización en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('total', totalAPagar.toString());
    });
} else {
    setCarrito();
};






