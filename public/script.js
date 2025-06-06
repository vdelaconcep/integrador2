// Funciones de otros módulos
import {
    bajaProducto,
    agregarStock,
    modificarPrecio
} from './js/admin.js';
import { agregarProducto } from './js/alta.js';
import {
    agregarAlCarrito,
    mostrarDetalle,
    mostrarCarrito,
    productosCarrito,
    setCarrito,
    actualizarCarrito,
    eliminarProductoCarrito
} from './js/carrito.js';
import {
    validarNombre,
    validarEmail,
    validarAsunto,
    validarMensaje,
    enviarMensaje
} from './js/contacto.js';
import {
    eliminarMensaje,
    mostrarMensaje
} from './js/mensajes.js';

// Declaración de variables
const paginaIndex = document.getElementById('index');
const paginaProductos = document.getElementById('pagina-productos');
const paginaAlta = document.getElementById('pagina-alta');
const paginaVentas = document.getElementById('pagina-ventas');
const paginaMensajes = document.getElementById('pagina-mensajes');
const paginaCarrito = document.getElementById('pagina-carrito');
const paginaContacto = document.getElementById('pagina-contacto');
const paginaAdmin = document.getElementById('panel-administrador');
const dropdownItem = document.querySelectorAll('.dropdown-item');

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

        agregarProducto();

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
    await actualizarCarrito();
    mostrarCarrito();

    const divCarrito = document.getElementById('tabla-botones-carrito');

    //Al hacer click en un producto del carrito
    divCarrito.addEventListener('click', (evento) => {
        const carrito = productosCarrito();
        if (carrito.length === 0) return;

        const target = evento.target;
        const clases = target.classList;

        if (!target.id) return;

        // Variables
        const idProducto = target.id.slice(1);
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
        if (clases.contains('menos') || clases.contains('eliminar')) {
            if (cantidadActual === 1 || clases.contains('eliminar')) {
                const confirmacion = confirm('¿Desea eliminar el producto del carrito?');
                if (confirmacion) {
                    // Eliminar producto del carrito y del DOM
                    eliminarProductoCarrito(carrito, index);
                    return;
                } else {
                    return;
                }
            } else if (!clases.contains('eliminar')) {
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
    if (!paginaAdmin && !paginaMensajes && !paginaAlta && !paginaVentas) setCarrito();
};

// Acciones sobre página "contacto"
if (paginaContacto) {
    const btnEnviar = document.getElementById('btn-enviar');
    
    btnEnviar.addEventListener('click', (evento) => {

        // Variables
        const inputNombre = document.getElementById('input-nombre');
        const inputEmail = document.getElementById('input-email');
        const inputAsunto = document.getElementById('input-asunto');
        const textoMensaje = document.getElementById('mensaje');

        const nombre = validarNombre(inputNombre, 3, 30);
        const email = validarEmail(inputEmail);
        const asunto = validarAsunto(inputAsunto, 40);
        const mensaje = validarMensaje(textoMensaje, 240);

        if (!nombre) inputNombre.reportValidity();
        else if (!email) inputEmail.reportValidity();
        else if (!asunto) inputAsunto.reportValidity();
        else if (!mensaje) textoMensaje.reportValidity();
        else {
            evento.preventDefault();
            enviarMensaje(nombre, email, asunto, mensaje);
        }
    });
};

// Acciones en panel de administrador
if (paginaAdmin) {
    const btnAtrasAdmin = document.getElementById('a-admin-atras');
    btnAtrasAdmin.style.display = 'none';

    const tablaAdmin = document.getElementById('tabla-admin');
    tablaAdmin.addEventListener('click', (evento) => {
        const clases = evento.target.classList;
        const id = evento.target.parentNode.id.slice(1);

        // Eliminar producto de la base de datos (baja)
        if (clases.contains('eliminar')) {
            bajaProducto(id);
        } else if (clases.contains('agregar-stock')) {
            agregarStock(id);
        } else if (clases.contains('cambiar-precio')) {
            modificarPrecio(id);
        } else if (clases.contains('detalle')) {
            mostrarDetalle(id);
        };
    })
};

// Acciones en página mensajes
if (paginaMensajes) {
    const tablaMensajes = document.getElementById('tabla-mensajes');
    const divOverlay = document.querySelector('.overlay');

    tablaMensajes.addEventListener('click', (evento) => {
        const clases = evento.target.classList;
        const id = evento.target.parentNode.id.slice(1);

        if (clases.contains('eliminar')) {
            eliminarMensaje(id);
        } else if (clases.contains('asunto')) {
            mostrarMensaje(id)
        }
    })
}








