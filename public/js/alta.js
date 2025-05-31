import { buscarProducto } from './consultasBD.js';

// Función para definir modelo de producto automáticamente
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

// Dunción para agregar producto a la base de datos
const agregarProducto = async () => {
    const productoTipo = document.getElementById('producto-tipo');
    const productoBanda = document.getElementById('producto-banda');
    const productoStock = document.getElementById('producto-stock');
    const productoPrecio = document.getElementById('producto-precio');
    const productoModelo = await modelo(productoBanda.value, productoTipo.value);

    if (!productoModelo) return alert('No se ha podido agregar el producto');

    // Subir imagen a Imgur
    const fileInput = document.getElementById('imagen-producto');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);

    let productoImagen = '';

    try {
        const res = await fetch('/api/productos/upload', {
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
};

export { agregarProducto };

// La remera de La Renga #2 está en https://i.imgur.com/5FdU5Da.jpeg