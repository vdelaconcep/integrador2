import { obtenerMensajes } from "./consultasBD";

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
        const tabla = document.createElement('table');
        tabla.classList.add("table", "table-bordered", "table-striped", "table-hover", "text-center", "table-secondary");
        tabla.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>E-mail</th>
                <th>Asunto</th>
                <th>Fecha y hora</th>
                <th></th>
            </tr> `;

        mensajes.forEach(mensaje => {
            const fila = document.createElement('tr');
            fila.id = `F${mensaje._id}`;
            fila.innerHTML += `
                    <td>${mensaje.nombre}</td>
                    <td>${mensaje.email}</td>
                    <td>${mensaje.asunto}</td>
                    <td>${mensaje.fecha}</td>
                    <td> X </td>`;
            tabla.appendChild(fila);
        });
        divGenerado.appendChild(tabla);
    }
    fragmento.appendChild(divGenerado);
    divMensajes.appendChild(fragmento);
};

export { mostrarMensajes };