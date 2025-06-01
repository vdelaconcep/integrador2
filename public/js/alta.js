// Función para agregar producto a la base de datos
const agregarProducto = async () => {
    const productoTipo = document.getElementById('producto-tipo');
    const productoBanda = document.getElementById('producto-banda');
    const productoStock = document.getElementById('producto-stock');
    const productoPrecio = document.getElementById('producto-precio');

    // Enviar datos a la base de datos
    const fileInput = document.getElementById('imagen-producto');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('tipo', productoTipo.value);
    formData.append('banda', productoBanda.value);
    formData.append('stock', productoStock.value);
    formData.append('precio', productoPrecio.value);
    formData.append('image', file);

    try {
        const res = await fetch('/api/productos', {
            method: 'POST',
            body: formData
        });

        const json = await res.json();

        if (res.status === 200) {
            alert('Se guardó el nuevo producto');
            window.location.replace('/alta');
        } else {
            alert(`No se han podido guardar los datos: ${json.error || "error desconocido"}`);
        }
    } catch (err) {
        alert(`Error al guardar producto: ${err.message}`);
    }
};

export { agregarProducto };

// La remera de La Renga #2 está en https://i.imgur.com/5FdU5Da.jpeg