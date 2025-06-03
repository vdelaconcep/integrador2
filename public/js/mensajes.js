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

const mostrarMensaje = async (id) => {
    const divOverlay = document.querySelector('.overlay');
    const botonCerrar = document.getElementById('btn-cerrar-mensaje');
    const de = document.getElementById('de-mensaje');
    const asunto = document.getElementById('asunto-mensaje');
    const fecha = document.getElementById('fecha-mensaje');
    const mensaje = document.getElementById('mensaje');

    try {
        const res = await fetch('/api/mensajes/', {
            method: 'GET'
        })

        const mensajes = await res.json()

        if (!res.ok) {
            alert(`No se pueden obtener los mensajes de la base de datos: ${mensajes}`);
            return;
        };

        const esteMensaje = mensajes.find(elemento => elemento._id === id);
        de.innerHTML = esteMensaje.nombre;
        asunto.innerHTML = esteMensaje.asunto;
        fecha.innerHTML = esteMensaje.fecha.slice(4, 21);
        mensaje.innerHTML = esteMensaje.mensaje;
        divOverlay.style.display = 'block';

    } catch (err) {
        alert(`No se puede mostrar el mensaje: ${err.message}`);
    };

    botonCerrar.addEventListener('click', () => {
        divOverlay.style.display = 'none';
    });
}

export {
    eliminarMensaje,
    mostrarMensaje
};