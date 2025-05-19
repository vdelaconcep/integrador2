const listaDesplegable = document.querySelector('.lista-desplegable');
const botonDesplegable = document.getElementById('boton-desplegable');
const botonHamburguesa = document.getElementById('boton-hamburguesa');
const desplegableHamburguesa = document.getElementById('desplegable-hamburguesa')

botonDesplegable.addEventListener('click', () => {
    listaDesplegable.classList.toggle('ocultar')
})

botonHamburguesa.addEventListener('click', () => {
    desplegableHamburguesa.classList.toggle('ocultar')
})

