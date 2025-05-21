const item = document.querySelectorAll('.dropdown-item');

item.forEach(element => {
    element.addEventListener('click', (event) => 
    event.stopPropagation());
})