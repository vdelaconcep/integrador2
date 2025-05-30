

// Función para evitar ingreso de código
const contieneEtiquetasHTML = (contenido) => /<[^>]*>/.test(contenido);

// Función para validar input nombre
function validarNombre(inputNombre, minlength, maxlength) {
    if (!inputNombre) return null;

    inputNombre.addEventListener('input', () => {
        inputNombre.setCustomValidity("");
    });

    let valor = inputNombre.value;

    if (valor.trim().length === 0) {
        inputNombre.setCustomValidity('Ingresá tu nombre');
        return null;
    } else if (valor.trim().length < minlength) {
        inputNombre.setCustomValidity('Este campo debe tener ' + minlength + ' caracteres como mínimo');
        return null;
    } else if (valor.trim().length > maxlength) {
        inputNombre.setCustomValidity('Este campo no puede tener más de ' + maxlength + ' caracteres');
        return null;
    } else if (contieneEtiquetasHTML(valor)) {
        inputNombre.setCustomValidity('Los datos ingresados no pueden contener etiquetas HTML');
        return null;
    } else return valor;
};

// Función para validar input email
function validarEmail(inputEmail) {
    if (!inputEmail) return null;

    inputEmail.addEventListener('input', () => {
        inputEmail.setCustomValidity("");
    });

    let valor = inputEmail.value;

    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (valor.trim().length === 0) {
        inputEmail.setCustomValidity('Ingresá tu dirección de e-mail');
        return null;
    } else if (!regex.test(valor)) {
        inputEmail.setCustomValidity('Debe ingresar un e-mail válido');
        return null;
    } else return valor;
};

// Función para validar input asunto
function validarAsunto(inputAsunto, maxlength) {
    if (!inputAsunto) return null;

    inputAsunto.addEventListener('input', () => {
        inputAsunto.setCustomValidity("");
    });

    let valor = inputAsunto.value;

    if (valor.trim().length === 0) {
        inputAsunto.setCustomValidity('Ingresá un asunto');
        return null;
    } else if (valor.trim().length > maxlength) {
        inputAsunto.setCustomValidity('Este campo no puede tener más de ' + maxlength + ' caracteres');
        return null;
    } else if (contieneEtiquetasHTML(valor)) {
        inputAsunto.setCustomValidity('El asunto no puede contener etiquetas HTML');
        return null;
    } else return valor;
};

// Función para validar mensaje
function validarMensaje(textoMensaje, maxlength) {
    if (!textoMensaje) return null;

    textoMensaje.addEventListener('input', () => {
        textoMensaje.setCustomValidity("");
    });

    let valor = textoMensaje.value;

    if (valor.trim().length === 0) {
        textoMensaje.setCustomValidity('El mensaje no puede quedar vacío');
        return null;
    } else if (valor.trim().length > maxlength) {
        textoMensaje.setCustomValidity('El mensaje no puede contener más de '+ maxlength + ' caracteres');
        return null;
    } else if (contieneEtiquetasHTML(valor)) {
        textoMensaje.setCustomValidity('El mensaje no puede contener etiuetas HTML');
        return null;
    } else return valor;
};

// Función para enviar contenido del formulario
async function enviarMensaje(nombre, email, asunto, mensaje) {
        const datos = {
            nombre: nombre,
            email: email,
            asunto: asunto,
            mensaje: mensaje
        };

        try {
            const res = await fetch('/api/mensaje', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(datos)
            });
            if (!res.ok) {
                const mensajeError = await res.text();
                alert(`Error al enviar el mensaje: ${mensajeError}`);
            } else {
                alert('Tu mensaje se envió con éxito');
                window.location.replace('/contacto');
            }
        } catch (err) {
            alert(`Error al enviar el mensaje: ${err.message}`);
        };
    };

export {
    validarNombre,
    validarEmail,
    validarAsunto,
    validarMensaje,
    enviarMensaje
};