//Obtenemos los id de los elementos HTML
const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
//fragmento memoria volatil 
const fragment = document.createDocumentFragment()

//creación del carrito, coleccion de objetos
let carrito =  {}

//Esperamos que se cargue primero todo el HTML
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

items.addEventListener('click', e =>{
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

const pintarCards = (data)=>{
    data.forEach(producto=>{
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('#precio').textContent = `$ ${producto.precio}`
        templateCard.querySelector('#cantidad').textContent = producto.medida
        templateCard.querySelector('img').setAttribute("src", producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const addCarrito = (e) =>{
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-dark'));
    if (e.target.classList.contains('btn-dark')) {
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    // Detenemos cualquier otro evento en items
    e.stopPropagation()
}

const setCarrito = objeto =>{
    //console.log(obj);
    const producto = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        nombre : objeto.querySelector('h5').textContent,        
        precio : objeto.querySelector('#precio').textContent,
        medida : objeto.querySelector('#cantidad').textContent
    }
    console.log(producto);

}