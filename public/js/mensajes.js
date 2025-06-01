import { obtenerMensajes } from "./consultasBD.js";

// Función para mostrar mensajes en una tabla
const mostrarMensajes = async () => {
    const divMensajes = document.getElementById('tabla-mensajes');
    const mensajes = await obtenerMensajes();
    let cantidadMensajes = 0;
    mensajes.forEach(elemento => cantidadMensajes +=elemento.cantidad);
    const fragmento = document.createDocumentFragment();
    const divGenerado = document.createElement('div');
    divGenerado.classList.add("pb-5");

    if (cantidadMensajes === 0) {
        divGenerado.innerHTML += '<h1 class="text-center text-white">No hay mensajes para mostrar</h1>';
    } else {
        divGenerado.innerHTML += '<p class="text-center text-white">Hacé click en "asunto" para ver el contenido del mensaje</p>';
        const divTabla = document.createElement('div');
        divTabla.style.borderRadius = "10px";
        divTabla.style.overflow = "hidden";
        divTabla.style.paddingBottom = "0";

        const tabla = document.createElement('table');
        
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>Fecha y hora</th>
                    <th>Nombre</th>
                    <th>E-mail</th>
                    <th>Asunto</th>
                    <th></th>
                </tr>
            </thead>`;

        const tbody = document.createElement('tbody');

        mensajes.forEach(mensaje => {
            const fila = document.createElement('tr');
            fila.id = `F${mensaje._id}`;

            fila.innerHTML = `
                    <td class="align-middle">${mensaje.fecha.slice(4, 21)}</td>
                    <td class="align-middle">${mensaje.nombre}</td>
                    <td class="align-middle">${mensaje.email}</td>
                    <td class="hoveru align-middle">${mensaje.asunto}</td>
                    <td class="align-middle eliminar pointer"> X </td>
                `;

            tbody.appendChild(fila);
        });

        tabla.appendChild(tbody);

        tabla.classList.add("table", "table-bordered","table-striped", "table-dark",  "text-center", "mb-0");
        divTabla.appendChild(tabla);
        divGenerado.appendChild(divTabla);
    }
    fragmento.appendChild(divGenerado);
    divMensajes.appendChild(fragmento);
    return;
};

// Función para eliminar mensaje
const eliminarMensaje = async (id) => {
    const fila = document.getElementById(`F${id}`)
    const confirmacion = confirm('¿Desea eliminar el mensaje?');
    if (confirmacion) {
        try {
            const res = await fetch(`/api/mensajes/${id}`, {
                method: 'DELETE'
            });

            const mensajeError = await res.text()

            if (!res.ok) {
                alert(`No se ha podido eliminar el mensaje: ${mensajeError}`);
                return;
            };
            alert('El mensaje se ha eliminado');
            fila.style.display = 'none';

        } catch (err) {
            alert(`No se ha podido eliminar el mensaje: ${err.message}`)
        };
    }
}

export {
    mostrarMensajes,
    eliminarMensaje
};