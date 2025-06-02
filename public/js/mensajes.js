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
    eliminarMensaje
};