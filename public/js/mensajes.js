import { obtenerMensajes } from "./consultasBD.js";

// Función para obtener mensajes de la base de datos
const mostrarMensajes = async () => {
    const divMensajes = document.getElementById('tabla-mensajes');
        const mensajes = await obtenerMensajes();
        let cantidadMensajes = 0;
        mensajes.forEach(elemento => cantidadMensajes += elemento.cantidad);
        const fragmento = document.createDocumentFragment();
        const divGenerado = document.createElement('div');
    
        if (cantidadMensajes === 0) {
            divGenerado.innerHTML += '<h1 class="text-center text-white">No hay mensajes para mostrar</h1>';
        } else {
            divGenerado.innerHTML += '<h3 class="text-center text-white">Hacé click en "asunto" para ver el mensaje</h3>';
            
        const tabla = document.createElement('table');
        tabla.classList.add("table", "table-bordered", "table-striped", "table-hover", "text-center", "table-secondary");
        tabla.innerHTML = `
            <tr>
                <th>Fecha y hora</th>
                <th>Nombre</th>
                <th>Asunto</th>
                <th></th>
            </tr> `;

        mensajes.forEach(mensaje => {
            const fila = document.createElement('tr');
            fila.id = `F${mensaje._id}`;
            fila.innerHTML += `
                    <td>${mensaje.fecha.slice(4, 21)}</td>
                    <td>${mensaje.nombre}</td>
                    <td class="hoveru">${mensaje.asunto}</td>
                    <td class="hoverb"> X </td>`;
            tabla.appendChild(fila);
        });
        divGenerado.appendChild(tabla);
    }
    fragmento.appendChild(divGenerado);
    divMensajes.appendChild(fragmento);
};

export { mostrarMensajes };