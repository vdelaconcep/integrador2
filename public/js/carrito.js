import { buscarProducto } from './consultasBD.js';

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

    alert(`${producto.tipo} ${producto.banda} #${producto.modelo} agregado al carrito`);
    return;
};

// Función para mostrar detalle del producto
const mostrarDetalle = async (id) => {
    const divOverlay = document.querySelector('.overlay');
    const imagenDetalle = document.getElementById('imagen-detalle');
    const tituloDetalle = document.getElementById('titulo-detalle');

    try {
        const producto = await buscarProducto('id', id);

        // Por si ya no existe la url de la imagen (o url está vacía)
        if (!producto.imagen || producto.imagen.trim() === '') {
            imagenDetalle.src = '../assets/img/no-disponible.jpg';
            imagenDetalle.alt = 'Imagen no disponible';
        } else {
            imagenDetalle.onerror = () => {
                imagenDetalle.onerror = null;
                imagenDetalle.src = '../assets/img/no-disponible.jpg';
                imagenDetalle.alt = 'Imagen no disponible';
            };
            imagenDetalle.src = producto.imagen;
        }
        imagenDetalle.src = producto.imagen;
        tituloDetalle.innerText = `${producto.tipo} ${producto.banda} #${producto.modelo}`;
        divOverlay.style.display = 'block';

    } catch (err) {
        alert(`No se puede mostrar el detalle del producto: ${err.message}`);
    };
    divOverlay.addEventListener('click', (evento) => {
        const targetId = evento.target.id;
        if (targetId !== "imagen-detalle" && targetId !== "titulo-detalle") divOverlay.style.display = 'none';
    });
}

// Función para vaciar carrito
const vaciarCarrito = () => {
    const confirmacion = confirm('¿Desea eliminar todos los productos del carrito de compras?');
    if (confirmacion) {
        localStorage.removeItem('carrito');
        localStorage.removeItem('total');
        location.reload();
    }
    return;
};

// Función para simular el pago de la compra
const pagarCompra = async () => {
    const carrito = localStorage.getItem('carrito') || "";
    const totalAPagar = localStorage.getItem('total') || '0';

    const confirmacion = confirm(`
        Total a abonar: $${totalAPagar}

        ¿Desea realizar el pago de la compra?
        `);
    if (!confirmacion) return;

    if (carrito === "") return alert('El carrito se encuentra vacío');

    try {
            const res = await fetch(`/api/productos/comprar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ carrito: carrito })
            });
            if (!res.ok) {
                const mensaje = await res.text();
                return alert(`No se pudo realizar la compra:
                    ${mensaje}`);
            };

        alert('Su compra se ha realizado con éxito');
        localStorage.removeItem('carrito');
        localStorage.removeItem('total');
        window.location.replace('/');

    } catch (err) {
        return alert(`Error al realizar la compra:
            ${err.message}`);
    };
};

// Función para obtener productos del carrito
const productosCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    return carrito;
};

// Función para mostrar carrito con productos agregados
const mostrarCarrito = () => {
    const divCarrito = document.getElementById('tabla-botones-carrito');
    const carrito = productosCarrito();
    let cantidadProductos = 0;
    carrito.forEach(elemento => cantidadProductos += elemento.cantidad);
    const fragmento = document.createDocumentFragment();
    const divGenerado = document.createElement('div');
    const tabla = document.createElement('table');
    tabla.style.margin = "0";

    if (cantidadProductos === 0) {
        divGenerado.innerHTML += `<h3 class="text-center text-white mt-5 mb-2">Todavía no hay ítems para mostrar</h3>
        <h5 class="text-center text-white mb-5">Te esperamos en nuestra sección "productos"</h5>`;
    } else {
        const totalAPagar = parseInt(localStorage.getItem('total')) || '0';

        const divTabla = document.createElement('div');
        divTabla.style.borderRadius = "10px";
        divTabla.style.overflow = "hidden";
        divTabla.style.padding = "0";
        divTabla.style.margin = "5% 0";
        
        tabla.innerHTML = `
            <thead id="thead-carrito">
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th></th>
                </tr>
            </thead> `;
        
        const tbody = document.createElement('tbody');

        carrito.forEach(producto => {
            const fila = document.createElement('tr');
            fila.id = `F${producto._id}`;
            fila.innerHTML += `
                    <td id="D${producto._id}" class="abrir-detalle-producto pointer hoveru align-middle text-decoration-underline">${producto.tipo} ${producto.banda} #${producto.modelo}</td>
                    <td data-titulo="Cantidad" class="align-middle"><span class="menos pointer pe-3" id="L${producto._id}"> - </span><span id="C${producto._id}">${producto.cantidad}</span><span class="mas pointer ps-3" id="U${producto._id}"> + </span></td>
                    <td data-titulo="Precio" class="align-middle" id="P${producto._id}">$${producto.cantidad * producto.precio}</td>
                    <td data-titulo="Eliminar" id="E${producto._id}" class="eliminar pointer align-middle hoveru" title="eliminar"> X </td>`;
            tbody.appendChild(fila);
        });
        tbody.innerHTML += `
            <tr id="ultima-fila-carrito">
                <th class="text-end pe-4" colspan="2" id="ultimo-th-2">Total</th>
                    <th id="celda-total">$${totalAPagar}</th>
                    <th id="ultimo-th-1"></th>
            </tr>`;
        tabla.appendChild(tbody);
        tabla.classList.add("table", "table-bordered", "table-striped", "table-responsive", "text-center", "table-dark");
        tabla.id = "tabla-carrito";
        divTabla.appendChild(tabla);
        divGenerado.appendChild(divTabla);

        divGenerado.innerHTML += `
            <div class="text-center text-md-end pe-md-5 mb-5">
                <button class="vaciar btn btn-dark" onclick="vaciarCarrito()">Vaciar carrito <i class="fa-solid fa-xmark"></i></button>
                <button class="pagar btn btn-dark" onclick="pagarCompra()">Ir a pagar <i class="fa-solid fa-handshake-simple"></i></button>
            </div>`;
    }
    fragmento.appendChild(divGenerado);
    divCarrito.appendChild(fragmento);
}

// Función para setear las notificaciones del carrito
const setCarrito = () => {
    const carrito = productosCarrito();
    const notificacionCarrito = document.getElementById('notificacion-carrito');
    let cantidadProductos = 0;
    carrito.forEach(elemento => cantidadProductos += elemento.cantidad);
    if (cantidadProductos === 0) {
        notificacionCarrito.style.display = 'none';
    } else notificacionCarrito.innerText = cantidadProductos;
    return;
};

// Función para actualizar carrito
const actualizarCarrito = async () => {
    let modificacion = false;
    const carrito = productosCarrito();
    let cantidadProductos = 0;
    carrito.forEach(elemento => cantidadProductos += elemento.cantidad);
    if (cantidadProductos === 0) return;

    for (const productoCarrito of carrito.slice()) {
        const producto = await buscarProducto('id', productoCarrito._id);
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

    let totalAPagar = 0;
    carrito.forEach(elemento => {
        totalAPagar += elemento.cantidad * elemento.precio;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('total', totalAPagar.toString());

    if (modificacion) {
        
        alert('Se ha modificado el carrito por cambios en precio y/o stock');
    }
};

const eliminarProductoCarrito = (carrito, index) => {
    const id = carrito[index]._id;
    const fila = document.getElementById(`F${id}`);

    carrito.splice(index, 1);
    if (fila) fila.remove();

    let total = 0;
    carrito.forEach(elemento => {
        total += elemento.precio * elemento.cantidad;
    });

    // Si ya no quedan productos
    if (carrito.length === 0) {
        localStorage.removeItem('total');
        localStorage.removeItem('carrito');
        document.getElementById('tabla-botones-carrito').innerHTML = '<h1 class="text-center text-white">No hay ítems para mostrar</h1>';
        return;
    }

    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('total', total.toString());

    // Actualizar DOM
    document.getElementById('celda-total').innerHTML = `$${total}`;
};

window.vaciarCarrito = vaciarCarrito;
window.pagarCompra = pagarCompra;

export {
    agregarAlCarrito,
    mostrarDetalle,
    mostrarCarrito,
    productosCarrito,
    setCarrito,
    actualizarCarrito,
    eliminarProductoCarrito
};