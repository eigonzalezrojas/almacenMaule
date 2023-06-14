/* autor: Eithel González Rojas */

//Obtenemos los id y las secciones de la estructura HTML
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content


//fragmento memoria volatil 
const fragment = document.createDocumentFragment()

//creación del carrito, coleccion de objetos
let carrito =  {}

//Esperamos que se cargue primero todo el HTML
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

cards.addEventListener('click', e =>{
    addCarrito(e)
})

//Realizamos la obtención de data desde el archivo json de productos
const fetchData = async()=>{
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data);
        pintarCards(data)
    } catch (error) {
        console.log(error);
    }
}

//Generamos los productos junto a su descripción
const pintarCards = (data)=>{
    //console.log(data);
    items.innerHTML = ''
    data.forEach( producto =>{
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('#precio').textContent = producto.precio
        templateCard.querySelector('#cantidad').textContent = producto.medida
        templateCard.querySelector('img').setAttribute("src", producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Acción de agregar producto ejecutado por botón comprar
const addCarrito = (e) =>{
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-dark'));
    if (e.target.classList.contains('btn-dark')) {
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    // Detenemos cualquier otro evento en cards
    e.stopPropagation()
}


const setCarrito = objeto =>{
    //console.log(obj);
    const producto = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        nombre : objeto.querySelector('h5').textContent,        
        precio : objeto.querySelector('#precio').textContent,
        medida : objeto.querySelector('#cantidad').textContent,
        cantidad : 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    //spread syntax => si NO existe se crea el producto, si NO existe lo sobre escribe
    carrito[producto.id] = {...producto}
    pintarCarrito()    
}

const pintarCarrito = () => {
    //console.log(carrito);
    items.innerHTML = ''
    //Recorremos los objetos del carrito
    Object.values(carrito).forEach(producto=>{
        //seleccionamos los elementos
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        //Botones acción agregar-eliminar
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)        
    })
    items.appendChild(fragment)
}